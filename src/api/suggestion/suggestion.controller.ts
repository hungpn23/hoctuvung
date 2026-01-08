import { ApiPublicEndpoint } from "@common/decorators/api-endpoint.decorator";
import { Body, Controller, Get, Post } from "@nestjs/common";
import { SuggestionService } from "./suggestion.service";

@Controller("suggestion")
export class SuggestionController {
	constructor(private readonly suggestionService: SuggestionService) {}

	@ApiPublicEndpoint()
	@Post("ingest")
	async ingestData() {
		return await this.suggestionService.ingestData();
	}

	@ApiPublicEndpoint()
	@Get("suggest")
	async suggest(@Body() body: { query: string }) {
		return await this.suggestionService.suggest(body.query, 1);
	}
}
