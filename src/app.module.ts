import { ApiModule } from '@api/api.module';
import { AppController } from '@app.controller';
import { AllConfig } from '@config';
import appConfig from '@config/app.config';
import authConfig from '@config/auth.config';
import databaseConfig from '@config/database.config';
import googleConfig from '@config/google.config';
import imagekitConfig from '@config/imagekit.config';
import redisConfig from '@config/redis.config';
import KeyvRedis from '@keyv/redis';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from '@nestjs/cache-manager';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
      useFactory: (configService: ConfigService<AllConfig, true>) => {
        const logger = new Logger('MikroORM');

        return {
          driver: PostgreSqlDriver,
          host: configService.get('database.host', { infer: true }),
          port: configService.get('database.port', { infer: true }),
          user: configService.get('database.user', { infer: true }),
          password: configService.get('database.password', { infer: true }),
          dbName: configService.get('database.dbName', { infer: true }),
          entities: Object.values(entities),

          debug: isProd ? false : true,
          highlighter: new SqlHighlighter(),
          logger: (msg) => logger.debug(msg),
        };
      },
      imports: [ConfigModule],
      inject: [ConfigService],
      driver: PostgreSqlDriver,
    }),

    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfig, true>) => {
        const host = configService.get('redis.host', { infer: true });
        const port = configService.get('redis.port', { infer: true });
        const username = configService.get('redis.username', { infer: true });
        const password = configService.get('redis.password', { infer: true });

        return {
          stores: new KeyvRedis(
            `redis://${username}:${password}@${host}:${port}`,
          ),
        };
      },

      isGlobal: true,
    }),

    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfig, true>) => {
        return {
          connection: {
            host: configService.get('redis.host', { infer: true }),
            port: configService.get('redis.port', { infer: true }),
            username: configService.get('redis.username', { infer: true }),
            password: configService.get('redis.password', { infer: true }),
          },
        };
      },
    }),

    ApiModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
