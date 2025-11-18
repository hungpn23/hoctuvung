import { Card } from '@api/deck/entities/card.entity';
import { Deck } from '@api/deck/entities/deck.entity';
import { QueueName } from '@common/constants/queue-name.enum';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { StudyController } from './study.controller';
import { StudyService } from './study.service';
import { StudyServiceV2 } from './study.service-v2';

@Module({
  imports: [
    MikroOrmModule.forFeature([Deck, Card]),
    BullModule.registerQueue({
      name: QueueName.STUDY,
      defaultJobOptions: {
        removeOnComplete: true,
      },
    }),
  ],
  controllers: [StudyController],
  providers: [StudyService, StudyServiceV2],
})
export class StudyModule {}
