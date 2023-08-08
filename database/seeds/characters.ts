import { sql } from 'slonik';
import { SqlSqlToken } from 'slonik/src/types';
import { v4 } from 'uuid';
import { BaseSqlRepository } from '../../src/libs/database/base.sql.repository';
import { episodes } from './episodes';

const episodeId = {
  NEWHOPE: episodes[0].id,
  EMPIRE: episodes[1].id,
  JEDI: episodes[2].id,
};

const characters: { id: string; name: string; episodes_ids: string; planet: string | null }[] = [
  {
    id: v4(),
    name: 'Luke Skywalker',
    episodes_ids: JSON.stringify([episodeId.NEWHOPE, episodeId.EMPIRE, episodeId.JEDI]),
    planet: null,
  },
  {
    id: v4(),
    name: 'Darth Vader',
    episodes_ids: JSON.stringify([episodeId.NEWHOPE, episodeId.EMPIRE, episodeId.JEDI]),
    planet: null,
  },
  {
    id: v4(),
    name: 'Han Solo',
    episodes_ids: JSON.stringify([episodeId.NEWHOPE, episodeId.EMPIRE, episodeId.JEDI]),
    planet: null,
  },
  {
    id: v4(),
    name: 'Leia Organa',
    episodes_ids: JSON.stringify([episodeId.NEWHOPE, episodeId.EMPIRE, episodeId.JEDI]),
    planet: 'Alderaan',
  },
  {
    id: v4(),
    name: 'Wilhuff Tarkin',
    episodes_ids: JSON.stringify([episodeId.NEWHOPE]),
    planet: null,
  },
  {
    id: v4(),
    name: 'C-3PO',
    episodes_ids: JSON.stringify([episodeId.NEWHOPE, episodeId.EMPIRE, episodeId.JEDI]),
    planet: null,
  },
  {
    id: v4(),
    name: 'R2-D2',
    episodes_ids: JSON.stringify([episodeId.NEWHOPE, episodeId.EMPIRE, episodeId.JEDI]),
    planet: null,
  },
];

const {propertiesNames, recordsValues} = BaseSqlRepository.generateRecordsValues(characters);

export const charactersSeed: SqlSqlToken = sql`
    INSERT INTO "star_wars"."characters" (${sql.join(propertiesNames, sql`, `)}) SELECT * FROM ${sql.unnest(
        recordsValues,
        ['text', 'text', 'jsonb', 'text'],
)}
    ON CONFLICT (id)
    DO NOTHING;`;
