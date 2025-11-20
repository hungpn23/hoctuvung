import { Card } from '@api/deck/entities/card.entity';
import { Deck } from '@api/deck/entities/deck.entity';
import { UUID } from '@common/types/branded.type'; // Cần import UUID
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SaveAnswersDto } from './dtos/study.dto';

@Injectable()
export class StudyServiceV2 {
  private readonly logger = new Logger(StudyServiceV2.name);

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

    if (!deck)
      throw new NotFoundException(`Deck with ID "${deckId}" not found.`);

    const cardIds = dto.answers.map((a) => a.id);

    const cardsToUpdate = await this.cardRepository.find({
      id: { $in: cardIds },
      deck: deckId,
    });

    const cardMap = new Map(cardsToUpdate.map((c) => [c.id, c]));

    for (const a of dto.answers) {
      const cardEntity = cardMap.get(a.id);
      if (!cardEntity) continue;

      this.cardRepository.assign(cardEntity, a);
    }

    await this.em.flush();

    const updatedCards = await this.cardRepository.find({
      id: { $in: cardIds },
      deck: deckId,
    });

    this.logger.debug(updatedCards);
  }
}
