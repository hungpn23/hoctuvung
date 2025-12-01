import { CardStatus } from '@api/deck/deck.enum';
import { Card } from '@api/deck/entities/card.entity';
import { Deck } from '@api/deck/entities/deck.entity';
import { UpdateUserStatsData } from '@background/study-job/study-job.type';
import { JobName } from '@common/constants/job-name.enum';
import { QueueName } from '@common/constants/queue-name.enum';
import type { UUID } from '@common/types/branded.type';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Queue } from 'bullmq';
import { plainToInstance } from 'class-transformer';
import { SaveAnswersDto, UserStatsDto } from './dtos/study.dto';
import { UserStatistic } from './entities/user-statistics.entity';

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

    return plainToInstance(UserStatsDto, stats);
  }

  async saveAnswers(userId: UUID, deckId: UUID, dto: SaveAnswersDto) {
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

      if (cardEntity) {
        this.cardRepository.assign(cardEntity, a);

        map.set(a.id, cardEntity);
      }
    }

    await this.em.flush();

    let learnedCount = 0;

    map.forEach((card) => {
      if (card.status === CardStatus.KNOWN) learnedCount += 1;
    });

    await this.studyQueue.add(JobName.UPDATE_USER_STATS, {
      userId,
      learnedCount,
    });
  }
}
