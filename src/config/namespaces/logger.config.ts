import { LogLevel } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BooleanAsString } from '../types';
import { castToBoolean } from '../utils';

export const LoggerConfigToken = 'logger';

export interface LoggerConfigInterface {
  enabled: boolean;
  level: LogLevel;
}

export const LoggerConfig = registerAs<LoggerConfigInterface, () => LoggerConfigInterface>(LoggerConfigToken, () => ({
  level: process.env.LOGGER_LEVEL,
  enabled: castToBoolean(process.env.LOGGER_ENABLED),
}));

export class LoggerConfigEnvironmentVariables {
  @Expose()
  @IsEnum(BooleanAsString)
  @IsOptional()
  LOGGER_ENABLED: BooleanAsString = BooleanAsString.True;

  @Expose()
  @IsString()
  @IsOptional()
  LOGGER_LEVEL: LogLevel = 'log';
}
