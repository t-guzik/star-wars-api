import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ResponseBase } from '../../../../../libs/dtos/responses/response.base';

export class CharacterResponseDto extends ResponseBase {
  @ApiProperty({ description: "Character's name", example: 'Leia Organa' })
  name: string;

  @ApiPropertyOptional({ example: 'Alderaan', description: "Character's planet" })
  planet?: string;

  @ApiProperty({ description: "Character's episodes", example: ['NEWHOPE', 'EMPIRE', 'JEDI'] })
  episodes: string[];
}
