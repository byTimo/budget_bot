import { Module } from "@nestjs/common";
import { ConfigModule as DefaultConfigModule } from "@nestjs/config";
import { ConfigService } from "./config.service";

@Module({
    imports: [DefaultConfigModule.forRoot()],
    providers: [ConfigService],
    exports: [ConfigService]
})
export class ConfigModule {}
