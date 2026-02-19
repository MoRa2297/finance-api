import { Module } from '@nestjs/common';
import { LookupService } from './lookup.service';
import { LookupController } from './lookup.controller';
import { LookupResolver } from './lookup.resolver';
import { PrismaModule } from '@prisma-client/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [LookupController],
    providers: [LookupService, LookupResolver],
    exports: [LookupService],
})
export class LookupModule {}
