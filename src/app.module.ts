import { Module, Provider, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ConfigFactories, EnvironmentVariablesValidators } from './config/namespaces';
import {
  PostgresDatabaseConfigInterface,
  PostgresDatabaseConfigToken,
} from './config/namespaces/postgres-database.config';
import { ServerConfigInterface, ServerConfigToken } from './config/namespaces/server.config';
import { validate } from './config/validation';
import { RequestContextModule } from 'nestjs-request-context';
import { CqrsModule } from '@nestjs/cqrs';
import { SlonikModule } from 'nestjs-slonik';
import { ContextInterceptor } from './libs/application/context/ContextInterceptor';
import { GracefulShutdown } from './libs/bootstrap/graceful-shutdown';
import { CharactersModule } from './modules/characters/infrastructure/characters.module';
import { EpisodesModule } from './modules/episodes/infrastructure/episodes.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

const interceptors: Provider[] = [
  {
    provide: APP_INTERCEPTOR,
    useClass: ContextInterceptor,
  },
];

const pipes: Provider[] = [
  {
    provide: APP_PIPE,
    useFactory: (configService: ConfigService): ValidationPipe => {
      const isDebug = configService.get<ServerConfigInterface>(ServerConfigToken)!.debug;

      return new ValidationPipe({
        disableErrorMessages: !isDebug,
        transform: true,
        forbidUnknownValues: false,
      });
    },
    inject: [ConfigService],
  },
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: ConfigFactories,
      validate: validate(EnvironmentVariablesValidators),
      validationOptions: {abortEarly: true},
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
    CharactersModule,
    EpisodesModule,
  ],
  providers: [GracefulShutdown, ...interceptors, ...pipes],
})
export class AppModule {
}
