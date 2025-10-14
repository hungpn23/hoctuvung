import { Card } from '@api/deck/entities/card.entity';
import { Deck } from '@api/deck/entities/deck.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { StudyController } from './study.controller';
import { StudyService } from './study.service';

@Module({
  imports: [MikroOrmModule.forFeature([Deck, Card])],
  controllers: [StudyController],
  providers: [StudyService],
})
export class StudyModule {}
