import { Inject } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import type { IQueryHandler } from '@nestjs/cqrs';
import { QueryBase } from '../../../../../libs/application/query.base';
import { EpisodeEntity } from '../../../domain/entities/episode.entity';
import { EpisodeRepository } from '../../../domain/ports/episode.repository';
import { EPISODE_REPOSITORY } from '../../../episode.di-tokens';

export class FindEpisodesByIdsQuery extends QueryBase {
  readonly episodesIds: string[];

  constructor(props: FindEpisodesByIdsQuery) {
    super();

    this.episodesIds = props.episodesIds;
  }
}

@QueryHandler(FindEpisodesByIdsQuery)
export class FindEpisodesByIdsUseCase implements IQueryHandler {
  constructor(@Inject(EPISODE_REPOSITORY) private readonly repository: EpisodeRepository) {}

  async execute({ episodesIds }: FindEpisodesByIdsQuery): Promise<EpisodeEntity[]> {
    return this.repository.findByIds(episodesIds);
  }
}
