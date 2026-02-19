import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@prisma-client/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoryService {
    constructor(private readonly prisma: PrismaService) {}

    async getCategories(userId: number) {
        return this.prisma.category.findMany({
            where: { userId },
            orderBy: { createdDate: 'desc' },
        });
    }

    async getCategory(id: number, userId: number) {
        const category = await this.findCategoryOrThrow(id);
        this.checkOwnership(category.userId, userId);
        return category;
    }

    async createCategory(userId: number, dto: CreateCategoryDto) {
        return this.prisma.category.create({
            data: {
                name: dto.name,
                type: dto.type,
                userId,
                colorId: dto.colorId,
                iconId: dto.iconId,
            },
        });
    }

    async updateCategory(id: number, userId: number, dto: UpdateCategoryDto) {
        const category = await this.findCategoryOrThrow(id);
        this.checkOwnership(category.userId, userId);

        return this.prisma.category.update({
            where: { id },
            data: {
                ...dto,
                updateDate: new Date(),
            },
        });
    }

    async deleteCategory(id: number, userId: number) {
        const category = await this.findCategoryOrThrow(id);
        this.checkOwnership(category.userId, userId);

        await this.prisma.category.delete({ where: { id } });

        return { message: 'Category deleted successfully' };
    }

    private async findCategoryOrThrow(id: number) {
        const category = await this.prisma.category.findUnique({
            where: { id },
        });

        if (!category) {
            throw new NotFoundException(`Category with id ${id} not found`);
        }

        return category;
    }

    private checkOwnership(resourceUserId: number, requestUserId: number) {
        if (resourceUserId !== requestUserId) {
            throw new ForbiddenException('You do not have access to this resource');
        }
    }
}
