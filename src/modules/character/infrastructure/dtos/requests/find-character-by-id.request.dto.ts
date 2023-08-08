import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class FindCharacterByIdRequestDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID('4')
  readonly id: string;
}
