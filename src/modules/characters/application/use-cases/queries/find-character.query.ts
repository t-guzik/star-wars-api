import { QueryHandler } from '@nestjs/cqrs';
import type { IQueryHandler } from '@nestjs/cqrs';
import { QueryBase } from '../../../../../libs/application/query.base';
import { CharacterEntity } from '../../../domain/entities/character.entity';
import { CharactersRepository } from '../../../domain/ports/characters.repository';

export class FindCharacterQuery extends QueryBase {
  readonly characterId: string;

  constructor(props: FindCharacterQuery) {
    super();

    this.characterId = props.characterId;
  }
}

@QueryHandler(FindCharacterQuery)
export class FindCharacterUseCase implements IQueryHandler {
  constructor(private readonly repository: CharactersRepository) {
  }

  async execute({characterId}: FindCharacterQuery): Promise<CharacterEntity | null> {
    return this.repository.findOneById(characterId);
  }
}
