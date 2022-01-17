import { Scene, SceneEnter, Action } from "nestjs-telegraf";
import { SCENES } from "../telegram.constants";
import { TelegrafContext } from "../../../types/telegraf";
import { GoogleAuthService } from "../../google/auth/googleAuth.service";

@Scene(SCENES.STATUS)
export class StatusScene {
    constructor(private readonly googleAuth: GoogleAuthService) {
    }

    @SceneEnter()
    async enter(ctx: TelegrafContext) {
        const googleAuthStatus = this.googleAuth.getStatus();
        await ctx.reply(`Состояние сервиса
        Google OAuth: ${googleAuthStatus}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "На главную", callback_data: "back" }]
                ]
            }
        });
    }

    @Action("back")
    async back(ctx: TelegrafContext) {
        await ctx.scene.enter(SCENES.MAIN);
    }
}
