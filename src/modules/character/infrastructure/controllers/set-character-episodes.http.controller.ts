import {
  Body,
  NotFoundException as NotFoundHttpException,
  Controller,
  HttpStatus,
  Put,
  Version,
  Param,
  BadRequestException as BadRequestHttpException,
  HttpCode,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { HttpApiRoutes, HttpApiVersion } from '../../../../config/http-routes';
import { SwaggerApiTags } from '../../../../config/swagger';
import { NotFoundException } from '../../../../libs/domain/exceptions';
import { ApiErrorResponse } from '../../../../libs/dtos/responses/api-error.response';
import { SetCharacterEpisodesCommand } from '../../application/use-cases/commands/set-character-episodes.command';
import { InvalidCharacterEpisodesAttached } from '../../domain/character.exceptions';
import { FindCharacterByIdRequestDto } from '../dtos/requests/find-character-by-id.request.dto';
import { SetCharacterEpisodesRequestDto } from '../dtos/requests/set-character-episodes.request.dto';

@ApiTags(SwaggerApiTags.Characters)
@Controller()
export class SetCharacterEpisodesHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Version(HttpApiVersion.V1)
  @ApiOperation({ summary: 'Assign episodes to a character' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiErrorResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: NotFoundException.message, type: ApiErrorResponse })
  @Put(HttpApiRoutes.characters.setEpisodes)
  @HttpCode(HttpStatus.NO_CONTENT)
  async setCharacterEpisodes(
    @Param() { id: characterId }: FindCharacterByIdRequestDto,
    @Body() { episodesIds }: SetCharacterEpisodesRequestDto,
  ): Promise<void> {
    try {
      await this.commandBus.execute<SetCharacterEpisodesCommand>(
        new SetCharacterEpisodesCommand({ characterId, episodesIds }),
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundHttpException(error.message);
      }

      if (error instanceof InvalidCharacterEpisodesAttached) {
        throw new BadRequestHttpException('Invalid episodes');
      }

      throw error;
    }
  }
}
