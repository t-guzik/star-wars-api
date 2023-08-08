import path from 'path';
import { config } from 'dotenv';

const envPath = path.resolve(__dirname, process.env.NODE_ENV === 'test' ? '../../.env.test' : '../../.env');
config({ path: envPath });
import { PostgresDatabaseConfig } from '../../src/config/namespaces/postgres-database.config';

module.exports = async (): Promise<void> => {
  const postgresDatabaseConfig = PostgresDatabaseConfig();
  if (!postgresDatabaseConfig.name.includes('test')) {
    throw new Error(
      `Current database name is: ${postgresDatabaseConfig.name}. Make sure database includes a word "test" as prefix or suffix, for example: "test_db" or "db_test" to avoid writing into a main database.`,
    );
  }
};
