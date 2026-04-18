import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { PrismaModule } from '@prisma-client/prisma.module';
import { RecurringModule } from '@recurring/recurring.module';

@Module({
  imports: [PrismaModule, RecurringModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
