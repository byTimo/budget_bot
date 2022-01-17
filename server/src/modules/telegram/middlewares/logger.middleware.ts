import { Middleware } from "telegraf";
import { TelegrafContext } from "../../../types/telegraf";
import { Logger } from "@nestjs/common";
import { isMessageUpdate, isTextMessage, isCallbackQueryUpdate, isDataCallbackQuery } from "../../../utils/telegraf";

export const telegrafLogger = (logger: Logger): Middleware<TelegrafContext> => (ctx, next) => {
    if (isMessageUpdate(ctx.update) && isTextMessage(ctx.update.message)) {
        const { date, from, text } = ctx.update.message;
        logger.log(`Message: ${date} from ${from.username}: ${text.length > 50 ? text.slice(0, 50) : text}`);
    } else if (isCallbackQueryUpdate(ctx.update) && isDataCallbackQuery(ctx.update.callback_query)) {
        const { data, from } = ctx.update.callback_query;
        logger.log(`CallbackQuery: from ${from.username}: ${data.length > 50 ? data.slice(0, 50) : data}`);
    } else {
        logger.log(`Unsupported update type`);
    }
    return next();
};
