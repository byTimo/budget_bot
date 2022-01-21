import { Update, Hears, Settings } from "nestjs-telegraf";
import { TelegrafContext } from "../../types/telegraf";
import { isMessageUpdate, isTextMessage } from "../../utils/telegraf";
import { ExpensesWizard } from "./wizards/ExpensesWizard";
import { SettingsScene } from "./scenes/SettingsScene";

@Update()
export class TelegramUpdate {
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
        await ExpensesWizard.enter(ctx, sum);
    }
}
