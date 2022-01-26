import { Module } from "@nestjs/common";
import { FilesModule } from "../files/files.module";
import { TemplatesService } from "./templates.service";

@Module({
    imports: [FilesModule],
    providers: [TemplatesService],
    exports: [TemplatesService]
})
export class TemplatesModule {}
