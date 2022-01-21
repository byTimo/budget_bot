import { WizardStep, Action, SceneEnter, Wizard } from "nestjs-telegraf";
import { TelegrafContext, TelegrafWizardContext } from "../../../types/telegraf";
import { isCallbackQueryUpdate, isDataCallbackQuery } from "../../../utils/telegraf";
import { Scenes, Markup } from "telegraf";
import { Logger } from "@nestjs/common";

const SCENE_ID = "EXPENSES_WIZARD";

interface ExpensesWizardData extends Scenes.WizardSessionData {
    sum?: number;
    date?: string;
    category?: string;
}

//TODO (byTimo) общее решение по логированию шагов визардов и сцен
@Wizard(SCENE_ID)
export class ExpensesWizard {
    constructor(private readonly logger: Logger) {
    }

    static enter(ctx: TelegrafContext, sum: number): Promise<unknown> {
        return ctx.scene.enter(SCENE_ID, { sum });
    }

    @SceneEnter()
    async handleEnter(ctx: TelegrafWizardContext<ExpensesWizardData>) {
        //TODO (byTimo) оч странно это перекладывать
        ctx.scene.session.sum = (ctx.scene.state as any).sum;

        await ctx.reply(`- ${ctx.scene.session.sum} -\nDate:`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "20.01.2021", callback_data: "20.01.2021" }],
                    [{ text: "19.01.2021", callback_data: "20.01.2021" }],
                    [{ text: "18.01.2021", callback_data: "20.01.2021" }],
                    [{ text: "17.01.2021", callback_data: "20.01.2021" }],
                ]
            }
        });
    }

    @WizardStep(1)
    @Action(/\d\d\.\d\d\.\d\d\d\d/)
    async resolveDateByAction(ctx: TelegrafWizardContext<ExpensesWizardData>) {
        if (!isCallbackQueryUpdate(ctx.update) || !isDataCallbackQuery(ctx.update.callback_query)) {
            return;
        }

        ctx.scene.session.date = ctx.update.callback_query.data;
        ctx.wizard.next();

        await ctx.reply(`${ctx.scene.session.date} ${ctx.scene.session.sum} -\nCategory:`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Продукты", callback_data: "Продукты" }],
                    [{ text: "Транспорт", callback_data: "Транспорт" }],
                    [{ text: "Еда", callback_data: "Еда" }],
                ]
            }
        });
    }

    @WizardStep(2)
    @Action(/.+/)
    async resolveCategoryByAction(ctx: TelegrafWizardContext<ExpensesWizardData>) {
        if (!isCallbackQueryUpdate(ctx.update) || !isDataCallbackQuery(ctx.update.callback_query)) {
            return;
        }

        ctx.scene.session.category = ctx.update.callback_query.data;
        ctx.wizard.next();

        await ctx.reply(
            `${ctx.scene.session.date} ${ctx.scene.session.sum} ${ctx.scene.session.category}\nOK?:`,
            Markup.inlineKeyboard([
                Markup.button.callback("Ok", "/ok"),
            ])
        );
    }

    @WizardStep(3)
    @Action("/ok")
    async resolveApproveByAction(ctx: TelegrafWizardContext<ExpensesWizardData>) {
        await ctx.reply(`${ctx.scene.session.date} ${ctx.scene.session.sum} ${ctx.scene.session.category} was written`);
        await ctx.scene.leave();
    }
}
