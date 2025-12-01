import { Card } from '@api/deck/entities/card.entity';
import { Deck } from '@api/deck/entities/deck.entity';
import { QueueName } from '@common/constants/queue-name.enum';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { UserStatistic } from './entities/user-statistics.entity';
import { StudyController } from './study.controller';
import { StudyService } from './study.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Deck, Card, UserStatistic]),
    BullModule.registerQueue({
      name: QueueName.STUDY,
      defaultJobOptions: {
        removeOnComplete: true,
      },
    }),
  ],
  controllers: [StudyController],
  providers: [StudyService],
})
export class StudyModule {}
