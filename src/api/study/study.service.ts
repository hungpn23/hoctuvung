import { Card } from '@api/deck/entities/card.entity';
import { Deck } from '@api/deck/entities/deck.entity';
import type { UUID } from '@common/types/branded.type';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SaveAnswersDto } from './dtos/study.dto';

@Injectable()
export class StudyService {
  private readonly logger = new Logger(StudyService.name);

  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Card)
    private readonly cardRepository: EntityRepository<Card>,
    @InjectRepository(Deck)
    private readonly deckRepository: EntityRepository<Deck>,
  ) {}

  async saveAnswers(
    userId: UUID,
    deckId: UUID,
    dto: SaveAnswersDto,
  ): Promise<void> {
    const deck = await this.deckRepository.findOne({
      id: deckId,
      owner: userId,
      isDeleted: false,
    });

    if (!deck) throw new NotFoundException();

    const cardsToUpdate = await this.cardRepository.find({
      id: { $in: dto.answers.map((a) => a.id) },
      deck: deckId,
    });

    const map = new Map(cardsToUpdate.map((c) => [c.id, c]));

    for (const a of dto.answers) {
      const cardEntity = map.get(a.id);
      if (cardEntity) this.cardRepository.assign(cardEntity, a);
    }

    await this.em.flush();
  }
}
