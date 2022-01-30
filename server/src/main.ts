import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app.module";
import { getBotToken } from "nestjs-telegraf";
import { Telegraf } from "telegraf";
import { ConfigService } from "./modules/config/config.service";
import { Logger } from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const logger = app.get(Logger);
    const bot = app.get<Telegraf>(getBotToken());
    const config = app.get(ConfigService);
    app.use(bot.webhookCallback("/tg_hook"));
    await app.listen(config.port, () => {
        logger.log(`The application server was started on port ${config.port}`);
    });
    return app;
}

bootstrap();
