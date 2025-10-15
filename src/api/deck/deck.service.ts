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
  CloneDeckDto,
  CreateDeckDto,
  DeckDto,
  DeckStatsDto,
  DeckWithCardsDto,
  UpdateDeckDto,
} from './dtos/deck.dto';
import { Card } from './entities/card.entity';
import { Deck } from './entities/deck.entity';

@Injectable()
export class DeckService {
  private readonly logger = new Logger(DeckService.name);

  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Deck)
    private readonly deckRepository: EntityRepository<Deck>,
    @InjectRepository(Card)
    private readonly cardRepository: EntityRepository<Card>,
  ) {}

  async getOne(deckId: UUID, userId: UUID) {
    const deck = await this.deckRepository.findOne(
      {
        id: deckId,
        $or: [
          { owner: userId },
          { visibility: { $in: [Visibility.PUBLIC, Visibility.PROTECTED] } },
        ],
        isDeleted: false,
      },
      {
        populate: ['cards'],
      },
    );

    if (!deck) {
      throw new NotFoundException(`Deck with id "${deckId}" not found.`);
    }

    this.logger.debug(
      '🚀 ~ DeckService ~ getOne ~ deck:',
      deck.cards.length === deck.cards.count(),
    );

    const cards = deck.cards.getItems();

    return plainToInstance(DeckWithCardsDto, {
      ...deck,
      cards: plainToInstance(CardDto, cards),
      stats: this._calculateDeckStats(cards),
    });
  }

  async getMany(userId: UUID, query: QueryDto) {
    const where: FilterQuery<Deck> = {
      $or: [
        { owner: userId },
        { visibility: { $in: [Visibility.PUBLIC, Visibility.PROTECTED] } },
      ],
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

    const cards = newDeck.cards.getItems();

    return plainToInstance(DeckWithCardsDto, {
      ...newDeck,
      cards: plainToInstance(CardDto, cards),
      stats: this._calculateDeckStats(cards),
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

    const cards = deck.cards.getItems();

    return plainToInstance(DeckWithCardsDto, {
      ...deck,
      cards: plainToInstance(CardDto, cards),
      stats: this._calculateDeckStats(cards),
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

  async clone(userId: UUID, deckId: UUID, dto: CloneDeckDto) {
    const originalDeck = await this.deckRepository.findOne(
      { id: deckId, isDeleted: false },
      { populate: ['cards', 'owner'] },
    );

    if (!originalDeck)
      throw new NotFoundException(`Deck with id "${deckId}" not found.`);

    if (originalDeck.owner.id === userId)
      throw new BadRequestException('You cannot clone your own deck.');

    if (originalDeck.visibility === Visibility.PRIVATE)
      throw new BadRequestException('You cannot clone a private deck.');

    if (originalDeck.visibility === Visibility.PROTECTED)
      if (!dto.passcode || dto.passcode !== originalDeck.passcode)
        throw new BadRequestException('Invalid passcode.');

    const newDeckName = `${originalDeck.name} (Clone)`;
    const existingClonedDeck = await this.deckRepository.findOne({
      name: newDeckName,
      owner: { id: userId },
      isDeleted: false,
    });

    if (existingClonedDeck)
      throw new BadRequestException(
        `You have already cloned this deck as "${newDeckName}". Please rename it before cloning again.`,
      );

    const newDeck = this.deckRepository.create({
      name: newDeckName,
      description: originalDeck.description,
      visibility: Visibility.PRIVATE,
      owner: userId,
      createdBy: originalDeck.owner.id,
      clonedFrom: originalDeck.id,
    });

    originalDeck.cards.getItems().forEach((card) => {
      this.cardRepository.create({
        deck: newDeck,
        question: card.question,
        answer: card.answer,
      });
    });

    originalDeck.cloneCount++;

    await this.em.flush();

    const cards = newDeck.cards.getItems();

    return plainToInstance(DeckWithCardsDto, {
      ...newDeck,
      cards: plainToInstance(CardDto, cards),
      stats: this._calculateDeckStats(cards),
    });
  }

  private _calculateDeckStats(cards: Card[]): DeckStatsDto {
    const stats: DeckStatsDto = {
      total: cards.length,
      known: 0,
      learning: 0,
      unseen: 0,
    };

    const today = new Date();

    for (const card of cards) {
      const nextReviewAt = card.nextReviewAt;

      if (nextReviewAt === null || nextReviewAt === undefined) {
        stats.unseen++;
      } else if (nextReviewAt > today) {
        stats.known++;
      } else {
        stats.learning++;
      }
    }

    return stats;
  }
}
