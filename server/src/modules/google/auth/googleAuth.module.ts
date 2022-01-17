import { Module } from "@nestjs/common";
import { GoogleAuthService } from "./googleAuth.service";
import { ConfigModule } from "../../config/config.module";

@Module({
    imports: [ConfigModule],
    providers: [GoogleAuthService],
    exports: [GoogleAuthService],
})
export class GoogleAuthModule {}
