import { QueryBus, QueryHandler } from '@nestjs/cqrs';
import type { IQueryHandler } from '@nestjs/cqrs';
import { QueryBase } from '../../../../../libs/application/query.base';
import { FindEpisodesByIdsQuery } from '../../../../episodes/application/use-cases/queries/find-episodes-by-ids.query';
import { EpisodeEntity } from '../../../../episodes/domain/entities/episode.entity';
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
  constructor(private readonly repository: CharactersRepository, private readonly queryBus: QueryBus) {
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
