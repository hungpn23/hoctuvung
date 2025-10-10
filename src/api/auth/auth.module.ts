import { Session } from '@api/user/entities/session.entity';
import { User } from '@api/user/entities/user.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [JwtModule.register({}), MikroOrmModule.forFeature([User, Session])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
