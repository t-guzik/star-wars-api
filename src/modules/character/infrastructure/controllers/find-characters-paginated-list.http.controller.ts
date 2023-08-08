import { Controller, HttpStatus, Get, Version, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { HttpApiRoutes, HttpApiVersion } from '../../../../config/http-routes';
import { SwaggerApiTags } from '../../../../config/swagger';
import { Paginated } from '../../../../libs/domain/ports/repository.port';
import { ApiErrorResponse } from '../../../../libs/dtos/responses/api-error.response';
import { FindCharactersPaginatedListQuery } from '../../application/use-cases/queries/find-characters-paginated-list.query';
import { CharacterEntity } from '../../domain/entities/character.entity';
import { FindCharactersPaginatedListRequestDto } from '../dtos/requests/find-characters-paginated-list.request.dto';
import { CharactersPaginatedListResponseDto } from '../dtos/responses/characters-paginated-list.response.dto';
import { CharacterMapper } from '../character.mapper';

@ApiTags(SwaggerApiTags.Characters)
@Controller()
export class FindCharactersPaginatedListHttpController {
  constructor(private readonly queryBus: QueryBus, private readonly mapper: CharacterMapper) {
  }

  @Version(HttpApiVersion.V1)
  @ApiOperation({summary: 'Find characters paginated list'})
  @ApiResponse({status: HttpStatus.OK, type: CharactersPaginatedListResponseDto})
  @ApiResponse({status: HttpStatus.BAD_REQUEST, type: ApiErrorResponse})
  @Get(HttpApiRoutes.characters.findPaginatedList)
  async findCharactersPaginatedList(
    @Query() {episodesIds, limit, offset, orderByParam, orderByField}: FindCharactersPaginatedListRequestDto,
  ): Promise<CharactersPaginatedListResponseDto> {
    const hasOrderByAttributes = orderByParam!==undefined && orderByField!==undefined;
    const paginated = await this.queryBus.execute<FindCharactersPaginatedListQuery, Paginated<CharacterEntity>>(
      new FindCharactersPaginatedListQuery({
        episodesIds,
        orderBy: hasOrderByAttributes ? {param: orderByParam, field: orderByField}:undefined,
        offset,
        limit,
      }),
    );

    return new CharactersPaginatedListResponseDto({
      ...paginated,
      items: paginated.items.map(this.mapper.toResponse),
    });
  }
}
