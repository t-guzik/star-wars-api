import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigFactories, EnvironmentVariablesValidators } from './config/namespaces';
import { validate } from './config/validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: ConfigFactories,
      validate: validate(EnvironmentVariablesValidators),
      validationOptions: {abortEarly: true},
    }),
  ],
})
export class AppModule {
}
