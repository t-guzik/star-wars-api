import {
  Body,
  NotFoundException as NotFoundHttpException,
  Controller,
  HttpStatus,
  Param,
  Version,
  Patch,
  HttpCode,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { HttpApiRoutes, HttpApiVersion } from '../../../../config/http-routes';
import { SwaggerApiTags } from '../../../../config/swagger';
import { NotFoundException } from '../../../../libs/domain/exceptions';
import { ApiErrorResponse } from '../../../../libs/dtos/responses/api-error.response';
import { UpdateCharacterCommand } from '../../application/use-cases/commands/update-character.command';
import { FindCharacterByIdRequestDto } from '../dtos/requests/find-character-by-id.request.dto';
import { UpdateCharacterRequestDto } from '../dtos/requests/update-character.request.dto';

@ApiTags(SwaggerApiTags.Characters)
@Controller()
export class UpdateCharacterHttpController {
  constructor(private readonly commandBus: CommandBus) {
  }

  @Version(HttpApiVersion.V1)
  @ApiOperation({summary: "Update character's attributes", description: "Update character's name or planet"})
  @ApiResponse({status: HttpStatus.NO_CONTENT})
  @ApiResponse({status: HttpStatus.BAD_REQUEST, type: ApiErrorResponse})
  @ApiResponse({status: HttpStatus.NOT_FOUND, description: NotFoundException.message, type: ApiErrorResponse})
  @Patch(HttpApiRoutes.characters.update)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateCharacter(
    @Param() {id: characterId}: FindCharacterByIdRequestDto,
    @Body() body: UpdateCharacterRequestDto,
  ): Promise<void> {
    try {
      await this.commandBus.execute<UpdateCharacterCommand>(new UpdateCharacterCommand({characterId, ...body}));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundHttpException(error.message);
      }

      throw error;
    }
  }
}
