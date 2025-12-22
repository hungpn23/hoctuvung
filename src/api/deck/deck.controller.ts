import {
  ApiEndpoint,
  ApiPublicEndpoint,
} from '@common/decorators/api-endpoint.decorator';
import { Payload } from '@common/decorators/jwt-payload.decorator';
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
  GetManyQueryDto,
  GetManyResDto,
  GetOneResDto,
  GetSharedManyQueryDto,
  GetSharedManyResDto,
  GetSharedOneResDto,
  UpdateDeckDto,
} from './dtos/deck.dto';

@Controller('decks')
export class DeckController {
  constructor(private readonly deckService: DeckService) {}

  @ApiPublicEndpoint({ type: GetSharedManyResDto, isPaginated: true })
  @Get('shared')
  async getSharedMany(@Query() query: GetSharedManyQueryDto) {
    return await this.deckService.getSharedMany(query);
  }

  @ApiPublicEndpoint({ type: GetSharedOneResDto })
  @Get('shared/:deckId')
  async getSharedOne(
    @Payload('userId') userId: UUID | undefined,
    @Param('deckId') deckId: UUID,
  ) {
    return await this.deckService.getSharedOne(deckId, userId);
  }

  @ApiEndpoint({ type: GetManyResDto, isPaginated: true })
  @Get()
  async getMany(
    @Payload('userId') userId: UUID,
    @Query() query: GetManyQueryDto,
  ) {
    return await this.deckService.getMany(userId, query);
  }

  @ApiEndpoint({ type: GetOneResDto })
  @Get(':deckId')
  async getOne(@Payload('userId') userId: UUID, @Param('deckId') deckId: UUID) {
    return await this.deckService.getOne(userId, deckId);
  }

  @ApiEndpoint({ type: DeckDto })
  @Post()
  async create(@Payload('userId') userId: UUID, @Body() dto: CreateDeckDto) {
    return await this.deckService.create(userId, dto);
  }

  @ApiEndpoint({ type: DeckDto })
  @Patch(':deckId')
  async update(
    @Payload('userId') userId: UUID,
    @Param('deckId') deckId: UUID,
    @Body() dto: UpdateDeckDto,
  ) {
    return await this.deckService.update(userId, deckId, dto);
  }

  @ApiEndpoint()
  @Delete(':deckId')
  async delete(@Payload('userId') userId: UUID, @Param('deckId') deckId: UUID) {
    return await this.deckService.delete(userId, deckId);
  }

  @ApiEndpoint()
  @Post('clone/:deckId')
  async clone(
    @Payload('userId') userId: UUID,
    @Param('deckId') deckId: UUID,
    @Body() dto: CloneDeckDto,
  ) {
    return await this.deckService.clone(userId, deckId, dto);
  }

  @ApiEndpoint()
  @Post('restart/:deckId')
  async restart(
    @Payload('userId') userId: UUID,
    @Param('deckId') deckId: UUID,
  ) {
    return await this.deckService.restart(userId, deckId);
  }
}
