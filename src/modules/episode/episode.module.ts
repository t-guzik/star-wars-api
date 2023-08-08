import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateEpisodeUseCase } from './application/use-cases/commands/create-episode.command';
import { DeleteEpisodeUseCase } from './application/use-cases/commands/delete-episode.command';
import { FindEpisodesByIdsUseCase } from './application/use-cases/queries/find-episodes-by-ids.query';
import { EpisodeRepositoryAdapter } from './infrastructure/adapters/episode.repository';
import { CreateEpisodeHttpController } from './infrastructure/controllers/create-episode.http.controller';
import { DeleteEpisodeHttpController } from './infrastructure/controllers/delete-episode.http.controller';
import { EPISODE_REPOSITORY } from './episode.di-tokens';
import { EpisodeMapper } from './infrastructure/episode.mapper';

const useCases: Provider[] = [
  // Commands
  CreateEpisodeUseCase,
  DeleteEpisodeUseCase,
  //Queries
  FindEpisodesByIdsUseCase,
];

const adapters: Provider[] = [
  {
    provide: EPISODE_REPOSITORY,
    useClass: EpisodeRepositoryAdapter,
  },
];

const mappers: Provider[] = [EpisodeMapper];

@Module({
  imports: [CqrsModule],
  providers: [...useCases, ...adapters, ...mappers],
  controllers: [CreateEpisodeHttpController, DeleteEpisodeHttpController],
})
export class EpisodeModule {}
