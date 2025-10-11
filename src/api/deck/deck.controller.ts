import { ApiEndpoint } from '@common/decorators/api-endpoint.decorator';
import { Payload } from '@common/decorators/jwt-payload.decorator';
import { QueryDto } from '@common/dtos/offset-pagination/offset-pagination.dto';
import type { JwtPayload } from '@common/types/auth.type';
import type { UUID } from '@common/types/branded.type';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { DeckService } from './deck.service';
import { CreateDeckDto, DeckDto, UpdateDeckDto } from './dtos/deck.dto';

@Controller('decks')
export class DeckController {
  constructor(private readonly deckService: DeckService) {}

  @ApiEndpoint({ type: DeckDto, isPaginated: true })
  @Get()
  async getMany(@Payload() { userId }: JwtPayload, @Query() query: QueryDto) {
    return await this.deckService.getMany(userId, query);
  }

  @ApiEndpoint({ type: DeckDto })
  @Post()
  async create(@Payload() { userId }: JwtPayload, @Body() dto: CreateDeckDto) {
    return await this.deckService.create(userId, dto);
  }

  @ApiEndpoint({ type: DeckDto })
  @Patch(':id')
  async update(
    @Payload() { userId }: JwtPayload,
    @Param('id') deckId: UUID,
    @Body() dto: UpdateDeckDto,
  ) {
    return await this.deckService.update(deckId, userId, dto);
  }

  @ApiEndpoint()
  @Delete(':id')
  async delete(@Payload() { userId }: JwtPayload, @Param('id') deckId: UUID) {
    return await this.deckService.delete(userId, deckId);
  }
}
