import { SceneContext, WizardContext, WizardSessionData, SceneSessionData } from "telegraf/typings/scenes";
import type { Update, Message, CallbackQuery } from "telegraf/typings/core/types/typegram";

export type TelegrafContext = SceneContext;

export type TelegrafSceneContext<T extends SceneSessionData = SceneSessionData> = SceneContext<T>
export type TelegrafTextSceneContext<T extends SceneSessionData = SceneSessionData> =
    TelegrafSceneContext<T> & { update: Update.MessageUpdate & { message: Message.TextMessage } }
export type TelegrafActionSceneContext<T extends SceneSessionData = SceneSessionData> =
    TelegrafSceneContext<T>
    & { update: Update.CallbackQueryUpdate & { callback_query: CallbackQuery.DataCallbackQuery } }

export type TelegrafWizardContext<T extends WizardSessionData> = WizardContext<T>
