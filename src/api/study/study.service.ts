import { CardDto } from '@api/deck/dtos/card.dto';
import { Card } from '@api/deck/entities/card.entity';
import { Deck } from '@api/deck/entities/deck.entity';
import { UUID } from '@common/types/branded.type';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { plainToInstance } from 'class-transformer';
import { StudySessionDto, SubmitReviewDto } from './dtos/study.dto';
import {
  MAX_REVIEW_CARDS_PER_SESSION,
  TOTAL_SESSION_LIMIT,
} from './study.const';
import { StudySessionState } from './study.type';

@Injectable()
export class StudyService {
  constructor(
    private readonly em: EntityManager,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectRepository(Card)
    private readonly cardRepository: EntityRepository<Card>,
    @InjectRepository(Deck)
    private readonly deckRepository: EntityRepository<Deck>,
  ) {}

  async startSession(userId: UUID, deckId: UUID): Promise<StudySessionDto> {
    const deck = await this.deckRepository.findOne({
      id: deckId,
      owner: userId,
    });
    if (!deck) throw new NotFoundException('Deck not found.');

    const reviewCards = await this.cardRepository.find(
      {
        deck: deckId,
        nextReviewAt: { $lte: new Date() },
      },
      { limit: MAX_REVIEW_CARDS_PER_SESSION },
    );

    const newCardsLimit = TOTAL_SESSION_LIMIT - reviewCards.length;

    let newCards: Card[] = [];
    if (newCardsLimit > 0) {
      newCards = await this.cardRepository.find(
        {
          deck: deckId,
          nextReviewAt: null,
        },
        { limit: newCardsLimit },
      );
    }

    const sessionCards = [...newCards, ...reviewCards];
    if (sessionCards.length === 0)
      throw new BadRequestException('No cards to study in this deck.');

    const sessionId = `study_session_id:${userId}:${deckId}`;
    const sessionState: StudySessionState = {
      deckId,
      reviewPile: this._shuffleCards(sessionCards),
      failedPile: [],
      totalCount: sessionCards.length,
    };

    await this.cacheManager.set(sessionId, sessionState, 3600 * 1000);

    return await this._getNextCard(userId, sessionId);
  }

  async processReview(
    userId: UUID,
    { sessionId, cardId, wasCorrect }: SubmitReviewDto,
  ) {
    const sessionState = await this._verifySession(userId, sessionId);

    const cardToReview = sessionState.reviewPile.shift();

    if (cardToReview?.id !== cardId)
      throw new BadRequestException('No card to review.');

    if (wasCorrect) {
      cardToReview.correctCount++;
    } else {
      cardToReview.correctCount = 0;
      sessionState.failedPile.push(cardToReview);
    }

    await this._updateCardInDb(cardToReview);
    await this.cacheManager.set(sessionId, sessionState, 3600 * 1000);

    return await this._getNextCard(userId, sessionId);
  }

  private async _getNextCard(userId: UUID, sessionId: string) {
    const sessionState = await this._verifySession(userId, sessionId);

    if (
      sessionState.reviewPile.length === 0 &&
      sessionState.failedPile.length > 0
    ) {
      sessionState.reviewPile = this._shuffleCards(sessionState.failedPile);
      sessionState.failedPile = [];
    }

    const currentCard = sessionState.reviewPile[0];
    const remainingCount =
      sessionState.reviewPile.length + sessionState.failedPile.length;

    await this.cacheManager.set(sessionId, sessionState, 3600 * 1000);

    return plainToInstance(StudySessionDto, {
      sessionId,
      currentCard: currentCard
        ? plainToInstance(CardDto, currentCard)
        : undefined,
      state: sessionState,
      remainingCount,
      isCompleted: remainingCount === 0,
    } satisfies StudySessionDto);
  }

  private async _updateCardInDb(card: Card) {
    const cardRef = this.cardRepository.getReference(card.id);
    const daysToAdd =
      card.correctCount > 0 ? Math.pow(2, card.correctCount - 1) : 0;
    const nextReviewAt = new Date();

    if (daysToAdd > 0) nextReviewAt.setDate(nextReviewAt.getDate() + daysToAdd);

    this.cardRepository.assign(cardRef, {
      correctCount: card.correctCount,
      nextReviewAt,
    });

    await this.em.flush();
  }

  private async _verifySession(userId: UUID, sessionId: string) {
    if (!sessionId.startsWith(`study_session_id:${userId}:`))
      throw new ForbiddenException(
        'You do not have permission to access this study session.',
      );

    const sessionState =
      await this.cacheManager.get<StudySessionState>(sessionId);

    if (!sessionState) {
      throw new NotFoundException('Study session not found or expired.');
    }

    return sessionState;
  }

  private _shuffleCards(cards: Card[]): Card[] {
    const array = structuredClone(cards);
    let currentIndex = array.length;
    let randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }
}
