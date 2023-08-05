import { Paginated, PaginatedQueryParams } from '../../../../libs/domain/ports/repository.port';
import { BaseSqlRepository } from '../../../../libs/infrastructure/base.sql.repository';
import { ObjectLiteral } from '../../../../libs/types/object-literal.type';
import { CharacterEntity } from '../entities/character.entity';

export interface FindQueryParams<DbModel = unknown>
  extends PaginatedQueryParams<keyof DbModel> {
  episode?: string;
}

export abstract class CharactersRepository<
  DbModel extends ObjectLiteral,
> extends BaseSqlRepository<CharacterEntity, DbModel> {
  abstract findPaginated(
    params: Partial<FindQueryParams<DbModel>>,
  ): Promise<Paginated<CharacterEntity>>;
}
