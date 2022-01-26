import { Injectable } from "@nestjs/common";
import { FilesService } from "../files/files.service";
import { resolve } from "path";
import { TemplateType, TemplateData, templateMetaMap } from "./templates.contracts";
import Mustache = require("mustache");

@Injectable()
export class TemplatesService {
    private readonly templateCache: Partial<Record<TemplateType, string>> = {};

    constructor(private readonly files: FilesService) {
    }

    async render<T extends TemplateType>(type: T, data: TemplateData<T>): Promise<string> {
        const meta = templateMetaMap[type];
        const template = await this.resolveTemplate(type);
        const partials = meta?.partials ? await this.resolveTemplates(meta.partials) : undefined;
        return Mustache.render(template, data, partials);
    }

    private async resolveTemplates<T extends TemplateType[]>(types: T): Promise<Record<T[number], string>> {
        const data = await Promise.all(types.map(async type => ({
            type,
            template: await this.resolveTemplate(type)
        })));

        return data.reduce((acc, { type, template }) => {
            acc[type] = template;
            return acc;
        }, {} as any);
    }

    private async resolveTemplate(type: TemplateType): Promise<string> {
        const cachedTemplate = this.templateCache[type];
        if (cachedTemplate) {
            return cachedTemplate;
        }

        const path = resolve(__dirname, "templates", `${type}.mustache`);
        const template = await this.files.read(path, "utf8");

        if (template.success) {
            this.templateCache[type] = template.data;
            return template.data;
        }

        throw new Error(`Can't read template ${path}`);
    }
}
