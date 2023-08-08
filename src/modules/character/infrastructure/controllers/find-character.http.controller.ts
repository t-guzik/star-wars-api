import {
  NotFoundException as NotFoundHttpException,
  Controller,
  HttpStatus,
  Param,
  Get,
  Version,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { HttpApiRoutes, HttpApiVersion } from '../../../../config/http-routes';
import { SwaggerApiTags } from '../../../../config/swagger';
import { NotFoundException } from '../../../../libs/domain/exceptions';
import { ApiErrorResponse } from '../../../../libs/dtos/responses/api-error.response';
import { FindCharacterQuery } from '../../application/use-cases/queries/find-character.query';
import { CharacterEntity } from '../../domain/entities/character.entity';
import { FindCharacterByIdRequestDto } from '../dtos/requests/find-character-by-id.request.dto';
import { CharacterResponseDto } from '../dtos/responses/characters.response.dto';
import { CharacterMapper } from '../character.mapper';

@ApiTags(SwaggerApiTags.Characters)
@Controller()
export class FindCharacterHttpController {
  constructor(private readonly queryBus: QueryBus, private readonly mapper: CharacterMapper) {}

  @Version(HttpApiVersion.V1)
  @ApiOperation({ summary: 'Find a character' })
  @ApiResponse({ status: HttpStatus.OK, type: CharacterResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiErrorResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: NotFoundException.message, type: ApiErrorResponse })
  @Get(HttpApiRoutes.characters.findOne)
  async findCharacter(@Param() { id: characterId }: FindCharacterByIdRequestDto): Promise<CharacterResponseDto> {
    const entity = await this.queryBus.execute<FindCharacterQuery, CharacterEntity | null>(
      new FindCharacterQuery({ characterId }),
    );
    if (!entity) {
      throw new NotFoundHttpException(NotFoundException.message);
    }

    return this.mapper.toResponse(entity);
  }
}
