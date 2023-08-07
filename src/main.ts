import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CorsConfigInterface, CorsConfigToken } from './config/namespaces/cors.config';
import { GracefulShutdown } from './libs/bootstrap/graceful-shutdown';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const configService = app.get(ConfigService);
  const corsConfig = configService.get<CorsConfigInterface>(CorsConfigToken)!;
  app.enableCors(corsConfig);
  app.use(helmet());

  app.get(GracefulShutdown).create(app.getHttpServer());

  const options = new DocumentBuilder().build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}

bootstrap();
