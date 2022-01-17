import { Scene, SceneEnter, Hears } from "nestjs-telegraf";
import { SCENES } from "../telegram.constants";
import { TelegrafContext } from "../../../types/telegraf";
import { GoogleAuthService } from "../../google/auth/googleAuth.service";
import { isMessageUpdate, isTextMessage } from "../../../utils/telegraf";

@Scene(SCENES.GOOGLE_AUTH)
export class GoogleAuthScene {
    constructor(private readonly googleAuth: GoogleAuthService) {
    }

    @SceneEnter()
    async enter(ctx: TelegrafContext) {
        const authUrl = this.googleAuth.generateAuthUrl();
        await ctx.reply(`Авторизуйся по URL: ${authUrl}`);
    }

    @Hears(/.*/)
    async code(ctx: TelegrafContext) {
        if (isMessageUpdate(ctx.update) && isTextMessage(ctx.update.message)) {
            const code = ctx.update.message.text;
            console.log(code);
            try {
                await this.googleAuth.restoreToken(code);
                await ctx.reply("Все получилось :)");
                await ctx.scene.enter(SCENES.MAIN);
            } catch (e) {
                console.error(e);
                await ctx.reply(`Ошибка: ${e}`);
                return;
            }
        }

        await ctx.reply("Не понял код авторизации :(");
    }
}
