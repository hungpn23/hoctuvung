import {
  PaginatedDto,
  QueryDto,
} from '@common/dtos/offset-pagination/offset-pagination.dto';
import { createMetadata } from '@common/dtos/offset-pagination/utils';
import { UUID } from '@common/types/branded.type';
import { EntityManager, EntityRepository, FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CardDto } from './dtos/card.dto';
import { CreateDeckDto, DeckDto, DeckWithCardsDto } from './dtos/deck.dto';
import { Card } from './entities/card.entity';
import { Deck } from './entities/deck.entity';

@Injectable()
export class DeckService {
  private readonly logger = new Logger(DeckService.name);

  constructor(
    @InjectRepository(Deck)
    private readonly deckRepository: EntityRepository<Deck>,
    @InjectRepository(Card)
    private readonly cardRepository: EntityRepository<Card>,
    private readonly em: EntityManager,
  ) {}

  async getMany(userId: UUID, query: QueryDto) {
    const where: FilterQuery<Deck> = {
      owner: userId,
      isDeleted: false,
    };

    if (query.q && query.q.trim() !== '')
      where.name = { $ilike: `%${query.q}%` };

    const [decks, totalRecords] = await this.deckRepository.findAndCount(
      where,
      {
        offset: query.offset,
        limit: query.limit,
        orderBy: { createdAt: query.order },
      },
    );

    return plainToInstance(PaginatedDto<DeckDto>, {
      data: plainToInstance(DeckDto, decks),
      metadata: createMetadata(totalRecords, query),
    });
  }

  async create(userId: UUID, dto: CreateDeckDto) {
    const { cards: cardDtos, ...deckDto } = dto;

    const found = await this.deckRepository.findOne({
      name: deckDto.name,
      owner: { id: userId },
    });
    if (found) {
      throw new BadRequestException(
        `Deck with name "${deckDto.name}" already exists.`,
      );
    }

    const newDeck = this.deckRepository.create({
      ...deckDto,
      owner: userId,
    });

    const newCards = cardDtos.map((cardDto) => {
      return this.cardRepository.create({
        ...cardDto,
        deck: newDeck,
      });
    });

    newDeck.cards.add(newCards);

    await this.em.flush();

    return plainToInstance(DeckWithCardsDto, {
      ...newDeck,
      cards: plainToInstance(CardDto, newDeck.cards.getItems()),
    });
  }
}
