import { QueryHandler } from '@nestjs/cqrs';
import type { IQueryHandler } from '@nestjs/cqrs';
import { QueryBase } from '../../../../../libs/application/query.base';
import { EpisodeEntity } from '../../../domain/entities/episode.entity';
import { EpisodesRepository } from '../../../domain/ports/episodes.repository';

export class FindEpisodesByIdsQuery extends QueryBase {
  readonly episodesIds: string[];

  constructor(props: FindEpisodesByIdsQuery) {
    super();

    this.episodesIds = props.episodesIds;
  }
}

@QueryHandler(FindEpisodesByIdsQuery)
export class FindEpisodesByIdsUseCase implements IQueryHandler {
  constructor(private readonly repository: EpisodesRepository) {
  }

  async execute({episodesIds}: FindEpisodesByIdsQuery): Promise<EpisodeEntity[]> {
    return this.repository.findByIds(episodesIds);
  }
}
