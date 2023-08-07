import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateEpisodeRequestDto {
  @ApiProperty({example: 'NEWHOPE', description: "Episode's name"})
  @MaxLength(256)
  @MinLength(1)
  @IsString()
  @IsNotEmpty()
  @Transform(({value}) => value.toUpperCase())
  readonly name: string;
}
