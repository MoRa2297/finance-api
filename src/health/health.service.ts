import {
  Injectable,
  ServiceUnavailableException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '@prisma-client/prisma.service';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(private readonly prisma: PrismaService) {}

  async checkReadiness() {
    const checks = {
      database: await this.checkDatabase(),
    };

    const allHealthy = Object.values(checks).every((c) => c.status === 'up');

    if (!allHealthy) {
      this.logger.warn(`Readiness check failed: ${JSON.stringify(checks)}`);
      throw new ServiceUnavailableException({
        status: 'error',
        timestamp: new Date().toISOString(),
        checks,
      });
    }

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      checks,
    };
  }

  private async checkDatabase(): Promise<{
    status: 'up' | 'down';
    latencyMs?: number;
    error?: string;
  }> {
    const start = Date.now();
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'up',
        latencyMs: Date.now() - start,
      };
    } catch (error) {
      return {
        status: 'down',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
