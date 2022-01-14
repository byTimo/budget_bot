import { Module } from "@nestjs/common";
import { TestModule } from "./modules/test/test.module";

@Module({
    imports: [TestModule]
})
export class AppModule {}
