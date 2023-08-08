import { Inject } from '@nestjs/common';
import { QueryBus, QueryHandler } from '@nestjs/cqrs';
import type { IQueryHandler } from '@nestjs/cqrs';
import { QueryBase } from '../../../../../libs/application/query.base';
import { FindEpisodesByIdsQuery } from '../../../../episode/application/use-cases/queries/find-episodes-by-ids.query';
import { EpisodeEntity } from '../../../../episode/domain/entities/episode.entity';
import { CharacterEntity } from '../../../domain/entities/character.entity';
import { CharacterRepository } from '../../../domain/ports/character.repository';
import { CHARACTER_REPOSITORY } from '../../../character.di-tokens';

export class FindCharacterQuery extends QueryBase {
  readonly characterId: string;

  constructor(props: FindCharacterQuery) {
    super();

    this.characterId = props.characterId;
  }
}

@QueryHandler(FindCharacterQuery)
export class FindCharacterUseCase implements IQueryHandler {
  constructor(
    @Inject(CHARACTER_REPOSITORY) private readonly repository: CharacterRepository,
    private readonly queryBus: QueryBus,
  ) {
  }

  async execute({characterId}: FindCharacterQuery): Promise<CharacterEntity | null> {
    const character = await this.repository.findOneById(characterId);
    if (character) {
      const episodes = await this.queryBus.execute<FindEpisodesByIdsQuery, EpisodeEntity[]>(
        new FindEpisodesByIdsQuery({episodesIds: character?.getProps().episodesIds}),
      );
      character.attachEpisodes(episodes);
    }

    return character;
  }
}
