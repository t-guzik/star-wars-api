import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CorsConfigInterface, CorsConfigToken } from './config/namespaces/cors.config';
import { ServerConfigInterface, ServerConfigToken } from './config/namespaces/server.config';
import { GracefulShutdown } from './libs/bootstrap/graceful-shutdown';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const configService = app.get(ConfigService);
  const corsConfig = configService.get<CorsConfigInterface>(CorsConfigToken)!;
  const serverConfig = configService.get<ServerConfigInterface>(ServerConfigToken)!;
  app.enableCors(corsConfig);
  app.use(helmet());

  app.get(GracefulShutdown).create(app.getHttpServer());

  const options = new DocumentBuilder().build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      tryItOutEnabled: true,
      tagsSorter: 'alpha',
      operationsSorter: 'method',
    },
  });

  await app.listen(serverConfig.port);
}

bootstrap();
