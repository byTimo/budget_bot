import { Action, Scene, SceneEnter, Hears } from "nestjs-telegraf";
import { TelegrafContext, TelegrafSceneContext } from "../../../types/telegraf";
import {
    isCallbackQueryUpdate,
    isDataCallbackQuery,
    restoreSessionData,
    isMessageUpdate,
    isTextMessage
} from "../../../utils/telegraf";
import { Scenes, Markup } from "telegraf";
import { Logger } from "@nestjs/common";
import { CategoriesService } from "../../categories/categories.service";
import { CallbackQuery } from "typegram/callback";
import { Message } from "telegraf/typings/core/types/typegram";
import { parse, isMatch, add, format } from "date-fns";

const SCENE_ID = "EXPENSES_WIZARD";

export interface ExpensesInitialState {
    sum: number;
}

interface ExpensesWizardData extends Scenes.WizardSessionData {
    sum?: number;
    date?: string;
    category?: string;
}

const dateFormat = "dd.MM.yyyy";

//TODO (byTimo) общее решение по логированию шагов визардов и сцен
@Scene(SCENE_ID)
export class ExpensesWizard {
    constructor(private readonly logger: Logger, private readonly categories: CategoriesService) {
    }

    static async enter(ctx: TelegrafContext, initialState: ExpensesInitialState) {
        await ctx.scene.enter(SCENE_ID, initialState);
    }

    @SceneEnter()
    async handleEnter(ctx: TelegrafSceneContext<ExpensesWizardData>) {
        restoreSessionData<ExpensesWizardData, ExpensesInitialState>(ctx, x => x);
        const categories = await this.categories.popular();
        ctx.scene.session.category = categories[0];
        ctx.scene.session.date = format(new Date(), dateFormat);

        return this.display(ctx);
    }

    @Action(/.*/)
    @Hears(/.*/)
    async handle(ctx: TelegrafSceneContext<ExpensesWizardData>): Promise<void> {
        if (isCallbackQueryUpdate(ctx.update) && isDataCallbackQuery(ctx.update.callback_query)) {
            return this.handleCallbackQuery(ctx.update.callback_query, ctx);
        }

        if (isMessageUpdate(ctx.update) && isTextMessage(ctx.update.message)) {
            return this.handleTextMessage(ctx.update.message, ctx);
        }
    }

    private async handleCallbackQuery(
        callbackQuery: CallbackQuery.DataCallbackQuery,
        ctx: TelegrafSceneContext<ExpensesWizardData>
    ): Promise<void> {
        if (callbackQuery.data === "ok") {
            await ctx.editMessageText(
                `${this.format(ctx)}\n\nТранзакция сохранена`,
                { ...Markup.inlineKeyboard([]), parse_mode: "HTML" }
            );
            return ctx.scene.leave();
        }

        if (isMatch(callbackQuery.data, dateFormat)) {
            return this.modifyDate(callbackQuery.data, ctx, true);
        }

        return this.modifyCategory(callbackQuery.data, ctx, true);
    }

    private handleTextMessage(
        message: Message.TextMessage,
        ctx: TelegrafSceneContext<ExpensesWizardData>
    ): Promise<void> {
        if (isMatch(message.text, dateFormat)) {
            return this.modifyDate(message.text, ctx, false);
        }

        return this.modifyCategory(message.text, ctx, false);
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

        const dateButtons = Array.from({ length: 4 })
            .map((_, i) => format(add(parse(date!, dateFormat, new Date()), { days: -i - 1 }), dateFormat))
            .map(x => Markup.button.callback(x, x));

        const categoryButtons = categories
            .filter(x => x !== category)
            .slice(0, 4)
            .map(x => Markup.button.callback(x, x));

        const markup = Markup.inlineKeyboard([
            Markup.button.callback("Ok", "ok"),
            ...dateButtons,
            ...categoryButtons,
        ], { columns: 2 });

        update
            ? await ctx.editMessageText(`Новая транзакция:\n\n${this.format(ctx)}`, {
                ...markup,
                parse_mode: "HTML"
            })
            : await ctx.replyWithHTML(`Новая транзакция:\n\n${this.format(ctx)}`, markup);
    }


    private format(ctx: TelegrafSceneContext<ExpensesWizardData>) {
        const { category, sum, date } = ctx.scene.session;
        return `<b>${date ?? "{{DATE}}"}</b> - <b>${sum ?? "{{SUM}}"} - <b>${category ?? "{{CATEGORY}}"}</b></b>`;
    }
}
