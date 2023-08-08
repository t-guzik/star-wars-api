import { PartialType } from '@nestjs/swagger';
import { CreateCharacterRequestDto } from './create-character.request.dto';

export class UpdateCharacterRequestDto extends PartialType(CreateCharacterRequestDto) {
}
