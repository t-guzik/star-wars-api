import { SlonikMigrator } from '@slonik/migrator';
import { createPool } from 'slonik';
import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(__dirname, process.env.NODE_ENV === 'test' ? '../.env.test' : '../.env');
dotenv.config({ path: envPath });

export async function getMigrator() {
  const { POSTGRES_HOST, POSTGRES_NAME, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_USERNAME } = process.env;

  const pool = await createPool(
    `postgres://${POSTGRES_USERNAME}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_NAME}`,
  );

  const migrator = new SlonikMigrator({
    migrationsPath: path.resolve(__dirname, 'migrations'),
    migrationTableName: 'migration',
    slonik: pool,
    logger: undefined,
  });

  return { pool, migrator };
}
