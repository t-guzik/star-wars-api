import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommandProps } from '../../../../../libs/application/command.base';
import { NotFoundException } from '../../../../../libs/domain/exceptions';
import { CharacterRepository } from '../../../domain/ports/character.repository';
import { CHARACTER_REPOSITORY } from '../../../character.di-tokens';

export class DeleteCharacterCommand {
  readonly characterId: string;

  constructor(props: CommandProps<DeleteCharacterCommand>) {
    this.characterId = props.characterId;
  }
}

@CommandHandler(DeleteCharacterCommand)
export class DeleteCharacterUseCase implements ICommandHandler<DeleteCharacterCommand, void> {
  constructor(@Inject(CHARACTER_REPOSITORY) private readonly repository: CharacterRepository) {
  }

  async execute(command: DeleteCharacterCommand): Promise<void> {
    const existingCharacter = await this.repository.findOneById(command.characterId);
    if (!existingCharacter) {
      throw new NotFoundException();
    }

    await this.repository.delete(existingCharacter);
  }
}
