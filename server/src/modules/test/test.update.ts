import { Update, Start, Help, On, Hears } from "nestjs-telegraf";
import { Context } from "telegraf";
import { TelegrafContext } from "../../types/telegraf";

@Update()
export class TestUpdate {
    // @Start()
    // async start(ctx: Context) {
    //     await ctx.reply("Welcome");
    // }
    //
    // @Help()
    // async help(ctx: Context) {
    //     await ctx.reply("Send me sticker");
    // }
    //
    // @On("sticker")
    // async onSticker(ctx: Context) {
    //     await ctx.reply("good");
    // }
    //
    // @Hears("hi")
    // async hearsHi(ctx: Context) {
    //     await ctx.reply("Hi");
    // }

    @Hears("test")
    public async lol(ctx: TelegrafContext) {
        await ctx.scene.enter("TEST_SCENE");
    }
}
