import { registerAs } from '@nestjs/config';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import process from 'process';
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
}


export const PostgresDatabaseConfig = registerAs<PostgresDatabaseConfigInterface, () => PostgresDatabaseConfigInterface>(PostgresDatabaseConfigToken, () => {
  return {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    name: process.env.POSTGRES_NAME,
    loggerEnabled: castToBoolean(process.env.POSTGRES_LOGGER_ENABLED as any),
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
