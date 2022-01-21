import { SceneContext, WizardContext, WizardSessionData } from "telegraf/typings/scenes";

export type TelegrafContext = SceneContext;
export type TelegrafWizardContext<T extends WizardSessionData> = WizardContext<T>
