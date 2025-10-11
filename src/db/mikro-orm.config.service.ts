import { AllConfig } from '@config';
import {
  MikroOrmModuleOptions,
  MikroOrmOptionsFactory,
} from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MikroOrmConfigService
  implements MikroOrmOptionsFactory<PostgreSqlDriver>
{
  private readonly logger = new Logger('MikroORM');

  constructor(private readonly configService: ConfigService<AllConfig, true>) {}

  createMikroOrmOptions(): MikroOrmModuleOptions<PostgreSqlDriver> {
    return {
      driver: PostgreSqlDriver,
      host: this.configService.get('database.host', { infer: true }),
      port: this.configService.get('database.port', { infer: true }),
      user: this.configService.get('database.user', { infer: true }),
      password: this.configService.get('database.password', { infer: true }),
      dbName: this.configService.get('database.dbName', { infer: true }),
      autoLoadEntities: true, // automatically load entities which is used in .forFeature()

      // for development
      debug: true,
      highlighter: new SqlHighlighter(),
      logger: (msg) => this.logger.debug(msg),
    };
  }
}
