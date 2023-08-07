import { Inject, Logger, ShutdownSignal } from '@nestjs/common';
import { createTerminus } from '@godaddy/terminus';
import { HttpServer } from '@nestjs/common/interfaces/http/http-server.interface';
import { InjectPool } from 'nestjs-slonik';
import { DatabasePool } from 'slonik';
import { ServerConfig, ServerConfigInterface } from '../../config/namespaces/server.config';

export class GracefulShutdown {
  private readonly logger = new Logger(GracefulShutdown.name);

  constructor(
    @InjectPool() private readonly pool: DatabasePool,
    @Inject(ServerConfig.KEY) private readonly serverConfig: ServerConfigInterface,
  ) {
  }

  public create(server: HttpServer) {
    createTerminus(server, {
      signals: [ShutdownSignal.SIGINT, ShutdownSignal.SIGTERM],
      onSignal: async () => {
        this.logger.log('Server is starting cleanup...');
        if (this.pool.getPoolState().activeConnectionCount > 0) {
          this.logger.log('Closing database connection...');

          return this.pool.end();
        }
      },
      onShutdown: async () => {
        this.logger.log('Cleanup finished, server is shutting down...');
      },
      logger: (msg: string, err: Error) => {
        if (err) {
          this.logger.error(err.message, err.stack);
        } else {
          this.logger.log(msg);
        }
      },
      timeout: +this.serverConfig.gracefulShutdownTimeoutMs,
    });
  }
}
