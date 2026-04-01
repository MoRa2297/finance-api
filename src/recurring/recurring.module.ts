import { Module } from '@nestjs/common';
import { RecurringService } from './recurring.service';
import { RecurringController } from './recurring.controller';
import { RecurringResolver } from './recurring.resolver';
import { PrismaModule } from '@prisma-client/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RecurringController],
  providers: [RecurringService, RecurringResolver],
  exports: [RecurringService],
})
export class RecurringModule {}
