import { ApiModule } from '@api/api.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      driver: PostgreSqlDriver,
    }),

    ApiModule]
})
export class AppModule {}
