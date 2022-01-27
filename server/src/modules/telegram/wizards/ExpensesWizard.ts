import { Action, Scene, SceneEnter, Hears, SceneLeave } from "nestjs-telegraf";
import {
    TelegrafContext,
    TelegrafSceneContext,
    TelegrafTextSceneContext,
    TelegrafActionSceneContext
} from "../../../types/telegraf";
import { restoreSessionData, updateOrResendHtml } from "../../../utils/telegraf";
import { Scenes, Markup } from "telegraf";
import { Logger } from "@nestjs/common";
import { CategoriesService } from "../../categories/categories.service";
import { isMatch } from "date-fns";
import { TransactionsService } from "../../transactions/transactions.service";
import { TemplatesService } from "../../templates/templates.service";
import { DatesService } from "../../dates/dates.service";
import { chain } from "iterable-chain";
import { zip } from "../../../utils/chain";

const SCENE_ID = "EXPENSES_WIZARD";

export interface ExpensesInitialState {
    sum: number;
}

interface ExpensesWizardData extends Scenes.WizardSessionData {
    sum: number;
    date?: string;
    category?: string;
}

//TODO (byTimo) общее решение по логированию шагов визардов и сцен
@Scene(SCENE_ID)
export class ExpensesWizard {
    private lastBotMessageId?: number;

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
        ctx.scene.session.category = await this.categories.suggestInitial();
        ctx.scene.session.date = this.dates.suggestInitial();
        return this.display(ctx, true);
    }

    @SceneLeave()
    handleLeave() {
        this.lastBotMessageId = undefined;
    }

    @Action("ok")
    async handleSaveAction(ctx: TelegrafActionSceneContext<ExpensesWizardData>): Promise<void> {
        const { date, sum, category } = ctx.scene.session;
        if (!date || !sum || !category) {
            throw new Error("Bad data in session");
        }

        await this.transactions.save({ date, sum, category });
        const text = await this.templates.render("transactionSaved", { date, sum, category });
        this.lastBotMessageId = await updateOrResendHtml(ctx, text);
        await ctx.scene.leave();
    }

    @Action("cancel")
    async handleCancelAction(ctx: TelegrafActionSceneContext<ExpensesWizardData>): Promise<void> {
        const text = await this.templates.render("transactionCanceled", ctx.scene.session);
        await ctx.editMessageText(text, { ...Markup.inlineKeyboard([]), parse_mode: "HTML" });
        await ctx.scene.leave();
    }

    @Action("more_categories")
    async handleMoreCategoriesAction(ctx: TelegrafActionSceneContext<ExpensesWizardData>): Promise<void> {
        const { category } = ctx.scene.session;
        const categories = await this.categories.suggestAll();

        const markup = Markup.inlineKeyboard(
            categories.map(x => Markup.button.callback(x === category ? `✅ ${x}` : x, x)),
            { columns: categories.length % 3 === 0 ? 3 : 4 }
        );

        const text = await this.templates.render("newTransaction", ctx.scene.session);
        this.lastBotMessageId = await updateOrResendHtml(ctx, text, markup, this.lastBotMessageId);
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
        return this.modifyCategory(ctx.update.callback_query.data, ctx, false);
    }

    @Hears(/\d\d\.\d\d\.\d\d\d\d/)
    async handleDateText(ctx: TelegrafTextSceneContext<ExpensesWizardData>): Promise<void> {
        const text = ctx.update.message.text;
        if (isMatch(text, DatesService.dateFormat)) {
            return this.modifyDate(text, ctx, true);
        }
        return this.handleText(ctx);
    }

    @Hears(/.*/)
    async handleText(ctx: TelegrafTextSceneContext<ExpensesWizardData>): Promise<void> {
        return this.modifyCategory(ctx.update.message.text, ctx, true);
    }

    private modifyDate(
        date: string,
        ctx: TelegrafSceneContext<ExpensesWizardData>,
        sendNewMessage: boolean
    ): Promise<void> {
        ctx.scene.session.date = date;
        this.dates.saveLastUsed(date);
        return this.display(ctx, sendNewMessage);
    }

    private modifyCategory(
        category: string,
        ctx: TelegrafSceneContext<ExpensesWizardData>,
        sendNewMessage: boolean
    ): Promise<void> {
        ctx.scene.session.category = category;
        return this.display(ctx, sendNewMessage);
    }

    private async display(ctx: TelegrafSceneContext<ExpensesWizardData>, sendNewMessage: boolean): Promise<void> {
        const { date, category } = ctx.scene.session;
        const categories = await this.categories.suggestFast(category);

        const dateButtons = chain(this.dates.suggestFast(date))
            .map(x => Markup.button.callback(x, x));

        const categoryButtons = chain(categories)
            .map(x => Markup.button.callback(x, x));

        const markup = Markup.inlineKeyboard(
            zip(dateButtons, categoryButtons)
                .flatMap(x => x)
                //TODO (byTimo) bag in chain
                .append(Markup.button.callback("Отмена", "cancel"))
                //TODO (byTimo) bag in chain
                .append(Markup.button.callback("Ok", "ok"))
                //TODO (byTimo) bag in chain
                .prepend(Markup.button.callback("Больше дат", "more_dates"))
                //TODO (byTimo) bag in chain
                .prepend(Markup.button.callback("Больше категорий", "more_categories"))
                .toArray(),
            { columns: 2 }
        );

        const text = await this.templates.render("newTransaction", ctx.scene.session);

        this.lastBotMessageId = await updateOrResendHtml(ctx, text, markup, this.lastBotMessageId, sendNewMessage);
    }
}
