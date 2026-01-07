import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiPublicEndpoint } from "@common/decorators/api-endpoint.decorator";
import { SuggestionService } from "./suggestion.service";

@Controller("suggestion")
export class SuggestionController {
	constructor(private readonly suggestionService: SuggestionService) {}

	@ApiPublicEndpoint()
	@Get("ingest")
	async ingestData() {
		return await this.suggestionService.ingestData();
	}

	@ApiPublicEndpoint()
	@Post("suggest")
	async suggest(@Body() body: { query: string }) {
		return await this.suggestionService.suggest(body.query, 1);
	}
}
