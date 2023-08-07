import type {
  OrderBy,
  PaginatedQueryParams,
} from '../domain/ports/repository.port';

export abstract class QueryBase {
}

export abstract class PaginatedQueryBase<DbModelKey = string>
  extends QueryBase
  implements PaginatedQueryParams<DbModelKey> {
  limit: number;
  offset: number;
  orderBy?: OrderBy<DbModelKey>;

  constructor(props: PaginatedParams<PaginatedQueryBase, DbModelKey>) {
    super();

    this.limit = props.limit || 20;
    this.offset = props.offset || 0;
    this.orderBy = props.orderBy;
  }
}

// Paginated query parameters
export type PaginatedParams<Props, DbModelKey = string> = Omit<
  Props,
  'limit' | 'offset' | 'orderBy'
> &
  PaginatedQueryParams<DbModelKey>;
