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
import { DeleteCharacterCommand } from '../../application/use-cases/commands/delete-character.command';
import { FindCharacterByIdRequestDto } from '../dtos/requests/find-character-by-id.request.dto';

@ApiTags(SwaggerApiTags.Characters)
@Controller()
export class DeleteCharacterHttpController {
  constructor(private readonly commandBus: CommandBus) {
  }

  @Version(HttpApiVersion.V1)
  @ApiOperation({summary: 'Delete a character'})
  @ApiResponse({status: HttpStatus.NO_CONTENT})
  @ApiResponse({status: HttpStatus.BAD_REQUEST, type: ApiErrorResponse})
  @ApiResponse({status: HttpStatus.NOT_FOUND, description: NotFoundException.message, type: ApiErrorResponse})
  @Delete(HttpApiRoutes.characters.delete)
  async deleteCharacter(@Param() {id: characterId}: FindCharacterByIdRequestDto): Promise<void> {
    try {
      await this.commandBus.execute<DeleteCharacterCommand, void>(new DeleteCharacterCommand({characterId}));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundHttpException(error.message);
      }

      throw error;
    }
  }
}
