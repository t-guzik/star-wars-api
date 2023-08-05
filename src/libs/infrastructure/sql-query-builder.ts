import { sql } from 'slonik';

import type { PaginatedQueryParams } from '../domain/ports/repository.port';

export class SqlQueryBuilder<DbModel> {
  protected readonly tableName: string;

  protected filters: any[];
  protected pagination: Partial<PaginatedQueryParams<keyof DbModel>>;

  constructor(tableName: string) {
    this.tableName = tableName;
    this.filters = [];
    this.pagination = {};
  }

  /**
   * @param condition - should be sql.unsafe result
   */
  where(condition: any) {
    this.filters.push(condition);

    return this;
  }

  paginate(pagination: Partial<PaginatedQueryParams<keyof DbModel>>) {
    this.pagination = {...this.pagination, ...pagination};

    return this;
  }

  build() {
    let filters;
    let limit;
    let offset;
    let order;

    if (this.filters.length) {
      filters = sql.unsafe`WHERE ${sql.join(
        this.filters,
        sql.fragment` AND `,
      )}`;
    }

    if (this.pagination.orderBy!=undefined) {
      order = sql.unsafe`ORDER BY ${sql.fragment([
        this.pagination.orderBy.field as string,
      ])} ${sql.fragment([this.pagination.orderBy.param.toUpperCase()])}`;
    }

    if (this.pagination.limit!=undefined) {
      limit = sql.unsafe`LIMIT ${this.pagination.limit}`;
    }

    if (this.pagination.offset!=undefined) {
      offset = sql.unsafe`OFFSET ${this.pagination.offset}`;
    }

    return sql.unsafe`SELECT * FROM ${sql.fragment([this.tableName])}
${filters || sql.fragment``}
${order || sql.fragment``}
${limit || sql.fragment``}
${offset || sql.fragment``};`;
  }
}
