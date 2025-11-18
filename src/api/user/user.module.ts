import { QueueName } from '@common/constants/queue-name.enum';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([User]),
    BullModule.registerQueue({ name: QueueName.IMAGE }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
