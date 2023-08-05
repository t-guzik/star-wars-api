import { Injectable, Logger } from '@nestjs/common';
import { InjectPool } from 'nestjs-slonik';
import { DatabasePool } from 'slonik';
import { Paginated } from '../../../../libs/domain/ports/repository.port';
import { SqlQueryBuilder } from '../../../../libs/infrastructure/sql-query-builder';
import { CharacterEntity } from '../../domain/entities/character.entity';
import { CharactersRepository, FindQueryParams } from '../../domain/ports/characters.repository';

export type CharacterModel = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  planet?: string;
};

@Injectable()
export class CharacterRepositoryAdapter extends CharactersRepository<CharacterModel> {
  readonly tableName = 'star_wars.characters';
  readonly primaryKeys = ['id'];
  readonly dataTypes: Record<keyof CharacterModel, string> = {
    id: 'text',
    created_at: 'timestamp',
    updated_at: 'timestamp',
    name: 'text',
    planet: 'text',
  };

  constructor(
    @InjectPool() pool: DatabasePool,
    protected readonly mapper:,
  ) {
    super(mapper, pool, new Logger('CharacterRepository'));
  }

  async find(params: FindQueryParams<CharacterModel>): Promise<Paginated<CharacterEntity>> {
    const query = new SqlQueryBuilder(this.tableName);

    if (params.limit) {
      query.paginate({limit: params.limit});
    }

    if (params.offset) {
      query.paginate({offset: params.offset});
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
          param: 'asc',
        },
      });
    }

    const {rows} = await this.pool.query(query.build());

    return rows.map(row => this.mapper.toDomain(row));
  }
}
