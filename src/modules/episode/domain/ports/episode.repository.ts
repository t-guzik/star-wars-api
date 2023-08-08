import { RepositoryPort } from '../../../../libs/domain/ports/repository.port';
import { EpisodeEntity } from '../entities/episode.entity';

export interface EpisodeRepository extends RepositoryPort<EpisodeEntity> {
  findByIds(ids: string[]): Promise<EpisodeEntity[]>;

  findOneByName(name: string): Promise<EpisodeEntity | null>;
}
