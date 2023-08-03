import { CorsConfigEnvironmentVariables } from '../../config/namespaces/cors.config';
import { LoggerConfigEnvironmentVariables } from '../../config/namespaces/logger.config';
import { PostgresDatabaseConfigEnvironmentVariables } from '../../config/namespaces/postgres-database.config';
import { ServerConfigEnvironmentVariables } from '../../config/namespaces/server.config';

declare global {
  namespace NodeJS {
    interface ProcessEnv
      extends CorsConfigEnvironmentVariables,
        LoggerConfigEnvironmentVariables,
        PostgresDatabaseConfigEnvironmentVariables,
        ServerConfigEnvironmentVariables {
      npm_package_version: string;
    }
  }
}

export {};
