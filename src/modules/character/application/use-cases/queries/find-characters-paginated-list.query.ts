import { Inject } from '@nestjs/common';
import { QueryBus, QueryHandler } from '@nestjs/cqrs';
import type { IQueryHandler } from '@nestjs/cqrs';
import { PaginatedParams, PaginatedQueryBase } from '../../../../../libs/application/query.base';
import { Paginated } from '../../../../../libs/domain/ports/repository.port';
import { FindEpisodesByIdsQuery } from '../../../../episode/application/use-cases/queries/find-episodes-by-ids.query';
import { EpisodeEntity } from '../../../../episode/domain/entities/episode.entity';
import { CharacterEntity } from '../../../domain/entities/character.entity';
import { CharacterRepository } from '../../../domain/ports/character.repository';
import { CHARACTER_REPOSITORY } from '../../../character.di-tokens';

export class FindCharactersPaginatedListQuery extends PaginatedQueryBase {
  readonly episodesIds?: string[];

  constructor(props: PaginatedParams<FindCharactersPaginatedListQuery>) {
    super(props);

    this.episodesIds = props.episodesIds;
  }
}

@QueryHandler(FindCharactersPaginatedListQuery)
export class FindCharactersPaginatedListUseCase implements IQueryHandler {
  constructor(
    @Inject(CHARACTER_REPOSITORY) private readonly repository: CharacterRepository,
    private readonly queryBus: QueryBus,
  ) {
  }

  async execute(query: FindCharactersPaginatedListQuery): Promise<Paginated<CharacterEntity>> {
    const characters = await this.repository.findPaginated(query);
    const episodesIds = characters.items.flatMap(item => item.getProps().episodesIds);
    const episodes = await this.queryBus.execute<FindEpisodesByIdsQuery, EpisodeEntity[]>(
      new FindEpisodesByIdsQuery({episodesIds}),
    );

    for (const character of characters.items) {
      character.attachEpisodes(episodes.filter(episode => character.hasEpisodeAssigned(episode.id)));
    }

    return new Paginated(characters);
  }
}
