import { Module } from '@nestjs/common';
import { RecurringService } from './recurring.service';
import { RecurringController } from './recurring.controller';
import { RecurringResolver } from './recurring.resolver';
import { PrismaModule } from '@prisma-client/prisma.module';
import { TransactionCoreModule } from '../transaction-core/transaction-core.module';

@Module({
  imports: [PrismaModule, TransactionCoreModule],
  controllers: [RecurringController],
  providers: [RecurringService, RecurringResolver],
  exports: [RecurringService],
})
export class RecurringModule {}
