import { Scene, SceneEnter, Ctx, Action } from "nestjs-telegraf";
import { SceneContext } from "telegraf/typings/scenes";

@Scene("TEST_SCENE_1")
export class SheetsUpdate {
    @SceneEnter()
    async enter(@Ctx() ctx: SceneContext) {
        await ctx.reply("2+2=?", {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Может быть 4", callback_data: "4" }],
                    [{ text: "Может быть 5", callback_data: "5" }],
                ]
            }
        });
    }

    @Action(/4|5/)
    async onAction(
        @Ctx() ctx: SceneContext
    ) {
        const query = ctx.callbackQuery;
        if (this.hasData(query)) {
            await ctx.reply(query.data);
        }
    }

    private hasData<T>(value: T): value is T & { data: string } {
        return "data" in value;
    }
}
