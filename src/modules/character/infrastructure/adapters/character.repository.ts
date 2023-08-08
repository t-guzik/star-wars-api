import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectPool } from 'nestjs-slonik';
import { DatabasePool, sql } from 'slonik';
import { z } from 'zod';
import { BaseSqlRepository } from '../../../../libs/database/base.sql.repository';
import { Paginated } from '../../../../libs/domain/ports/repository.port';
import { SqlQueryBuilder } from '../../../../libs/infrastructure/sql-query-builder';
import { CharacterEntity } from '../../domain/entities/character.entity';
import { CharacterRepository, FindQueryParams } from '../../domain/ports/character.repository';
import { CharacterMapper } from '../character.mapper';

export const characterSchema = z.object({
  id: z.string().uuid(),
  created_at: z.preprocess((val: any) => new Date(val), z.date()).transform(date => date.toISOString()),
  updated_at: z.preprocess((val: any) => new Date(val), z.date()).transform(date => date.toISOString()),
  name: z.string().min(1).max(256),
  planet: z.string().min(1).max(256).nullable(),
  episodes_ids: z
    .preprocess((val: any) => (typeof val === 'string' ? JSON.parse(val) : val), z.array(z.string()))
    .transform(arr => JSON.stringify(arr)),
  count: z.number().optional(),
});

export type CharacterModel = Omit<z.TypeOf<typeof characterSchema>, 'count'>;

@Injectable()
export class CharacterRepositoryAdapter
  extends BaseSqlRepository<CharacterEntity, CharacterModel>
  implements CharacterRepository<CharacterModel>
{
  readonly tableName = 'characters';
  readonly schemaName = 'star_wars';
  readonly primaryKeys = ['id'];
  readonly validationSchema = characterSchema;
  readonly dataTypes: Record<keyof CharacterModel, string> = {
    id: 'text',
    created_at: 'timestamp',
    updated_at: 'timestamp',
    name: 'text',
    planet: 'text',
    episodes_ids: 'jsonb',
  };

  constructor(
    @InjectPool() readonly _pool: DatabasePool,
    protected readonly mapper: CharacterMapper,
    protected readonly eventEmitter: EventEmitter2,
  ) {
    super(_pool, mapper, eventEmitter, new Logger('CharacterRepository'));
  }

  async findPaginated(params: FindQueryParams<CharacterModel>): Promise<Paginated<CharacterEntity>> {
    const query = new SqlQueryBuilder(this.schemaName, this.tableName, this.validationSchema);

    if (params.episodesIds) {
      query.where(sql.type(this.validationSchema)`episodes_ids @> ${sql.jsonb(params.episodesIds)}`);
    }

    if (params.limit) {
      query.paginate({ limit: params.limit });
    }

    if (params.offset) {
      query.paginate({ offset: params.offset });
    }

    if (params.orderBy) {
      query.paginate({
        orderBy: {
          field: params.orderBy.field as never,
          param: params.orderBy.param,
        },
      });
    } else {
      query.paginate({
        orderBy: {
          field: 'created_at' as never,
          param: 'desc',
        },
      });
    }

    const { rows } = await this.pool.query(query.build());
    const entities = rows.map(row => this.mapper.toDomain(row as CharacterModel));

    return new Paginated<CharacterEntity>({
      items: entities,
      offset: params.offset,
      limit: params.limit,
      totalCount: rows?.[0]?.count ?? 0,
    });
  }

  async find(params: Pick<FindQueryParams<CharacterModel>, 'episodesIds'>): Promise<CharacterEntity[]> {
    const query = new SqlQueryBuilder(this.schemaName, this.tableName, this.validationSchema);

    if (params.episodesIds) {
      query.where(sql.type(this.validationSchema)`episodes_ids @> ${sql.jsonb(params.episodesIds)}`);
    }

    const { rows } = await this.pool.query(query.build(false));

    return rows.map(row => this.mapper.toDomain(row as CharacterModel));
  }

  async findOneByName(name: string): Promise<CharacterEntity | null> {
    const query = sql.type(this.validationSchema)`SELECT * FROM ${sql.identifier([
      this.schemaName,
      this.tableName,
    ])} WHERE name = ${name}`;

    const result = await this.pool.query(query);

    return result.rows[0] ? this.mapper.toDomain(result.rows[0]) : null;
  }

  async update(entity: CharacterEntity): Promise<void> {
    const {name, planet, episodes_ids, updated_at} = this.mapper.toPersistence(entity);
    const statement = sql.type(this.validationSchema)`
    UPDATE ${sql.identifier([this.schemaName, this.tableName])} SET
    name = ${name}, planet = ${planet}, episodes_ids = ${episodes_ids}, updated_at = ${updated_at}
    WHERE id = ${entity.id}`;

    await this.writeQuery(statement, entity);
  }
}
