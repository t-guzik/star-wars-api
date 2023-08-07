import { sql } from 'slonik';
import { SqlSqlToken } from 'slonik/src/types';

import type { PaginatedQueryParams } from '../domain/ports/repository.port';
import { ZodObject } from 'zod';

export class SqlQueryBuilder<DbModel> {
  protected readonly schemaName: string;
  protected readonly tableName: string;
  protected readonly schema: ZodObject<any>;

  protected filters: SqlSqlToken[];
  protected pagination: Partial<PaginatedQueryParams<keyof DbModel>>;

  constructor(schemaName: string, tableName: string, schema: ZodObject<any>) {
    this.schemaName = schemaName;
    this.tableName = tableName;
    this.schema = schema;
    this.filters = [];
    this.pagination = {};
  }

  where(condition: SqlSqlToken) {
    this.filters.push(condition);

    return this;
  }

  paginate(pagination: Partial<PaginatedQueryParams<keyof DbModel>>) {
    this.pagination = {...this.pagination, ...pagination};

    return this;
  }

  build(withCount = true) {
    let filters;
    let limit;
    let offset;
    let order;

    if (this.filters.length) {
      filters = sql.type(this.schema)`WHERE ${sql.join(this.filters, sql` AND `)}`;
    }

    if (this.pagination.orderBy!=undefined) {
      order =
        this.pagination.orderBy.param==='asc'
          ? sql.type(this.schema)`ORDER BY ${sql.identifier([this.pagination.orderBy.field as string])} ASC`
          :sql.type(this.schema)`ORDER BY ${sql.identifier([this.pagination.orderBy.field as string])} DESC`;
    }

    if (this.pagination.limit!=undefined) {
      limit = sql`LIMIT ${this.pagination.limit}`;
    }

    if (this.pagination.offset!=undefined) {
      offset = sql`OFFSET ${this.pagination.offset}`;
    }

    if (withCount) {
      return sql.type(this.schema)`WITH filtered as (SELECT * FROM ${sql.identifier([
        this.schemaName,
        this.tableName,
      ])} ${filters || sql``}),
count AS (SELECT count(*) as count FROM filtered)
SELECT *, CAST((SELECT count FROM count) AS integer) AS count
FROM filtered
${order || sql``}
${limit || sql``}
${offset || sql``};`;
    }

    return sql.type(this.schema)`
SELECT *
FROM ${sql.identifier([this.schemaName, this.tableName])}
${filters || sql``}
${order || sql``}
${limit || sql``}
${offset || sql``};`;
  }
}
