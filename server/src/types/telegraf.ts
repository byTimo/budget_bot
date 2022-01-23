import { SceneContext, WizardContext, WizardSessionData, SceneSessionData } from "telegraf/typings/scenes";

export type TelegrafContext = SceneContext;
export type TelegrafSceneContext<T extends SceneSessionData> = SceneContext<T>
export type TelegrafWizardContext<T extends WizardSessionData> = WizardContext<T>
