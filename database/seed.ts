import { SqlSqlToken } from 'slonik/src/types';
import { getMigrator } from './getMigrator';
import { seeds } from './seeds';

export const seed = async (query: SqlSqlToken) => {
  console.log(`Executing seeds migrations...`);

  const {pool, migrator} = await getMigrator();
  await migrator.up();
  await pool.query(query);

  console.log(`Seed migrations executed`);
};

async function runAll() {
  await Promise.all(seeds.map(query => seed(query)))

  console.log('done');
}

runAll();
