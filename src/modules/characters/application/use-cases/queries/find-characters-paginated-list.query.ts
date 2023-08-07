import { QueryHandler } from '@nestjs/cqrs';
import type { IQueryHandler } from '@nestjs/cqrs';
import { PaginatedParams, PaginatedQueryBase } from '../../../../../libs/application/query.base';
import { Paginated } from '../../../../../libs/domain/ports/repository.port';
import { CharacterEntity } from '../../../domain/entities/character.entity';
import { CharactersRepository } from '../../../domain/ports/characters.repository';

export class FindCharactersPaginatedListQuery extends PaginatedQueryBase {
  readonly episodesIds?: string[];

  constructor(props: PaginatedParams<FindCharactersPaginatedListQuery>) {
    super(props);

    this.episodesIds = props.episodesIds;
  }
}

@QueryHandler(FindCharactersPaginatedListQuery)
export class FindCharactersPaginatedListUseCase implements IQueryHandler {
  constructor(private readonly repository: CharactersRepository) {
  }

  async execute(query: FindCharactersPaginatedListQuery): Promise<Paginated<CharacterEntity>> {
    const entities = await this.repository.findPaginated(query);

    return new Paginated(entities);
  }
}
