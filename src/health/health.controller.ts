import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { SwaggerApiTags } from '../config/swagger';
import { PostgresHealthIndicator } from './postgres.health';

@ApiTags(SwaggerApiTags.App)
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly postgresHealthIndicator: PostgresHealthIndicator,
  ) {}

  @ApiOperation({ summary: 'API health check' })
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.postgresHealthIndicator.isHealthy('postgres')]);
  }
}
