import { AllConfig } from '@config';
import {
  MikroOrmModuleOptions,
  MikroOrmOptionsFactory,
} from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MikroOrmConfigService
  implements MikroOrmOptionsFactory<PostgreSqlDriver>
{
  constructor(private readonly configService: ConfigService<AllConfig, true>) {}

  createMikroOrmOptions(): MikroOrmModuleOptions<PostgreSqlDriver> {
    return {
      driver: PostgreSqlDriver,
      host: this.configService.get('database.host', { infer: true }),
      port: this.configService.get('database.port', { infer: true }),
      user: this.configService.get('database.user', { infer: true }),
      password: this.configService.get('database.password', { infer: true }),
      dbName: this.configService.get('database.dbName', { infer: true }),

      autoLoadEntities: true, // automatically load entities which is used in forFeature
    };
  }
}
