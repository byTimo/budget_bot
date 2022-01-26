import { Update, Hears, Settings, Start } from "nestjs-telegraf";
import { TelegrafContext } from "../../types/telegraf";
import { isMessageUpdate, isTextMessage } from "../../utils/telegraf";
import { ExpensesWizard } from "./wizards/ExpensesWizard";
import { SettingsScene } from "./scenes/SettingsScene";
import { TemplatesService } from "../templates/templates.service";

@Update()
export class TelegramUpdate {
    constructor(private readonly templates: TemplatesService) {
    }

    @Start()
    async handleStart(ctx: TelegrafContext) {
        const message = await this.templates.render("start", {});
        await ctx.replyWithHTML(message);
    }

    @Settings()
    async settings(ctx: TelegrafContext) {
        if (ctx.scene.current) {
            return;
        }
        await SettingsScene.enter(ctx);
    }

    @Hears(/.+/)
    async any(ctx: TelegrafContext) {
        if (ctx.scene.current) {
            return;
        }

        if (!isMessageUpdate(ctx.update) || !isTextMessage(ctx.update.message)) {
            return;
        }
        const text = ctx.update.message.text;
        const sum = parseFloat(text);
        await ExpensesWizard.enter(ctx, { sum });
    }
}
