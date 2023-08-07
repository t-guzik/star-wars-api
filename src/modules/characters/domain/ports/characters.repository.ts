import { Paginated, PaginatedQueryParams } from '../../../../libs/domain/ports/repository.port';
import { BaseSqlRepository } from '../../../../libs/infrastructure/base.sql.repository';
import { ObjectLiteral } from '../../../../libs/types/base.types';
import { CharacterEntity } from '../entities/character.entity';

export interface FindQueryParams<DbModel = unknown> extends PaginatedQueryParams<keyof DbModel> {
  episodesIds?: string[];
}

export abstract class CharactersRepository<DbModel extends ObjectLiteral = never> extends BaseSqlRepository<
  CharacterEntity,
  DbModel
> {
  abstract findPaginated(params: Partial<FindQueryParams<DbModel>>): Promise<Paginated<CharacterEntity>>;

  abstract findOneByName(name: string): Promise<CharacterEntity | null>;

  abstract update(entity: CharacterEntity): Promise<void>;
}
