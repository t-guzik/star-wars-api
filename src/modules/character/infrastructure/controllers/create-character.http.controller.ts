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
import { CreateCharacterCommand } from '../../application/use-cases/commands/create-character.command';
import { CharacterAlreadyExistsException } from '../../domain/character.exceptions';
import { CreateCharacterRequestDto } from '../dtos/requests/create-character.request.dto';

@ApiTags(SwaggerApiTags.Characters)
@Controller()
export class CreateCharacterHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Version(HttpApiVersion.V1)
  @ApiOperation({ summary: 'Create a character' })
  @ApiResponse({ status: HttpStatus.OK, type: IdResponse })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: CharacterAlreadyExistsException.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiErrorResponse })
  @Post(HttpApiRoutes.characters.create)
  async createCharacter(@Body() body: CreateCharacterRequestDto): Promise<IdResponse> {
    try {
      const result = await this.commandBus.execute<CreateCharacterCommand, AggregateID>(
        new CreateCharacterCommand(body),
      );

      return new IdResponse(result);
    } catch (error) {
      if (error instanceof CharacterAlreadyExistsException) {
        throw new ConflictHttpException(error.message);
      }

      throw error;
    }
  }
}
