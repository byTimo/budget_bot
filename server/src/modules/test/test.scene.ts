import { Scene, SceneEnter, Action } from "nestjs-telegraf";
import { TelegrafContext } from "../../types/telegraf";

@Scene("TEST_SCENE")
export class TestScene {
    @SceneEnter()
    async enter(ctx: TelegrafContext) {
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
    async onAction(ctx: TelegrafContext) {
        const query = ctx.callbackQuery;
        if (this.hasData(query)) {
            await ctx.reply(query.data);
        }
    }

    private hasData<T>(value: T): value is T & { data: string } {
        return "data" in value;
    }
}
