import {
  NotFoundException as NotFoundHttpException,
  Controller,
  HttpStatus,
  Param,
  Delete,
  Version,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { HttpApiRoutes, HttpApiVersion } from '../../../../config/http-routes';
import { SwaggerApiTags } from '../../../../config/swagger';
import { NotFoundException } from '../../../../libs/domain/exceptions';
import { ApiErrorResponse } from '../../../../libs/infrastructure/dtos/responses/api-error.response';
import { DeleteEpisodeCommand } from '../../application/use-cases/commands/delete-episode.command';
import { FindEpisodeByIdRequestDto } from '../dtos/requests/find-episode-by-id.request.dto';

@ApiTags(SwaggerApiTags.Episodes)
@Controller()
export class DeleteEpisodeHttpController {
  constructor(private readonly commandBus: CommandBus) {
  }

  @Version(HttpApiVersion.V1)
  @ApiOperation({summary: 'Delete an episode'})
  @ApiResponse({status: HttpStatus.NO_CONTENT})
  @ApiResponse({status: HttpStatus.BAD_REQUEST, type: ApiErrorResponse})
  @ApiResponse({status: HttpStatus.NOT_FOUND, description: NotFoundException.message, type: ApiErrorResponse})
  @Delete(HttpApiRoutes.episodes.delete)
  async deleteEpisode(@Param() {id: episodeId}: FindEpisodeByIdRequestDto): Promise<void> {
    try {
      await this.commandBus.execute<DeleteEpisodeCommand, void>(new DeleteEpisodeCommand({episodeId}));

      // TODO emit domain event and unassign from characters
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundHttpException(error.message);
      }

      throw error;
    }
  }
}
