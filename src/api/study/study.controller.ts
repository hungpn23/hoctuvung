import { ApiEndpoint } from '@common/decorators/api-endpoint.decorator';
import { Payload } from '@common/decorators/jwt-payload.decorator';
import type { JwtPayload } from '@common/types/auth.type';
import type { UUID } from '@common/types/branded.type';
import { Body, Controller, Param, Post } from '@nestjs/common';
import { StudySessionDto, SubmitReviewDto } from './dtos/study.dto';
import { StudyService } from './study.service';

@Controller('study')
export class StudyController {
  constructor(private readonly studyService: StudyService) {}

  @ApiEndpoint()
  @Post('handle-answer')
  async handleAnswer() {
    // return await this.studyService.handleAnswer();
  }

  @ApiEndpoint({ type: StudySessionDto })
  @Post('start-session/:deckId')
  async startSession(
    @Payload() { userId }: JwtPayload,
    @Param('deckId') deckId: UUID,
  ) {
    return await this.studyService.startSession(userId, deckId);
  }

  @ApiEndpoint({ type: StudySessionDto })
  @Post('review')
  async submitReview(
    @Payload() { userId }: JwtPayload,
    @Body() submitReviewDto: SubmitReviewDto,
  ) {
    return await this.studyService.processReview(userId, submitReviewDto);
  }
}
