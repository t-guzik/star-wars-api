import { Paginated, PaginatedQueryParams, RepositoryPort } from '../../../../libs/domain/ports/repository.port';
import { ObjectLiteral } from '../../../../libs/types/base.types';
import { CharacterEntity } from '../entities/character.entity';

export interface FindQueryParams<DbModel = unknown> extends PaginatedQueryParams<keyof DbModel> {
  episodesIds?: string[];
}

export interface CharacterRepository<DbModel extends ObjectLiteral = never> extends RepositoryPort<CharacterEntity> {
  findPaginated(params: FindQueryParams<DbModel>): Promise<Paginated<CharacterEntity>>;

  find(params: Pick<FindQueryParams<DbModel>, 'episodesIds'>): Promise<CharacterEntity[]>;

  findOneByName(name: string): Promise<CharacterEntity | null>;

  update(entity: CharacterEntity): Promise<void>;
}
