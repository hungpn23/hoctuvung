import {
  PaginatedDto,
  QueryDto,
} from '@common/dtos/offset-pagination/offset-pagination.dto';
import { createMetadata } from '@common/dtos/offset-pagination/utils';
import { UUID } from '@common/types/branded.type';
import { EntityManager, EntityRepository, FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Visibility } from './deck.enum';
import { CardDto } from './dtos/card.dto';
import {
  CreateDeckDto,
  DeckDto,
  DeckWithCardsDto,
  UpdateDeckDto,
} from './dtos/deck.dto';
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

    const deck = await this.deckRepository.findOne({
      name: deckDto.name,
      isDeleted: false,
      owner: { id: userId },
    });
    if (deck) {
      throw new BadRequestException(
        `Deck with name "${deckDto.name}" already exists.`,
      );
    }

    const newDeck = this.deckRepository.create({
      ...deckDto,
      owner: userId,
      createdBy: userId,
    });

    cardDtos.forEach((cardDto) => {
      this.cardRepository.create({
        ...cardDto,
        deck: newDeck,
      });
    });

    await this.em.flush();

    return plainToInstance(DeckWithCardsDto, {
      ...newDeck,
      cards: plainToInstance(CardDto, newDeck.cards.getItems()),
    });
  }

  async update(deckId: UUID, userId: UUID, dto: UpdateDeckDto) {
    const deck = await this.deckRepository.findOne(
      { id: deckId, owner: userId, isDeleted: false },
      { populate: ['cards'] },
    );

    if (!deck)
      throw new NotFoundException(`Deck with id "${deckId}" not found.`);

    if (dto.name && dto.name !== deck.name) {
      const existingDeck = await this.deckRepository.findOne({
        name: dto.name,
        owner: userId,
        isDeleted: false,
        id: { $ne: deckId }, // Quan trọng: loại trừ chính deck đang update
      });

      if (existingDeck)
        throw new BadRequestException(
          `Deck with name "${dto.name}" already exists.`,
        );
    }

    if (dto.visibility) {
      switch (dto.visibility) {
        case Visibility.PUBLIC:
        case Visibility.PRIVATE:
          dto.passcode = '';
          break;
        case Visibility.PROTECTED:
          if (!dto.passcode)
            throw new BadRequestException(
              'Passcode is required for protected visibility.',
            );
          break;
      }
    }

    if (dto.cards) {
      const cardMap = new Map(deck.cards.getItems().map((c) => [c.id, c]));
      const newOrUpdatedCards: Card[] = [];

      for (const cardDto of dto.cards) {
        if (cardDto.id && cardMap.has(cardDto.id)) {
          const existingCard = cardMap.get(cardDto.id)!;
          this.cardRepository.assign(existingCard, cardDto);
          newOrUpdatedCards.push(existingCard);
          cardMap.delete(cardDto.id);
        } else {
          const newCard = this.cardRepository.create({ ...cardDto, deck });
          newOrUpdatedCards.push(newCard);
        }
      }

      this.em.remove(cardMap.values());

      dto.cards = newOrUpdatedCards;
    }

    this.deckRepository.assign(
      deck,
      {
        ...dto,
        updatedBy: userId,
      },
      {
        ignoreUndefined: true,
      },
    );

    await this.em.flush();

    return plainToInstance(DeckWithCardsDto, {
      ...deck,
      cards: plainToInstance(CardDto, deck.cards.getItems()),
    });
  }

  async delete(userId: UUID, deckId: UUID) {
    const deck = await this.deckRepository.findOne({
      id: deckId,
      owner: userId,
      isDeleted: false,
    });

    if (!deck)
      throw new NotFoundException(`Deck with id "${deckId}" not found.`);

    this.deckRepository.assign(deck, {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: userId,
    });

    return await this.em.flush();
  }
}
