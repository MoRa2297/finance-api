import { Module } from '@nestjs/common';
import { TransactionCoreService } from './transaction-core.service';
import { PrismaModule } from '@prisma-client/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TransactionCoreService],
  exports: [TransactionCoreService],
})
export class TransactionCoreModule {}
