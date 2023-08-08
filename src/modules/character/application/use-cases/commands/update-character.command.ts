import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommandProps } from '../../../../../libs/application/command.base';
import { NotFoundException } from '../../../../../libs/domain/exceptions';
import { CharacterRepository } from '../../../domain/ports/character.repository';
import { CHARACTER_REPOSITORY } from '../../../character.di-tokens';

export class UpdateCharacterCommand {
  readonly characterId: string;
  readonly name?: string;
  readonly planet?: string | null;

  constructor(props: CommandProps<UpdateCharacterCommand>) {
    this.characterId = props.characterId;
    this.name = props.name;
    this.planet = props.planet;
  }
}

@CommandHandler(UpdateCharacterCommand)
export class UpdateCharacterUseCase implements ICommandHandler<UpdateCharacterCommand, void> {
  constructor(@Inject(CHARACTER_REPOSITORY) private readonly repository: CharacterRepository) {}

  async execute(command: UpdateCharacterCommand): Promise<void> {
    const existingCharacter = await this.repository.findOneById(command.characterId);
    if (!existingCharacter) {
      throw new NotFoundException();
    }
    const { name } = existingCharacter.getProps();

    existingCharacter.updateName(command.name || name);

    if (command.planet) {
      existingCharacter.setPlanet(command.planet);
    } else if (command.planet === null) {
      existingCharacter.removePlanet();
    }

    await this.repository.update(existingCharacter);
  }
}
