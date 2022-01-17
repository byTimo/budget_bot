import { Scene, SceneEnter, Action } from "nestjs-telegraf";
import { SCENES } from "../telegram.constants";
import { TelegrafContext } from "../../../types/telegraf";

@Scene(SCENES.MAIN)
export class MainScene {
    @SceneEnter()
    async enter(ctx: TelegrafContext) {
        await ctx.reply("Доступные команды", {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Состояние", callback_data: "status" }],
                    [{ text: "Авторизоваться в Google", callback_data: "googleAuth" }]
                ]
            }
        });
    }

    @Action("status")
    async status(ctx: TelegrafContext) {
        await ctx.scene.enter(SCENES.STATUS);
    }

    @Action("googleAuth")
    async googleAuth(ctx: TelegrafContext) {
        await ctx.scene.enter(SCENES.GOOGLE_AUTH);
    }
}
