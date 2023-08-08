import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { InjectPool } from 'nestjs-slonik';
import { DatabasePool, sql } from 'slonik';

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
    try {
      await this.pool.query(sql`SELECT datname FROM pg_database;`);

      return this.getStatus(key, true);
    } catch (error) {
      throw new HealthCheckError('Postgres check failed', this.getStatus(key, false));
    }
  }
}
