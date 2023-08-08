import { registerAs } from '@nestjs/config';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { BooleanAsString } from '../types';
import { castToBoolean } from '../utils';

export const PostgresDatabaseConfigToken = 'postgres-database';

export interface PostgresDatabaseConfigInterface {
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
  loggerEnabled: boolean;
  connectionUri: string;
}

export const PostgresDatabaseConfig = registerAs<
  PostgresDatabaseConfigInterface,
  () => PostgresDatabaseConfigInterface
>(PostgresDatabaseConfigToken, () => {
  const {POSTGRES_HOST, POSTGRES_LOGGER_ENABLED, POSTGRES_NAME, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_USERNAME} =
    process.env;

  return {
    host: POSTGRES_HOST,
    port: POSTGRES_PORT,
    username: POSTGRES_USERNAME,
    password: POSTGRES_PASSWORD,
    name: POSTGRES_NAME,
    loggerEnabled: castToBoolean(POSTGRES_LOGGER_ENABLED as any),
    connectionUri: `postgres://${POSTGRES_USERNAME}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_NAME}`,
  };
});

export class PostgresDatabaseConfigEnvironmentVariables {
  @Expose()
  @IsString()
  POSTGRES_HOST: string;

  @Expose()
  @IsNumberString()
  @IsOptional()
  POSTGRES_PORT = 5432;

  @Expose()
  @IsString()
  POSTGRES_USERNAME: string;

  @Expose()
  @IsString()
  POSTGRES_PASSWORD: string;

  @Expose()
  @IsString()
  POSTGRES_NAME: string;

  @Expose()
  @IsEnum(BooleanAsString)
  POSTGRES_LOGGER_ENABLED: BooleanAsString = BooleanAsString.True;
}
