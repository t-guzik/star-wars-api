import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigFactories, EnvironmentVariablesValidators } from './config/namespaces';
import {
  PostgresDatabaseConfigInterface,
  PostgresDatabaseConfigToken,
} from './config/namespaces/postgres-database.config';
import { validate } from './config/validation';
import { RequestContextModule } from 'nestjs-request-context';
import { CqrsModule } from '@nestjs/cqrs';
import { SlonikModule } from 'nestjs-slonik';

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
  ],
})
export class AppModule {
}
