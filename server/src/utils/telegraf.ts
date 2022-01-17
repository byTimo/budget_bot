import type { Update, Message } from "telegraf/typings/core/types/typegram";

export function isMessageUpdate(update: Update.AbstractUpdate): update is Update.MessageUpdate {
    return "message" in update;
}

export function isTextMessage(message: Message.ServiceMessage): message is Message.TextMessage {
    return "text" in message;
}
