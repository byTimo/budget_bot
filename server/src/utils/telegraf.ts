import type { Update, Message } from "telegraf/typings/core/types/typegram";
import { CallbackQuery } from "typegram/callback";

export function isMessageUpdate(update: Update.AbstractUpdate): update is Update.MessageUpdate {
    return "message" in update;
}

export function isCallbackQueryUpdate(update: Update.AbstractUpdate): update is Update.CallbackQueryUpdate {
    return "callback_query" in update;
}

export function isTextMessage(message: Message.ServiceMessage): message is Message.TextMessage {
    return "text" in message;
}

export function isDataCallbackQuery(callbackQuery: CallbackQuery.AbstractCallbackQuery): callbackQuery is CallbackQuery.DataCallbackQuery {
    return "data" in callbackQuery;
}
