import { ApiModule } from '@api/api.module';
import { AppController } from '@app.controller';
import { BackgroundModule } from '@background/background.module';
import { AllConfig } from '@config';
import appConfig from '@config/app.config';
import authConfig from '@config/auth.config';
import databaseConfig from '@config/database.config';
import googleConfig from '@config/google.config';
import imagekitConfig from '@config/imagekit.config';
import redisConfig from '@config/redis.config';
import { MikroOrmConfigService } from '@db/mikro-orm.config.service';
import { ImageKitModule } from '@imagekit/imagekit.module';
import KeyvRedis from '@keyv/redis';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

const envFilePath =
  process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      cache: true, // speed up the loading process
      expandVariables: true, // support variables in .env file
      skipProcessEnv: true, // disable automatic variable fetching from process.env
      load: [
        //  load config factories to validate and transform the config values
        appConfig,
        databaseConfig,
        authConfig,
        redisConfig,
        googleConfig,
        imagekitConfig,
      ],
    }),

    MikroOrmModule.forRootAsync({
      useClass: MikroOrmConfigService,
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

    ImageKitModule,
    BackgroundModule,
    ApiModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
