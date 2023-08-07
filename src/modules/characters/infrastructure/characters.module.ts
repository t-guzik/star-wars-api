import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateCharacterUseCase } from '../application/use-cases/commands/create-character.command';
import { DeleteCharacterUseCase } from '../application/use-cases/commands/delete-character.command';
import { SetCharacterEpisodesUseCase } from '../application/use-cases/commands/set-character-episodes.command';
import { UpdateCharacterUseCase } from '../application/use-cases/commands/update-character.command';
import {
  UnassignCharacterEpisodeWhenEpisodeIsDeletedDomainEventHandler
} from '../application/use-cases/event-handlers/unassign-character-episode-when-episode-is-deleted.domain-event-handler';
import { FindCharacterUseCase } from '../application/use-cases/queries/find-character.query';
import { FindCharactersPaginatedListUseCase } from '../application/use-cases/queries/find-characters-paginated-list.query';
import { CharactersRepository } from '../domain/ports/characters.repository';
import { CharacterRepositoryAdapter } from './adapters/characters.repository';
import { CreateCharacterHttpController } from './controllers/create-character.http.controller';
import { DeleteCharacterHttpController } from './controllers/delete-character.http.controller';
import { FindCharacterHttpController } from './controllers/find-character.http.controller';
import { FindCharactersPaginatedListHttpController } from './controllers/find-characters-paginated-list.http.controller';
import { SetCharacterEpisodesHttpController } from './controllers/set-character-episodes.http.controller';
import { UpdateCharacterHttpController } from './controllers/update-character.http.controller';
import { CharacterMapper } from './mappers/character.mapper';

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
  UnassignCharacterEpisodeWhenEpisodeIsDeletedDomainEventHandler,
];

const adapters: Provider[] = [
  {
    provide: CharactersRepository,
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
export class CharactersModule {
}
