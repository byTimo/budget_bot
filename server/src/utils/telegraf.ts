import type { Update, Message } from "telegraf/typings/core/types/typegram";
import { CallbackQuery } from "typegram/callback";
import { TelegrafWizardContext, TelegrafSceneContext } from "../types/telegraf";
import { WizardSessionData, SceneSessionData } from "telegraf/typings/scenes";

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
