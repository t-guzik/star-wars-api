import {
  Body,
  ConflictException as ConflictHttpException,
  Controller,
  HttpStatus,
  Post,
  Version,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { HttpApiRoutes, HttpApiVersion } from '../../../../config/http-routes';
import { SwaggerApiTags } from '../../../../config/swagger';
import { AggregateID } from '../../../../libs/domain/entity.base';
import { ApiErrorResponse } from '../../../../libs/dtos/responses/api-error.response';
import { IdResponse } from '../../../../libs/dtos/responses/id.response.dto';
import { CreateEpisodeCommand } from '../../application/use-cases/commands/create-episode.command';
import { EpisodeAlreadyExistsException } from '../../domain/episode.exceptions';
import { CreateEpisodeRequestDto } from '../dtos/requests/create-episode.request.dto';

@ApiTags(SwaggerApiTags.Episodes)
@Controller()
export class CreateEpisodeHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Version(HttpApiVersion.V1)
  @ApiOperation({ summary: 'Create an episode' })
  @ApiResponse({ status: HttpStatus.OK, type: IdResponse })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: EpisodeAlreadyExistsException.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiErrorResponse })
  @Post(HttpApiRoutes.episodes.create)
  async createCharacter(@Body() body: CreateEpisodeRequestDto): Promise<IdResponse> {
    try {
      const result = await this.commandBus.execute<CreateEpisodeCommand, AggregateID>(new CreateEpisodeCommand(body));

      return new IdResponse(result);
    } catch (error) {
      if (error instanceof EpisodeAlreadyExistsException) {
        throw new ConflictHttpException(error.message);
      }

      throw error;
    }
  }
}
