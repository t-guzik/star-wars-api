import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EpisodesRepository } from '../domain/ports/episodes.repository';
import { EpisodeRepositoryAdapter } from './adapters/episodes.repository';
import { EpisodeMapper } from './mappers/episode.mapper';

const useCases: Provider[] = [];

const adapters: Provider[] = [
  {
    provide: EpisodesRepository,
    useClass: EpisodeRepositoryAdapter,
  },
];

const mappers: Provider[] = [EpisodeMapper];

@Module({
  imports: [CqrsModule],
  providers: [...useCases, ...adapters, ...mappers],
  controllers: [],
})
export class EpisodesModule {
}
