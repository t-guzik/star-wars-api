import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommandProps } from '../../../../../libs/application/command.base';
import { NotFoundException } from '../../../../../libs/domain/exceptions';
import { CharactersRepository } from '../../../domain/ports/characters.repository';

export class DeleteCharacterCommand {
  readonly characterId: string;

  constructor(props: CommandProps<DeleteCharacterCommand>) {
    this.characterId = props.characterId;
  }
}

@CommandHandler(DeleteCharacterCommand)
export class DeleteCharacterUseCase implements ICommandHandler<DeleteCharacterCommand, void> {
  constructor(protected readonly repository: CharactersRepository) {
  }

  async execute(command: DeleteCharacterCommand): Promise<void> {
    const existingCharacter = await this.repository.findOneById(command.characterId);
    if (!existingCharacter) {
      throw new NotFoundException();
    }

    await this.repository.delete(existingCharacter);
  }
}
