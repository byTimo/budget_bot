import { Injectable } from "@nestjs/common";
import { FilesService } from "../files/files.service";
import { resolve } from "path";
import { TemplateType, TemplateData } from "./templates.contracts";
import Mustache = require("mustache");

const paths: Record<TemplateType, string> = {
    start: resolve(__dirname, "./templates/start.mustache"),
};

@Injectable()
export class TemplatesService {
    constructor(private readonly files: FilesService) {
    }

    async render<T extends TemplateType>(type: T, data: TemplateData<T>): Promise<string> {
        const path = paths[type];
        const template = await this.files.read(path, "utf8");
        if (template.success) {
            return Mustache.render(template.data, data);
        }

        throw new Error(`Can't read template ${path}`);
    }
}
