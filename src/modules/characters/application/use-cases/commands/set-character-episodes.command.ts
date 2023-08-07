import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommandProps } from '../../../../../libs/application/command.base';
import { NotFoundException } from '../../../../../libs/domain/exceptions';
import { CharactersRepository } from '../../../domain/ports/characters.repository';

export class SetCharacterEpisodesCommand {
  readonly characterId: string;
  readonly episodesIds: string[];

  constructor(props: CommandProps<SetCharacterEpisodesCommand>) {
    this.characterId = props.characterId;
    this.episodesIds = props.episodesIds;
  }
}

@CommandHandler(SetCharacterEpisodesCommand)
export class SetCharacterEpisodesUseCase implements ICommandHandler<SetCharacterEpisodesCommand, void> {
  constructor(
    protected readonly repository: CharactersRepository,
  ) {
  }

  async execute(
    command: SetCharacterEpisodesCommand
  ): Promise<void> {
    const existingCharacter = await this.repository.findOneById(command.characterId);
    if (!existingCharacter) {
      throw new NotFoundException();
    }

    existingCharacter.setEpisodes(command.episodesIds);

    await this.repository.update(existingCharacter);
  }
}