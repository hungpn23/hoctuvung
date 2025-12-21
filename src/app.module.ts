import { ApiModule } from '@api/api.module';
import { AppController } from '@app.controller';

import { appConfig } from '@config/app.config';
import { authConfig } from '@config/auth.config';
import { DatabaseConfig, databaseConfig } from '@config/database.config';
import { googleConfig } from '@config/google.config';
import { imagekitConfig } from '@config/imagekit.config';
import { RedisConfig, redisConfig } from '@config/redis.config';
import KeyvRedis from '@keyv/redis';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from '@nestjs/cache-manager';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from 'dotenv';
import path from 'node:path';
import * as entities from './db/entities';

config({ path: path.resolve(process.cwd(), '.env.local') });

const isProd = process.env.NODE_ENV === 'prod';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: isProd ? '.env' : '.env.local',
      cache: true,
      expandVariables: true, // support ${<ENV_KEY>} in .env file
      skipProcessEnv: true,
      load: [
        appConfig,
        databaseConfig,
        authConfig,
        redisConfig,
        googleConfig,
        imagekitConfig,
      ],
    }),

    MikroOrmModule.forRootAsync({
      useFactory: (dbConfig: DatabaseConfig) => {
        const logger = new Logger('MikroORM');

        return {
          driver: PostgreSqlDriver,
          ...dbConfig,
          entities: Object.values(entities),

          debug: isProd ? false : true,
          highlighter: new SqlHighlighter(),
          logger: (msg) => logger.debug(msg),
        };
      },
      inject: [databaseConfig.KEY],
      driver: PostgreSqlDriver,
    }),

    CacheModule.registerAsync({
      isGlobal: true,
      inject: [redisConfig.KEY],
      useFactory: (redisConfig: RedisConfig) => {
        const { username, password, host, port } = redisConfig;

        return {
          stores: new KeyvRedis(
            `redis://${username}:${password}@${host}:${port}`,
          ),
        };
      },
    }),

    BullModule.forRootAsync({
      inject: [redisConfig.KEY],
      useFactory: (redisConfig: RedisConfig) => ({ connection: redisConfig }),
    }),

    ApiModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
