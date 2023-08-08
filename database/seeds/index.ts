import { SqlSqlToken } from 'slonik/src/types';
import { charactersSeed } from './characters';
import { episodesSeed } from './episodes';

export const seeds: { token: SqlSqlToken; name: string }[] = [
  {
    name: 'episodes',
    token: episodesSeed,
  },
  {
    name: 'characters',
    token: charactersSeed,
  },
];
