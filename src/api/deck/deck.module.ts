import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { DeckController } from './deck.controller';
import { DeckService } from './deck.service';
import { Card } from './entities/card.entity';
import { Deck } from './entities/deck.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Deck, Card])],
  controllers: [DeckController],
  providers: [DeckService],
})
export class DeckModule {}
