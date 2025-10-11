import { ApiEndpoint } from '@common/decorators/api-endpoint.decorator';
import { Payload } from '@common/decorators/jwt-payload.decorator';
import { QueryDto } from '@common/dtos/offset-pagination/offset-pagination.dto';
import type { JwtPayload } from '@common/types/auth.type';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DeckService } from './deck.service';
import { CreateDeckDto, DeckDto } from './dtos/deck.dto';

@Controller('decks')
export class DeckController {
  constructor(private readonly deckService: DeckService) {}

  @ApiEndpoint({ type: DeckDto })
  @Post()
  async create(@Payload() { userId }: JwtPayload, @Body() dto: CreateDeckDto) {
    return await this.deckService.create(userId, dto);
  }

  @ApiEndpoint({ type: DeckDto, isPaginated: true })
  @Get()
  async getMany(@Payload() { userId }: JwtPayload, @Query() query: QueryDto) {
    return await this.deckService.getMany(userId, query);
  }
}
