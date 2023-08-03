import { ConfigFactory } from '@nestjs/config';
import { ClassConstructor } from 'class-transformer';
import { PostgresDatabaseConfig, PostgresDatabaseConfigEnvironmentVariables } from './postgres-database.config';
import { ServerConfig, ServerConfigEnvironmentVariables } from './server.config';
import { LoggerConfig, LoggerConfigEnvironmentVariables } from './logger.config';
import { CorsConfig, CorsConfigEnvironmentVariables } from './cors.config';

export const ConfigFactories: ConfigFactory[] = [
  CorsConfig,
  PostgresDatabaseConfig,
  LoggerConfig,
  ServerConfig,
];

export class EnvVariables {
}

export const EnvironmentVariablesValidators: ClassConstructor<EnvVariables>[] = [
  CorsConfigEnvironmentVariables,
  PostgresDatabaseConfigEnvironmentVariables,
  LoggerConfigEnvironmentVariables,
  ServerConfigEnvironmentVariables,
];

if (ConfigFactories.length!==EnvironmentVariablesValidators.length) {
  throw new Error('Missing config validator!');
}
