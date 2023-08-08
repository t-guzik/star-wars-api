import { registerAs } from '@nestjs/config';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsNumberString } from 'class-validator';
import { BooleanAsString } from '../types';
import { castToBoolean } from '../utils';

export const CorsConfigToken = 'cors';

export interface CorsConfigInterface {
  allowedHeaders?: string;
  credentials: boolean;
  maxAge: number; // seconds
  methods: string;
  origin?: string;
  preflightContinue: boolean;
}

export const CorsConfig = registerAs<CorsConfigInterface, () => CorsConfigInterface>(CorsConfigToken, () => {
  return {
    allowedHeaders: process.env.CORS_ALLOWED_HEADERS,
    credentials: castToBoolean(process.env.CORS_CREDENTIALS as BooleanAsString),
    maxAge: Number(process.env.CORS_MAX_AGE_SECONDS),
    methods: process.env.CORS_METHODS,
    origin: process.env.CORS_ORIGIN,
    preflightContinue: false,
  };
});

export class CorsConfigEnvironmentVariables {
  @Expose()
  @IsString()
  @IsOptional()
  CORS_ALLOWED_HEADERS?: string;

  @Expose()
  @IsEnum(BooleanAsString)
  CORS_CREDENTIALS = BooleanAsString.True;

  @Expose()
  @IsNumberString()
  CORS_MAX_AGE_SECONDS = '600'; // 10 minutes

  @Expose()
  @IsString()
  CORS_METHODS = 'GET,OPTIONS,HEAD,PUT,PATCH,POST,DELETE';

  @Expose()
  @IsString()
  @IsOptional()
  CORS_ORIGIN?: string;
}
