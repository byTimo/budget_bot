import { Update, Start } from "nestjs-telegraf";
import { TelegrafContext } from "../../types/telegraf";
import { SCENES } from "./telegram.constants";

@Update()
export class TelegramUpdate {
    @Start()
    async start(ctx: TelegrafContext) {
        await ctx.scene.enter(SCENES.MAIN);
    }
}
