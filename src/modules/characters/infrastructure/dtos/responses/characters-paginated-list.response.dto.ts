import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponseDto } from '../../../../../libs/infrastructure/dtos/responses/paginated.response.base';
import { CharacterResponseDto } from './characters.response.dto';

export class CharactersPaginatedListResponseDto extends PaginatedResponseDto<CharacterResponseDto> {
  @ApiProperty({type: CharacterResponseDto, isArray: true})
  readonly items: readonly CharacterResponseDto[];
}
