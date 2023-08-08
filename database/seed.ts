import { SqlSqlToken } from 'slonik/src/types';
import { getMigrator } from './getMigrator';
import { seeds } from './seeds';

export const seed = async (query: SqlSqlToken, name: string) => {
  console.log(`Executing ${name} seeds migration...`);

  const {pool, migrator} = await getMigrator();
  await migrator.up();
  await pool.query(query);

  console.log(`${name} seeds migration executed`);
};

async function runAll() {
  for (const {token, name} of seeds) {
    await seed(token, name)
  }

  console.log('Seed finished');
}

runAll();
