import { Module } from "@nestjs/common";
import { TunnelService } from "./tunnel.service";
import { LoggerModule } from "../logger/logger.module";
import { ConfigModule } from "../config/config.module";

@Module({
    imports: [LoggerModule, ConfigModule],
    providers: [TunnelService],
    exports: [TunnelService],
})
export class TunnelModule {}
