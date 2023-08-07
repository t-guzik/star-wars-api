import type { EntityBase } from '../entity.base';

export class Paginated<T> {
  readonly totalCount: number;
  readonly limit: number;
  readonly offset: number;
  readonly items: readonly T[];

  constructor(props: Paginated<T>) {
    this.totalCount = props.totalCount;
    this.limit = props.limit;
    this.offset = props.offset;
    this.items = props.items;
  }
}

export type OrderBy<DbModelKey = string> = {
  field: DbModelKey;
  param: 'asc' | 'desc';
};

export type PaginatedQueryParams<DbModelKey = string> = {
  limit: number;
  offset: number;
  orderBy?: OrderBy<DbModelKey>;
};

export interface RepositoryPortConfig<DbModel extends Record<string, unknown>> {
  readonly tableName: string;
  readonly dataTypes: Record<keyof DbModel, string>;
}

export interface RepositoryPort<Entity extends EntityBase<unknown>> {
  save(entity: Entity | Entity[]): Promise<void>;

  findOneById(id: string): Promise<Entity | null>;

  delete(entity: Entity): Promise<boolean>;
}
