import { Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigFactories, EnvironmentVariablesValidators } from './config/namespaces';
import {
  PostgresDatabaseConfigInterface,
  PostgresDatabaseConfigToken,
} from './config/namespaces/postgres-database.config';
import { validate } from './config/validation';
import { RequestContextModule } from 'nestjs-request-context';
import { CqrsModule } from '@nestjs/cqrs';
import { SlonikModule } from 'nestjs-slonik';
import { ContextInterceptor } from './libs/application/context/ContextInterceptor';
import { GracefulShutdown } from './libs/bootstrap/graceful-shutdown';
import { CharactersModule } from './modules/characters/infrastructure/characters.module';

const interceptors: Provider[] = [
  {
    provide: APP_INTERCEPTOR,
    useClass: ContextInterceptor,
  },
]

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
    CharactersModule,
  ],
  providers: [
    GracefulShutdown,
    ...interceptors,
  ]
})
export class AppModule {
}
