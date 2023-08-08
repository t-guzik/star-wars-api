import { sql } from 'slonik';
import { SqlSqlToken } from 'slonik/src/types';
import { v4 } from 'uuid';
import { BaseSqlRepository } from '../../src/libs/database/base.sql.repository';

export const episodes: { id: string; name: string }[] = [
  {
    id: v4(),
    name: 'NEWHOPE',
  },
  {
    id: v4(),
    name: 'EMPIRE',
  },
  {
    id: v4(),
    name: 'JEDI',
  },
];

const {propertiesNames, recordsValues} = BaseSqlRepository.generateRecordsValues(episodes);

export const episodesSeed: SqlSqlToken = sql`
    INSERT INTO "star_wars"."episodes" (${sql.join(propertiesNames, sql`, `)}) SELECT * FROM ${sql.unnest(
        recordsValues,
        ['text', 'text'],
)}
    ON CONFLICT (id)
    DO NOTHING;`;
