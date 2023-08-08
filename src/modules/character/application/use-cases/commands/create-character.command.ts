import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommandProps } from '../../../../../libs/application/command.base';
import { AggregateID } from '../../../../../libs/domain/entity.base';
import { CharacterAlreadyExistsException } from '../../../domain/character.exceptions';
import { CharacterEntity } from '../../../domain/entities/character.entity';
import { CharacterRepository } from '../../../domain/ports/character.repository';
import { CHARACTER_REPOSITORY } from '../../../character.di-tokens';

export class CreateCharacterCommand {
  readonly name: string;
  readonly planet: string | null;

  constructor(props: CommandProps<CreateCharacterCommand>) {
    this.name = props.name;
    this.planet = props.planet;
  }
}

@CommandHandler(CreateCharacterCommand)
export class CreateCharacterUseCase implements ICommandHandler<CreateCharacterCommand, AggregateID> {
  constructor(@Inject(CHARACTER_REPOSITORY) private readonly repository: CharacterRepository) {}

  async execute(command: CreateCharacterCommand): Promise<AggregateID> {
    const existingCharacter = await this.repository.findOneByName(command.name);
    if (existingCharacter) {
      throw new CharacterAlreadyExistsException();
    }

    const characterEntity = CharacterEntity.create(command);
    await this.repository.save(characterEntity);

    return characterEntity.id;
  }
}
