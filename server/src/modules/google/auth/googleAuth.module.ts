import { Module } from "@nestjs/common";
import { GoogleAuthService } from "./googleAuth.service";
import { ConfigModule } from "../../config/config.module";
import { FilesModule } from "../../files/files.module";
import { LoggerModule } from "../../logger/logger.module";

@Module({
    imports: [ConfigModule, FilesModule, LoggerModule],
    providers: [GoogleAuthService],
    exports: [GoogleAuthService],
})
export class GoogleAuthModule {}
