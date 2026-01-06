import { Module } from "@nestjs/common";
import { EmbeddingService } from "./embedding.service";
import { FlowController } from "./flow.controller";
import { StoreService } from "./store.service";

@Module({
	controllers: [FlowController],
	providers: [EmbeddingService, StoreService],
})
export class LangchainModule {}
