import { AuthService } from '@api/auth/auth.service';
import { AppModule } from '@app.module';
import { GlobalExceptionFilter } from '@common/filters/global-exception.filter';
import { AuthGuard } from '@common/guards/auth.guard';
import { getAppConfig } from '@config/app.config';
import { MikroORM } from '@mikro-orm/core';
import {
  HttpStatus,
  Logger,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const { apiPrefix, host, port, nodeEnv } = getAppConfig();

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.setGlobalPrefix(apiPrefix);

  app.useGlobalGuards(new AuthGuard(app.get(Reflector), app.get(AuthService)));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors: ValidationError[]) => {
        return new UnprocessableEntityException(errors);
      },
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());

  const orm = app.get(MikroORM);
  await orm.schema.updateSchema();

  const config = new DocumentBuilder()
    .setTitle('App title')
    .setDescription('App API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory, { useGlobalPrefix: true });

  const appUrl = `http://${host}:${port}/${apiPrefix}`;

  await app.listen(port, host, () => {
    logger.log(`🌱 Environment: ${nodeEnv}`);
    logger.log(`🚀 API live at: ${appUrl}`);
    logger.log(`📚 Swagger docs at: ${appUrl}/docs`);
  });
}

void bootstrap();
