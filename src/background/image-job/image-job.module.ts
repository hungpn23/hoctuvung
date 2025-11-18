import { User } from '@api/user/entities/user.entity';
import { QueueName } from '@common/constants/queue-name.enum';
import { ImageKitModule } from '@imagekit/imagekit.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ImageJobConsumer } from './image-job.consumer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueName.IMAGE,
    }),
    ImageKitModule,
    MikroOrmModule.forFeature([User]),
  ],
  providers: [ImageJobConsumer],
})
export class ImageJobModule {}
