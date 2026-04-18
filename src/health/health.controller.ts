import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /**
   * Liveness probe — app is running.
   * Returns 200 even if the DB is down. Used by Railway to check
   * whether the container should be restarted.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Liveness probe' })
  @ApiResponse({ status: 200, description: 'App is alive' })
  liveness() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  /**
   * Readiness probe — app is ready to serve traffic.
   * Returns 503 if the DB is unreachable. Used by orchestrators
   * to decide whether to route traffic to this instance.
   */
  @Get('ready')
  @ApiOperation({ summary: 'Readiness probe (checks DB)' })
  @ApiResponse({ status: 200, description: 'App is ready' })
  @ApiResponse({ status: 503, description: 'Dependencies unavailable' })
  readiness() {
    return this.healthService.checkReadiness();
  }
}
