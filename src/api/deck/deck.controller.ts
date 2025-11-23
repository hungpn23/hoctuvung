import { ApiEndpoint } from '@common/decorators/api-endpoint.decorator';
import { Payload } from '@common/decorators/jwt-payload.decorator';
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
import {
  CloneDeckDto,
  CreateDeckDto,
  DeckDto,
  DeckQueryDto,
  DeckWithCardsDto,
  UpdateDeckDto,
} from './dtos/deck.dto';

@Controller('decks')
export class DeckController {
  constructor(private readonly deckService: DeckService) {}

  @ApiEndpoint({ type: DeckWithCardsDto })
  @Get(':id')
  async getOne(@Payload() { userId }: JwtPayload, @Param('id') deckId: UUID) {
    return await this.deckService.getOne(deckId, userId);
  }

  @ApiEndpoint({ type: DeckDto, isPaginated: true })
  @Get()
  async getMany(
    @Payload() { userId }: JwtPayload,
    @Query() query: DeckQueryDto,
  ) {
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

  @ApiEndpoint({ type: DeckWithCardsDto })
  @Post(':id/clone')
  async clone(
    @Payload() { userId }: JwtPayload,
    @Param('id') deckId: UUID,
    @Body() dto: CloneDeckDto,
  ) {
    return await this.deckService.clone(userId, deckId, dto);
  }

  @ApiEndpoint()
  @Post('restart/:deckId')
  async restart(
    @Payload() { userId }: JwtPayload,
    @Param('deckId') deckId: UUID,
  ) {
    return await this.deckService.restart(userId, deckId);
  }
}
