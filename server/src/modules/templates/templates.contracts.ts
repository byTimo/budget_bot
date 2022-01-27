export interface Templates {
    start: object,
    transaction: {
        date?: string;
        sum?: number;
        category?: string;
    },
    newTransaction: Templates["transaction"];
    transactionSaved: Templates["transaction"];
    transactionCanceled: Templates["transaction"];
}

export type TemplateType = keyof Templates;

export interface TemplateMeta {
    partials: TemplateType[];
}

export const templateMetaMap: Partial<Record<TemplateType, TemplateMeta>> = {
    newTransaction: {
        partials: ["transaction"],
    },
    transactionSaved: {
        partials: ["transaction"],
    },
    transactionCanceled: {
        partials: ["transaction"],
    }
};

export type TemplateData<T extends TemplateType> = Templates[T];
