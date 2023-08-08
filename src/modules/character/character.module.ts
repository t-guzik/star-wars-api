import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateCharacterUseCase } from './application/use-cases/commands/create-character.command';
import { DeleteCharacterUseCase } from './application/use-cases/commands/delete-character.command';
import { SetCharacterEpisodesUseCase } from './application/use-cases/commands/set-character-episodes.command';
import { UpdateCharacterUseCase } from './application/use-cases/commands/update-character.command';
import { UnassignCharacterEpisodeWhenEpisodeIsDeletedEventHandler } from './application/event-handlers/unassign-character-episode-when-episode-is-deleted.event-handler';
import { FindCharacterUseCase } from './application/use-cases/queries/find-character.query';
import { FindCharactersPaginatedListUseCase } from './application/use-cases/queries/find-characters-paginated-list.query';
import { CharacterRepositoryAdapter } from './infrastructure/adapters/character.repository';
import { CHARACTER_REPOSITORY } from './character.di-tokens';
import { CreateCharacterHttpController } from './infrastructure/controllers/create-character.http.controller';
import { DeleteCharacterHttpController } from './infrastructure/controllers/delete-character.http.controller';
import { FindCharacterHttpController } from './infrastructure/controllers/find-character.http.controller';
import { FindCharactersPaginatedListHttpController } from './infrastructure/controllers/find-characters-paginated-list.http.controller';
import { SetCharacterEpisodesHttpController } from './infrastructure/controllers/set-character-episodes.http.controller';
import { UpdateCharacterHttpController } from './infrastructure/controllers/update-character.http.controller';
import { CharacterMapper } from './infrastructure/character.mapper';

const useCases: Provider[] = [
  // Commands
  CreateCharacterUseCase,
  DeleteCharacterUseCase,
  SetCharacterEpisodesUseCase,
  UpdateCharacterUseCase,
  // Queries
  FindCharacterUseCase,
  FindCharactersPaginatedListUseCase,
  // Event handlers
  UnassignCharacterEpisodeWhenEpisodeIsDeletedEventHandler,
];

const adapters: Provider[] = [
  {
    provide: CHARACTER_REPOSITORY,
    useClass: CharacterRepositoryAdapter,
  },
];

const mappers: Provider[] = [CharacterMapper];

@Module({
  imports: [CqrsModule],
  providers: [...useCases, ...adapters, ...mappers],
  controllers: [
    CreateCharacterHttpController,
    DeleteCharacterHttpController,
    SetCharacterEpisodesHttpController,
    UpdateCharacterHttpController,
    FindCharacterHttpController,
    FindCharactersPaginatedListHttpController,
  ],
})
export class CharacterModule {}
