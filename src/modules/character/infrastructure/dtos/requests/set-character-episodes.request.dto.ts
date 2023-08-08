import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class SetCharacterEpisodesRequestDto {
  @ApiProperty({ format: 'uuid', type: [String] })
  @IsUUID('4', { each: true })
  readonly episodesIds: string[];
}
