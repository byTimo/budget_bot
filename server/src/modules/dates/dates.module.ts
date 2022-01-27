import { Module } from "@nestjs/common";
import { LoggerModule } from "../logger/logger.module";
import { DatesService } from "./dates.service";

@Module({
    imports: [LoggerModule],
    providers: [DatesService],
    exports: [DatesService]
})
export class DatesModule {}
