import { Action, Scene, SceneEnter, Hears } from "nestjs-telegraf";
import {
    TelegrafContext,
    TelegrafSceneContext,
    TelegrafTextSceneContext,
    TelegrafActionSceneContext
} from "../../../types/telegraf";
import { restoreSessionData } from "../../../utils/telegraf";
import { Scenes, Markup } from "telegraf";
import { Logger } from "@nestjs/common";
import { CategoriesService } from "../../categories/categories.service";
import { isMatch } from "date-fns";
import { TransactionsService } from "../../transactions/transactions.service";
import { TemplatesService } from "../../templates/templates.service";
import { DatesService } from "../../dates/dates.service";

const SCENE_ID = "EXPENSES_WIZARD";

export interface ExpensesInitialState {
    sum: number;
}

interface ExpensesWizardData extends Scenes.WizardSessionData {
    sum?: number;
    date?: string;
    category?: string;
}

//TODO (byTimo) общее решение по логированию шагов визардов и сцен
@Scene(SCENE_ID)
export class ExpensesWizard {
    constructor(
        private readonly logger: Logger,
        private readonly categories: CategoriesService,
        private readonly dates: DatesService,
        private readonly transactions: TransactionsService,
        private readonly templates: TemplatesService,
    ) {
    }

    static async enter(ctx: TelegrafContext, initialState: ExpensesInitialState) {
        await ctx.scene.enter(SCENE_ID, initialState);
    }

    @SceneEnter()
    async handleEnter(ctx: TelegrafSceneContext<ExpensesWizardData>) {
        restoreSessionData<ExpensesWizardData, ExpensesInitialState>(ctx, x => x);
        const categories = await this.categories.popular();
        ctx.scene.session.category = categories[0];
        ctx.scene.session.date = this.dates.suggestInitialDate();
        return this.display(ctx);
    }

    @Action("ok")
    async handleSaveAction(ctx: TelegrafActionSceneContext<ExpensesWizardData>): Promise<void> {
        const { date, sum, category } = ctx.scene.session;
        if (!date || !sum || !category) {
            throw new Error("Bad data in session");
        }

        await this.transactions.save({ date, sum, category });
        const message = await this.templates.render("transactionSaved", { date, sum, category });
        await ctx.editMessageText(
            message,
            { ...Markup.inlineKeyboard([]), parse_mode: "HTML" }
        );
        this.dates.saveLastUsed(date);
        return ctx.scene.leave();
    }

    @Action(/\d\d\.\d\d\.\d\d\d\d/)
    async handleDateAction(ctx: TelegrafActionSceneContext<ExpensesWizardData>): Promise<void> {
        const data = ctx.update.callback_query.data;
        if (isMatch(data, DatesService.dateFormat)) {
            return this.modifyDate(data, ctx, false);
        }
        return this.handleAction(ctx);
    }

    @Action(/.*/)
    async handleAction(ctx: TelegrafActionSceneContext<ExpensesWizardData>): Promise<void> {
        return this.modifyCategory(ctx.update.callback_query.data, ctx, true);
    }

    @Hears(/\d\d\.\d\d\.\d\d\d\d/)
    async handleDateText(ctx: TelegrafTextSceneContext<ExpensesWizardData>): Promise<void> {
        const text = ctx.update.message.text;
        if (isMatch(text, DatesService.dateFormat)) {
            return this.modifyDate(text, ctx, false);
        }
        return this.handleText(ctx);
    }

    @Hears(/.*/)
    async handleText(ctx: TelegrafTextSceneContext<ExpensesWizardData>): Promise<void> {
        return this.modifyCategory(ctx.update.message.text, ctx, false);
    }

    private modifyDate(date: string, ctx: TelegrafSceneContext<ExpensesWizardData>, update: boolean): Promise<void> {
        ctx.scene.session.date = date;
        return this.display(ctx, update);
    }

    private modifyCategory(
        category: string,
        ctx: TelegrafSceneContext<ExpensesWizardData>,
        update: boolean
    ): Promise<void> {
        ctx.scene.session.category = category;
        return this.display(ctx, update);
    }

    private async display(ctx: TelegrafSceneContext<ExpensesWizardData>, update = false): Promise<void> {
        const { date, sum, category } = ctx.scene.session;
        const categories = await this.categories.popular();

        const dateButtons =
            this.dates.suggestFastDates(date)
                .map(x => Markup.button.callback(x, x));

        const categoryButtons = categories
            .filter(x => x !== category)
            .slice(0, 4)
            .map(x => Markup.button.callback(x, x));

        const markup = Markup.inlineKeyboard([
            Markup.button.callback("Ok", "ok"),
            Markup.button.callback("Отмена", "cancel"),
            ...dateButtons,
            ...categoryButtons,
        ], { columns: 2 });

        const message = await this.templates.render("newTransaction", ctx.scene.session);

        update
            ? await ctx.editMessageText(message, {
                ...markup,
                parse_mode: "HTML"
            })
            : await ctx.replyWithHTML(message, markup);
    }
}
