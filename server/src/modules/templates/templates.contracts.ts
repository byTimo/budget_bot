export interface Templates {
    start: object,
}

export type TemplateType = keyof Templates;
export type TemplateData<T extends TemplateType> = Templates[T];
