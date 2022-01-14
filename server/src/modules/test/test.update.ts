import { Update, Start, Help, On, Hears } from "nestjs-telegraf";
import { Context } from "telegraf";

@Update()
export class TestUpdate {
    @Start()
    async start(ctx: Context) {
        await ctx.reply("Welcome");
    }

    @Help()
    async help(ctx: Context) {
        await ctx.reply("Send me sticker");
    }

    @On("sticker")
    async onSticker(ctx: Context) {
        await ctx.reply("good");
    }

    @Hears("hi")
    async hearsHi(ctx: Context) {
        await ctx.reply("Hi");
    }
}
