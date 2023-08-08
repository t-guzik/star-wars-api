import { Module, Provider, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ConfigFactories, EnvironmentVariablesValidators } from './config/namespaces';
import {
  PostgresDatabaseConfigInterface,
  PostgresDatabaseConfigToken,
} from './config/namespaces/postgres-database.config';
import { validate } from './config/validation';
import { RequestContextModule } from 'nestjs-request-context';
import { CqrsModule } from '@nestjs/cqrs';
import { SlonikModule } from 'nestjs-slonik';
import { HealthModule } from './health/health.module';
import { ContextInterceptor } from './libs/application/context/ContextInterceptor';
import { GracefulShutdown } from './libs/bootstrap/graceful-shutdown';
import { ExceptionInterceptor } from './libs/exceptions/exception.interceptor';
import { CharacterModule } from './modules/character/character.module';
import { EpisodeModule } from './modules/episode/episode.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

const interceptors: Provider[] = [
  {
    provide: APP_INTERCEPTOR,
    useClass: ContextInterceptor,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: ExceptionInterceptor,
  },
];

const pipes: Provider[] = [
  {
    provide: APP_PIPE,
    useFactory: (): ValidationPipe => {
      return new ValidationPipe({
        transform: true,
        forbidUnknownValues: false,
      });
    },
  },
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: ConfigFactories,
      validate: validate(EnvironmentVariablesValidators),
      validationOptions: { abortEarly: true },
    }),
    RequestContextModule,
    SlonikModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const postgresConfig = configService.get<PostgresDatabaseConfigInterface>(PostgresDatabaseConfigToken)!;

        return {
          connectionUri: postgresConfig.connectionUri,
        };
      },
      inject: [ConfigService],
    }),
    CqrsModule,
    EventEmitterModule.forRoot(),
    HealthModule,
    CharacterModule,
    EpisodeModule,
  ],
  providers: [GracefulShutdown, ...interceptors, ...pipes],
})
export class AppModule {}
