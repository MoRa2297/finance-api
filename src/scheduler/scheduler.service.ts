import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '@prisma-client/prisma.service';
import { RecurringService } from '@recurring/recurring.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly recurringService: RecurringService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async generateRecurringTransactions(): Promise<void> {
    this.logger.log('Starting recurring transactions generation...');

    const users = await this.prisma.user.findMany({
      where: {
        recurringRule: {
          some: { isActive: true },
        },
      },
      select: { id: true },
    });

    if (users.length === 0) {
      this.logger.log('No users with active recurring rules found.');
      return;
    }

    let totalGenerated = 0;

    for (const user of users) {
      try {
        const result = await this.recurringService.generateDueTransactions(
          user.id,
        );
        totalGenerated += result.generated;
        this.logger.log(
          `User ${user.id}: ${result.generated} transaction(s) generated`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to generate transactions for user ${user.id}`,
          error,
        );
      }
    }

    this.logger.log(
      `Generation complete. Total transactions created: ${totalGenerated}`,
    );
  }
}
