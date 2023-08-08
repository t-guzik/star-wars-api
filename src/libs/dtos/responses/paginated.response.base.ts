import { ApiProperty } from '@nestjs/swagger';
import { Paginated } from '../../domain/ports/repository.port';

export abstract class PaginatedResponseDto<T> extends Paginated<T> {
  @ApiProperty({ example: 100 })
  readonly totalCount: number;

  @ApiProperty({ example: 20 })
  readonly limit: number;

  @ApiProperty({ example: 0 })
  readonly offset: number;

  @ApiProperty({ isArray: true })
  abstract readonly items: readonly T[];
}
