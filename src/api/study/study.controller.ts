import { ApiEndpoint } from '@common/decorators/api-endpoint.decorator';
import { Payload } from '@common/decorators/jwt-payload.decorator';
import type { JwtPayload } from '@common/types/auth.type';
import type { UUID } from '@common/types/branded.type';
import { Body, Controller, Param, Post } from '@nestjs/common';
import { SaveAnswersDto } from './dtos/study.dto';
import { StudyService } from './study.service';

@Controller('study')
export class StudyController {
  constructor(private readonly studyService: StudyService) {}

  @ApiEndpoint()
  @Post('save-answer/:deckId')
  async saveAnswers(
    @Payload() { userId }: JwtPayload,
    @Param('deckId') deckId: UUID,
    @Body() dto: SaveAnswersDto,
  ) {
    return await this.studyService.saveAnswers(userId, deckId, dto);
  }
}
