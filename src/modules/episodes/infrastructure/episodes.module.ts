import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateEpisodeUseCase } from '../application/use-cases/commands/create-episode.command';
import { DeleteEpisodeUseCase } from '../application/use-cases/commands/delete-episode.command';
import { FindEpisodesByIdsUseCase } from '../application/use-cases/queries/find-episodes-by-ids.query';
import { EpisodesRepository } from '../domain/ports/episodes.repository';
import { EpisodeRepositoryAdapter } from './adapters/episodes.repository';
import { CreateEpisodeHttpController } from './controllers/create-episode.http.controller';
import { DeleteEpisodeHttpController } from './controllers/delete-episode.http.controller';
import { EpisodeMapper } from './mappers/episode.mapper';

const useCases: Provider[] = [CreateEpisodeUseCase, DeleteEpisodeUseCase, FindEpisodesByIdsUseCase];

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
  controllers: [CreateEpisodeHttpController, DeleteEpisodeHttpController],
})
export class EpisodesModule {
}
