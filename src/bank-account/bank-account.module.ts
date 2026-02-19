import { Module } from '@nestjs/common';
import { BankAccountService } from './bank-account.service';
import { BankAccountController } from './bank-account.controller';
import { BankAccountResolver } from './bank-account.resolver';
import { PrismaModule } from '@prisma-client/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [BankAccountController],
    providers: [BankAccountService, BankAccountResolver],
    exports: [BankAccountService],
})
export class BankAccountModule {}
