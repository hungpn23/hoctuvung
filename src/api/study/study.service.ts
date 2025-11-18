import { CardDto } from '@api/deck/dtos/card.dto';
import { Card } from '@api/deck/entities/card.entity';
import { Deck } from '@api/deck/entities/deck.entity';
import { UUID } from '@common/types/branded.type';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { plainToInstance } from 'class-transformer';
import {
  StudySessionDto,
  StudySessionStateDto,
  SubmitReviewDto,
} from './dtos/study.dto';
import {
  MAX_REVIEW_CARDS_PER_SESSION,
  TOTAL_SESSION_LIMIT,
} from './study.const';

@Injectable()
export class StudyService {
  private readonly logger = new Logger(StudyService.name);

  constructor(
    private readonly em: EntityManager,

    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,

    @InjectRepository(Card)
    private readonly cardRepository: EntityRepository<Card>,
    @InjectRepository(Deck)
    private readonly deckRepository: EntityRepository<Deck>,
  ) {}

  // async saveAnswers(userId: UUID, cardId: UUID, wasCorrect: boolean) {}

  async startSession(userId: UUID, deckId: UUID): Promise<StudySessionDto> {
    const sessionId = `study_session_id:${userId}:${deckId}`;

    const isExisting =
      await this.cacheManager.get<StudySessionStateDto>(sessionId);

    if (isExisting) throw new ConflictException('Session already started.');

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

    const cardsToReview = plainToInstance(
      CardDto,
      sessionCards.map((c) => ({
        id: c.id,
        term: c.term,
        definition: c.definition,
        correctCount: c.correctCount,
        nextReviewAt: c.nextReviewAt,
      })),
    );

    const sessionState: StudySessionStateDto = {
      cardsToReview,
      correctCards: [],
      incorrectCards: [],
      totalCount: sessionCards.length,
    };

    return await this._getNextCard(sessionId, sessionState);
  }

  async processReview(userId: UUID, dto: SubmitReviewDto) {
    const { sessionId, cardId, wasCorrect } = dto;

    if (!sessionId.startsWith(`study_session_id:${userId}:`))
      throw new ForbiddenException(
        'You do not have permission to access this study session.',
      );

    const state = await this.cacheManager.get<StudySessionStateDto>(sessionId);

    if (!state)
      throw new NotFoundException('Study session not found or expired.');

    const cardToReview = state.currentCard;

    if (cardToReview?.id !== cardId)
      throw new BadRequestException('No card to review.');

    if (wasCorrect) {
      cardToReview.correctCount++;
      state.correctCards.push(cardToReview);
    } else {
      cardToReview.correctCount = 0;
      state.incorrectCards.push(cardToReview);
    }

    cardToReview.nextReviewAt = this._calculateNextReviewAt(
      cardToReview.correctCount,
    );

    return await this._getNextCard(sessionId, state);
  }

  private async _getNextCard(sessionId: string, state: StudySessionStateDto) {
    const { cardsToReview, correctCards, incorrectCards } = state;
    const remainingCount = state.totalCount - correctCards.length;

    if (cardsToReview.length === 0 && incorrectCards.length > 0) {
      cardsToReview.push(...incorrectCards);
      incorrectCards.length = 0;
    } else if (correctCards.length === state.totalCount) {
      for (const c of correctCards) {
        const cardRef = this.cardRepository.getReference(c.id);

        this.cardRepository.assign(cardRef, {
          correctCount: c.correctCount,
          nextReviewAt: c.nextReviewAt,
        });
      }

      state.currentCard = undefined;

      await Promise.all([this.cacheManager.del(sessionId), this.em.flush()]);

      return plainToInstance(StudySessionDto, {
        sessionId,
        state,
        remainingCount,
        isCompleted: true,
      });
    }

    state.currentCard = cardsToReview.shift();

    await this.cacheManager.set(sessionId, state, 3600 * 1000);

    return plainToInstance(StudySessionDto, {
      sessionId,
      state,
      remainingCount,
      isCompleted: false,
    });
  }

  private _calculateNextReviewAt(correctCount: number) {
    const baseDaysToAdd = correctCount > 0 ? Math.pow(2, correctCount - 1) : 0;
    const daysToAdd = Math.min(baseDaysToAdd, 365);
    const nextReviewAt = new Date();

    if (daysToAdd > 0) nextReviewAt.setDate(nextReviewAt.getDate() + daysToAdd);

    return nextReviewAt;
  }

  // for shuffle button
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
