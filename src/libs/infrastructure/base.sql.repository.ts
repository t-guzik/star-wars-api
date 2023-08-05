import type {
  DatabasePool,
  IdentifierSqlToken,
  PrimitiveValueExpression,
} from 'slonik';
import { sql } from 'slonik';
import { RequestContextService } from '../application/context/AppRequestContext';

import type { Mapper } from './mapper.interface';
import { ObjectLiteral } from '../types/object-literal.type';
import type { EntityBase } from '../domain/entity.base';
import type { LoggerPort } from '../domain/ports/logger.port';
import type { RepositoryPort, RepositoryPortConfig } from '../domain/ports/repository.port';

export abstract class BaseSqlRepository<
  Entity extends EntityBase<unknown>,
  DbModel extends ObjectLiteral,
> implements RepositoryPortConfig<DbModel>,
  Pick<RepositoryPort<Entity>, 'save' | 'findOneById' | 'delete'> {
  abstract readonly tableName: string;
  abstract readonly primaryKeys: string[];
  abstract readonly dataTypes: Record<keyof DbModel, string>;

  protected constructor(
    protected readonly mapper: Mapper<Entity, DbModel>,
    protected readonly pool: DatabasePool,
    protected readonly logger: LoggerPort,
  ) {
  }

  async save(entity: Entity | Entity[]): Promise<void> {
    const entities = Array.isArray(entity) ? entity:[entity];
    entities.forEach((entity) => entity.validate());

    const records = entities.map(this.mapper.toPersistence);
    const {propertiesNames, recordsValues} =
      BaseSqlRepository.generateRecordsValues(records);

    this.logger.debug(
      `[${RequestContextService.getRequestId()}] writing ${
        entities.length
      } entities to "${this.tableName}" table: ${entities.map(({id}) => id).join(', ')}`,
    );

    const query = sql.unsafe`INSERT INTO ${sql.fragment([
        this.tableName,
    ])} (${sql.join(
            propertiesNames,
            sql.fragment`, `,
    )}) SELECT * FROM ${sql.unnest(
            recordsValues,
            propertiesNames.map((name) => this.dataTypes[name.names[0]]),
    )}
    ON CONFLICT (${sql.fragment([this.primaryKeys.join(', ')])})
    DO NOTHING;
`;

    await this.pool.query(query);
  }

  async delete(entity: Entity | Entity[]): Promise<boolean> {
    if (!Array.isArray(entity)) {
      entity.validate();
      const query = sql.unsafe`DELETE FROM ${sql.fragment([
          this.tableName,
      ])} WHERE id = ${entity.id}`;

      this.logger.debug(
        `[${RequestContextService.getRequestId()}] deleting entities ${
          entity.id
        } from ${this.tableName}`,
      );

      const result = await this.pool.query(query);

      return result.rowCount > 0;
    }

    const ids = entity.map((entity) => entity.id);

    if (ids.length===0) {
      return false;
    }

    this.logger.debug(
      `[${RequestContextService.getRequestId()}] deleting entities ${
        ids.join(', ')
      } from ${this.tableName}`,
    );

    const result = await this.pool.query(
      sql.unsafe`
        DELETE FROM ${sql.fragment([this.tableName])}
        WHERE id IN (${sql.join(ids, sql.fragment`, `)})
      `,
    );

    return result.rowCount > 0;
  }

  async findOneById(id: string): Promise<Entity | null> {
    const query = sql.unsafe`SELECT * FROM ${sql.fragment([
        this.tableName,
    ])} WHERE id = ${id}`;

    const result = await this.pool.query(query);

    return result.rows[0] ? this.mapper.toDomain(result.rows[0]):null;
  }

  static generateRecordsValues<DbModel extends ObjectLiteral>(
    records: DbModel[],
  ) {
    const recordsEntries = records.map((record) => Object.entries(record));
    const recordsValues: PrimitiveValueExpression[][] = [];
    const propertiesNames: IdentifierSqlToken[] = [];

    recordsEntries.forEach((recordEntries, index) => {
      recordEntries.forEach((entry) => {
        if (index===0) {
          propertiesNames.push(sql.identifier([entry[0]]));
        }

        if (entry[0] && entry[1]!==undefined) {
          if (!Array.isArray(recordsValues[index])) {
            recordsValues[index] = [];
          }

          recordsValues[index].push(entry[1] as PrimitiveValueExpression);
        }
      });
    });

    return {propertiesNames, recordsValues};
  }
}
