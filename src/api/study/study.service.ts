import { CardStatus } from '@api/deck/deck.enum';

import { JobName } from '@common/constants/job-name.enum';
import { QueueName } from '@common/constants/queue-name.enum';
import type { UUID } from '@common/types/branded.type';
import { UpdateUserStatsData } from '@common/types/jobs.type';
import { Card, Deck, UserStatistic } from '@db/entities';
import { EntityManager, EntityRepository, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Queue } from 'bullmq';
import { plainToInstance } from 'class-transformer';
import { SaveAnswersDto, UserStatsDto } from './dtos/study.dto';

@Injectable()
export class StudyService {
  private readonly logger = new Logger(StudyService.name);

  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Card)
    private readonly cardRepository: EntityRepository<Card>,
    @InjectRepository(Deck)
    private readonly deckRepository: EntityRepository<Deck>,
    @InjectRepository(UserStatistic)
    private readonly userStatsRepository: EntityRepository<UserStatistic>,

    @InjectQueue(QueueName.STUDY)
    private readonly studyQueue: Queue<UpdateUserStatsData, void, JobName>,
  ) {}

  async getUserStats(userId: UUID) {
    let stats = await this.userStatsRepository.findOne({ user: userId });

    if (!stats) {
      stats = this.userStatsRepository.create({ user: userId });
      await this.em.flush();
    }

    return plainToInstance(UserStatsDto, wrap(stats).toPOJO());
  }

  async saveAnswers(userId: UUID, deckId: UUID, dto: SaveAnswersDto) {
    const deck = await this.deckRepository.findOne({
      id: deckId,
      owner: userId,
    });

    if (!deck) throw new NotFoundException();

    const cardsToUpdate = await this.cardRepository.find({
      id: dto.answers.map((a) => a.id),
      deck: deckId,
    });

    const map = new Map(cardsToUpdate.map((c) => [c.id, c]));

    for (const a of dto.answers) {
      const cardEntity = map.get(a.id);

      if (cardEntity) {
        this.cardRepository.assign(cardEntity, a);

        map.set(a.id, cardEntity);
      }
    }

    await this.em.flush();

    let learnedCount = 0;

    map.forEach((card) => {
      if ((card.status as CardStatus) === CardStatus.KNOWN) learnedCount += 1;
    });

    await this.studyQueue.add(JobName.UPDATE_USER_STATS, {
      userId,
      learnedCount,
    });
  }
}
