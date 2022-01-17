import { Module } from "@nestjs/common";
import { TestUpdate } from "./test.update";
import { TestScene } from "./test.scene";

@Module({
    providers: [TestUpdate, TestScene],
})
export class TestModule {}
