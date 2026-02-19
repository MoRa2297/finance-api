import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryResolver } from './category.resolver';
import { PrismaModule } from '@prisma-client/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [CategoryController],
    providers: [CategoryService, CategoryResolver],
    exports: [CategoryService],
})
export class CategoryModule {}
