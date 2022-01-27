import type { Update, Message } from "telegraf/typings/core/types/typegram";
import { CallbackQuery } from "typegram/callback";
import { TelegrafWizardContext, TelegrafSceneContext, TelegrafContext } from "../types/telegraf";
import { WizardSessionData, SceneSessionData } from "telegraf/typings/scenes";
import { Markup } from "telegraf";
import { InlineKeyboardMarkup } from "telegraf/src/core/types/typegram";

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

export function restoreSessionData<TSessionData extends SceneSessionData, TState>(
    ctx: TelegrafSceneContext<TSessionData>,
    mapper: (state: TState) => Partial<TSessionData>,
): void;
export function restoreSessionData<TSessionData extends WizardSessionData, TState>(
    ctx: TelegrafWizardContext<TSessionData>,
    mapper: (state: TState) => Partial<TSessionData>,
): void;
export function restoreSessionData(
    ctx: any,
    mapper: (state: any) => any,
): void {
    const session = mapper(ctx.scene.state);
    for (const key in session) {
        ctx.scene.session[key] = session[key];
    }
}

export async function updateOrResendHtml<T extends SceneSessionData = SceneSessionData>(
    ctx: TelegrafContext<T>,
    text: string,
    markup: Markup.Markup<InlineKeyboardMarkup> = Markup.inlineKeyboard([]),
    prevMessageId?: number,
    forceResend?: boolean,
): Promise<number> {
    if (forceResend || !prevMessageId) {
        const message = await ctx.replyWithHTML(text, markup);
        if (prevMessageId) {
            await ctx.deleteMessage(prevMessageId);
        }
        return message.message_id;
    }
    await ctx.editMessageText(text, {...markup, parse_mode: "HTML"});
    return prevMessageId;
}
