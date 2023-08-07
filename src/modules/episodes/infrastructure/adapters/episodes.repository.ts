import { Injectable, Logger } from '@nestjs/common';
import { InjectPool } from 'nestjs-slonik';
import { DatabasePool, sql } from 'slonik';
import { z } from 'zod';
import { EpisodeEntity } from '../../domain/entities/episode.entity';
import { EpisodesRepository } from '../../domain/ports/episodes.repository';
import { EpisodeMapper } from '../mappers/episode.mapper';
import { SqlQueryBuilder } from 'src/libs/infrastructure/sql-query-builder';

export const episodeSchema = z.object({
  id: z.string().uuid(),
  created_at: z.preprocess((val: any) => new Date(val), z.date()).transform(date => date.toISOString()),
  updated_at: z.preprocess((val: any) => new Date(val), z.date()).transform(date => date.toISOString()),
  name: z.string().min(1).max(256),
});

export type EpisodeModel = z.TypeOf<typeof episodeSchema>;

@Injectable()
export class EpisodeRepositoryAdapter extends EpisodesRepository<EpisodeModel> {
  readonly tableName = 'episodes';
  readonly schemaName = 'star_wars';
  readonly primaryKeys = ['id'];
  readonly validationSchema = episodeSchema;
  readonly dataTypes: Record<keyof EpisodeModel, string> = {
    id: 'text',
    created_at: 'timestamp',
    updated_at: 'timestamp',
    name: 'text',
  };

  constructor(@InjectPool() readonly pool: DatabasePool, protected readonly mapper: EpisodeMapper) {
    super(mapper, pool, new Logger('EpisodeRepository'));
  }

  async findByIds(ids: string[]): Promise<EpisodeEntity[]> {
    const query = new SqlQueryBuilder(this.schemaName, this.tableName, this.validationSchema);

    query.where(sql.type(this.validationSchema)`id = ANY(${sql.array(ids, 'text')})`);

    const {rows} = await this.pool.query(query.build(false));

    return rows.map(row => this.mapper.toDomain(row as EpisodeModel));
  }

  async findOneByName(name: string): Promise<EpisodeEntity | null> {
    const query = sql.type(this.validationSchema)`SELECT * FROM ${sql.identifier([
        this.schemaName,
        this.tableName,
    ])} WHERE name = ${name}`;

    const result = await this.pool.query(query);

    return result.rows[0] ? this.mapper.toDomain(result.rows[0]):null;
  }
}
