import { Scene, SceneEnter, Action } from "nestjs-telegraf";
import { TelegrafContext } from "../../../types/telegraf";
import { StatusScene } from "./StatusScene";
import { Markup } from "telegraf";
import { GoogleAuthScene } from "./GoogleAuthScene";

const SCENE_ID = "SETTINGS_SCENE";

const enterKeyboard = Markup.inlineKeyboard([
    Markup.button.callback("Состояние", "status"),
    Markup.button.callback("Авторизоваться в Google", "googleAuth"),
    Markup.button.callback("Назад", "back"),
]);

@Scene(SCENE_ID)
export class SettingsScene {
    static async enter(ctx: TelegrafContext) {
        await ctx.scene.enter(SCENE_ID);
    }

    @SceneEnter()
    async handleEnter(ctx: TelegrafContext) {
        await ctx.reply("Доступные команды", enterKeyboard);
    }

    @Action("status")
    async status(ctx: TelegrafContext) {
        await StatusScene.enter(ctx);
    }

    @Action("googleAuth")
    async googleAuth(ctx: TelegrafContext) {
        await GoogleAuthScene.enter(ctx);
    }

    @Action("back")
    async back(ctx: TelegrafContext) {
        await ctx.scene.leave();
    }
}
