import { BaseSqlRepository } from '../../../../libs/infrastructure/base.sql.repository';
import { ObjectLiteral } from '../../../../libs/types/base.types';
import { EpisodeEntity } from '../entities/episode.entity';

export abstract class EpisodesRepository<DbModel extends ObjectLiteral = never> extends BaseSqlRepository<
  EpisodeEntity,
  DbModel
> {
  abstract findByIds(ids: string[]): Promise<EpisodeEntity[]>;

  abstract findOneByName(name: string): Promise<EpisodeEntity | null>;
}
