import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { OrderBy } from '../../domain/ports/repository.port';

const OrderParams: OrderBy['param'][] = ['asc', 'desc'];

export abstract class OrderByQueryRequestDto<SortKey> {
  abstract readonly orderByField?: SortKey;

  @ApiPropertyOptional({ type: String, enum: OrderParams, default: 'desc' })
  @IsEnum(OrderParams)
  @IsOptional()
  readonly orderByParam?: OrderBy['param'] = 'desc';
}

export abstract class PaginatedQueryRequestDto<SortKey> extends OrderByQueryRequestDto<SortKey> {
  @ApiPropertyOptional({ default: 20 })
  @IsInt()
  @Min(0)
  @Max(1000)
  @Type(() => Number)
  @Transform(({ value }) => +value)
  readonly limit: number = 20;

  @ApiPropertyOptional({ default: 0 })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  @Transform(({ value }) => +value)
  readonly offset: number = 0;
}
