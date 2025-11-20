import { PaginatedDto } from '@common/dtos/offset-pagination/offset-pagination.dto';
import { createMetadata } from '@common/dtos/offset-pagination/utils';
import { UUID } from '@common/types/branded.type';
import {
  EntityManager,
  EntityRepository,
  FilterQuery,
  QueryOrder,
} from '@mikro-orm/core';
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
  CreateDeckResDto,
  DeckDto,
  DeckQueryDto,
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
        owner: userId,
        isDeleted: false,
      },
      {
        populate: ['cards'],
        orderBy: { cards: { term: QueryOrder.ASC_NULLS_LAST } },
      },
    );

    if (!deck) {
      throw new NotFoundException(`Deck with id "${deckId}" not found.`);
    }

    this.deckRepository.assign(deck, { openedAt: new Date() });

    await this.em.flush();

    const cards = deck.cards
      .getItems()
      .map((card) => plainToInstance(CardDto, card));

    return plainToInstance(DeckWithCardsDto, {
      ...deck,
      cards,
      stats: this._calculateDeckStats(cards),
    });
  }

  async getMany(userId: UUID, query: DeckQueryDto) {
    const { limit, offset, search, orderBy, order } = query;

    const where: FilterQuery<Deck> = {
      owner: userId,
      isDeleted: false,
    };

    if (search && search.trim() !== '') where.name = { $ilike: `%${search}%` };

    const [decks, totalRecords] = await this.deckRepository.findAndCount(
      where,
      {
        limit,
        offset,
        orderBy: { [orderBy]: order },
      },
    );

    return plainToInstance(PaginatedDto<DeckDto>, {
      data: plainToInstance(DeckDto, decks),
      metadata: createMetadata(totalRecords, query),
    });
  }

  async getSharedMany(userId: UUID, query: DeckQueryDto) {
    const { limit, offset, search, orderBy, order } = query;

    const where: FilterQuery<Deck> = {
      owner: { $ne: userId },
      visibility: { $in: [Visibility.PUBLIC, Visibility.PROTECTED] },
      isDeleted: false,
    };

    if (search && search.trim() !== '') {
      where.name = { $ilike: `%${search}%` };
    }

    const [decks, totalRecords] = await this.deckRepository.findAndCount(
      where,
      {
        limit,
        offset,
        orderBy: { [orderBy]: order },
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
      owner: userId,
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

    cardDtos.forEach((c) =>
      this.cardRepository.create({
        ...c,
        deck: newDeck.id,
      }),
    );

    await this.em.flush();

    return plainToInstance(CreateDeckResDto, {
      id: newDeck.id,
      slug: newDeck.slug,
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
          // update existing card
          const existingCard = cardMap.get(cardDto.id)!;
          this.cardRepository.assign(existingCard, cardDto);
          newOrUpdatedCards.push(existingCard);
          cardMap.delete(cardDto.id);
        } else {
          // add new card
          const { id: _tempId, ...cardData } = cardDto;
          const newCard = this.cardRepository.create({ ...cardData, deck });
          newOrUpdatedCards.push(newCard);
        }
      }

      // remove cards remaining
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
        ignoreUndefined: true, // ignore undefined fields to avoid overwriting
      },
    );

    await this.em.flush();
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

    await this.em.flush();
  }

  async clone(userId: UUID, deckId: UUID, dto: CloneDeckDto) {
    const originalDeck = await this.deckRepository.findOne(
      { id: deckId, isDeleted: false },
      { populate: ['cards'] },
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

    originalDeck.cards.getItems().forEach((card) =>
      this.cardRepository.create({
        deck: newDeck.id,
        term: card.term,
        definition: card.definition,
      }),
    );

    originalDeck.cloneCount++;

    await this.em.flush();

    const cards = newDeck.cards
      .getItems()
      .map((card) => plainToInstance(CardDto, card));

    return plainToInstance(DeckWithCardsDto, {
      ...newDeck,
      cards,
      stats: this._calculateDeckStats(cards),
    });
  }

  async refresh(userId: UUID, deckId: UUID) {
    const deck = await this.deckRepository.findOne({
      id: deckId,
      owner: userId,
      isDeleted: false,
    });

    if (!deck)
      throw new NotFoundException(`Deck with ID "${deckId}" not found.`);

    const cards = await this.cardRepository.find({ deck: deckId });

    for (const c of cards) {
      this.cardRepository.assign(c, {
        correctCount: 0,
        nextReviewDate: undefined,
      });
    }

    await this.em.flush();
  }

  private _calculateDeckStats(cards: CardDto[]): DeckStatsDto {
    const stats: DeckStatsDto = {
      total: cards.length,
      known: 0,
      learning: 0,
      new: 0,
    };

    cards.forEach((c) => stats[c.status]++);

    return stats;
  }
}
