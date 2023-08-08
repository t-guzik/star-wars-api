import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { InjectPool } from 'nestjs-slonik';
import { DatabasePool } from 'slonik';

export interface Postgres {
  name: string;
  type: string;
}

@Injectable()
export class PostgresHealthIndicator extends HealthIndicator {
  constructor(@InjectPool() private readonly pool: DatabasePool) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const { activeConnectionCount, idleConnectionCount } = this.pool.getPoolState();
    const isHealthy = !(activeConnectionCount === 0 && idleConnectionCount === 0);
    const result = this.getStatus(key, isHealthy);

    if (isHealthy) {
      return result;
    }

    throw new HealthCheckError('Postgres check failed', result);
  }
}
