import { BooleanAsString, Environment } from '../types';
import { registerAs } from '@nestjs/config';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { castToBoolean } from '../utils';

export const ServerConfigToken = 'server';

export interface ServerConfigInterface {
  appName: string;
  debug: boolean;
  env: Environment;
  gracefulShutdownTimeoutMs: number;
  port: number;
  version: string;
}

export const ServerConfig = registerAs<ServerConfigInterface, () => ServerConfigInterface>(ServerConfigToken, () => ({
  appName: process.env.APP_NAME,
  debug: castToBoolean(process.env.DEBUG),
  env: process.env.ENV,
  gracefulShutdownTimeoutMs: Number(process.env.GRACEFUL_SHUTDOWN_TIMEOUT_MS),
  port: Number(process.env.PORT),
  version: process.env.VERSION!,
}));

export class ServerConfigEnvironmentVariables {
  @Expose()
  @IsString()
  @IsOptional()
  APP_NAME = 'star-wars-api';

  @Expose()
  @IsEnum(BooleanAsString)
  @IsOptional()
  DEBUG: BooleanAsString = BooleanAsString.False;

  @Expose()
  @IsEnum(Environment)
  ENV: Environment;

  @Expose()
  @IsNumberString()
  GRACEFUL_SHUTDOWN_TIMEOUT_MS = '30000'; // 30 seconds

  @Expose()
  @IsNumberString()
  @IsOptional()
  PORT = '3000';

  @Expose()
  @IsString()
  VERSION: string;
}
