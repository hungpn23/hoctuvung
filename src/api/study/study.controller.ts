import { ApiEndpoint } from "@common/decorators/api-endpoint.decorator";
import { Payload } from "@common/decorators/jwt-payload.decorator";
import type { UUID } from "@common/types/branded.type";
import {
	Body,
	Controller,
	Get,
	Param,
	ParseUUIDPipe,
	Post,
} from "@nestjs/common";
import { SaveAnswersDto } from "./study.dto";
import { StudyService } from "./study.service";

@Controller("study")
export class StudyController {
	constructor(private readonly studyService: StudyService) {}

	@ApiEndpoint()
	@Post("save-answer/:deckId")
	async saveAnswers(
		@Payload("userId") userId: UUID,
		@Param("deckId", ParseUUIDPipe) deckId: UUID,
		@Body() dto: SaveAnswersDto,
	) {
		return await this.studyService.saveAnswers(userId, deckId, dto);
	}

	@ApiEndpoint()
	@Get("stats")
	async getUserStats(@Payload("userId") userId: UUID) {
		return await this.studyService.getUserStats(userId);
	}
}
