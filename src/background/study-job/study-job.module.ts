import { UserStatistic } from '@api/study/entities/user-statistics.entity';
import { QueueName } from '@common/constants/queue-name.enum';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { StudyJobConsumer } from './study-job.consumer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueName.STUDY,
    }),
    MikroOrmModule.forFeature([UserStatistic]),
  ],
  providers: [StudyJobConsumer],
})
export class StudyJobModule {}
