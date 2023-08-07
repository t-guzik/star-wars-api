import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginatedQueryRequestDto } from '../../../../../libs/infrastructure/dtos/requests/paginated-query.request.dto';

type SortKey = 'created_at' | 'name' | 'planet';
const SortKeys: SortKey[] = ['created_at', 'name', 'planet'];

export class FindCharactersPaginatedListRequestDto extends PaginatedQueryRequestDto<SortKey> {
  @ApiPropertyOptional({format: 'uuid'})
  @IsUUID('4', {each: true})
  @Transform(({value}) => (Array.isArray(value) ? value:[value]))
  @IsOptional()
  readonly episodesIds?: string[];

  @ApiPropertyOptional({enum: SortKeys, type: String, default: 'created_at'})
  @IsEnum(SortKeys)
  @IsOptional()
  readonly orderByField: SortKey;
}
