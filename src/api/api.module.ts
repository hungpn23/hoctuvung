import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DeckModule } from './deck/deck.module';
import { StudyModule } from './study/study.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, AuthModule, DeckModule, StudyModule],
})
export class ApiModule {}
