import { Module } from '@nestjs/common';
import { CardAccountService } from './card-account.service';
import { CardAccountController } from './card-account.controller';
import { CardAccountResolver } from './card-account.resolver';
import { PrismaModule } from '@prisma-client/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [CardAccountController],
    providers: [CardAccountService, CardAccountResolver],
    exports: [CardAccountService],
})
export class CardAccountModule {}
