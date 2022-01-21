import { Scene, SceneEnter, Action } from "nestjs-telegraf";
import { TelegrafContext } from "../../../types/telegraf";
import { GoogleAuthService } from "../../google/auth/googleAuth.service";

const SCENE_ID = "STATUS_SCENE";

@Scene(SCENE_ID)
export class StatusScene {
    constructor(private readonly googleAuth: GoogleAuthService) {
    }

    static enter(ctx: TelegrafContext): Promise<unknown> {
        return ctx.scene.enter(SCENE_ID);
    }

    @SceneEnter()
    async handleEnter(ctx: TelegrafContext) {
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
    async handleBackAction(ctx: TelegrafContext) {
        await ctx.scene.leave();
    }
}
