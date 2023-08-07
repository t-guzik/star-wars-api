import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCharacterRequestDto {
  @ApiProperty({example: 'Leia Organa', description: "Character's name"})
  @MaxLength(256)
  @MinLength(1)
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({example: 'Alderaan', description: "Character's planet"})
  @MaxLength(256)
  @MinLength(1)
  @IsString()
  @IsOptional()
  readonly planet: string | null = null;
}
