import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TransactionResolver } from './transaction.resolver';
import { PrismaModule } from '@prisma-client/prisma.module';
import { RecurringModule } from '../recurring/recurring.module';

@Module({
  imports: [PrismaModule, RecurringModule],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionResolver],
  exports: [TransactionService],
})
export class TransactionModule {}
