import { Scene, SceneEnter, Hears } from "nestjs-telegraf";
import { TelegrafContext } from "../../../types/telegraf";
import { GoogleAuthService } from "../../google/auth/googleAuth.service";
import { isMessageUpdate, isTextMessage } from "../../../utils/telegraf";

const SCENE_ID = "GOOGLE_AUTH_SCENE";

//TODO (byTimo) Перехеать на wizard
@Scene(SCENE_ID)
export class GoogleAuthScene {
    constructor(private readonly googleAuth: GoogleAuthService) {
    }

    static enter(ctx: TelegrafContext) {
        return ctx.scene.enter(SCENE_ID);
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
            try {
                await this.googleAuth.restoreToken(code);
                await ctx.reply("Все получилось :)");
                await ctx.scene.leave();
                return;
            } catch (e) {
                console.error(e);
                await ctx.reply(`Ошибка: ${e}`);
                return;
            }
        }

        await ctx.reply("Не понял код авторизации :(");
    }
}
