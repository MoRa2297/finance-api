import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@prisma-client/prisma.service';
import { CreateTransactionDto, UpdateTransactionDto, FilterTransactionDto } from './dto';

@Injectable()
export class TransactionService {
    constructor(private readonly prisma: PrismaService) {}

    async getTransactions(userId: number, filters: FilterTransactionDto) {
        const { month, year, categoryId, type, bankAccountId, cardAccountId } = filters;
        const page = filters.page ?? 1;
        const limit = filters.limit ?? 20;
        const skip = (page - 1) * limit;

        // Costruisci il where dinamicamente
        const where: any = { userId };

        if (type) where.type = type;
        if (categoryId) where.categoryId = categoryId;
        if (bankAccountId) where.bankAccountId = bankAccountId;
        if (cardAccountId) where.cardAccountId = cardAccountId;

        // Filtro per mese/anno
        if (month && year) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);
            where.date = { gte: startDate, lte: endDate };
        } else if (year) {
            const startDate = new Date(year, 0, 1);
            const endDate = new Date(year, 11, 31);
            where.date = { gte: startDate, lte: endDate };
        }

        const [transactions, total] = await Promise.all([
            this.prisma.transaction.findMany({
                where,
                orderBy: { date: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.transaction.count({ where }),
        ]);

        return {
            data: transactions,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async getTransaction(id: number, userId: number) {
        const transaction = await this.findTransactionOrThrow(id);
        this.checkOwnership(transaction.userId, userId);
        return transaction;
    }

    async createTransaction(userId: number, dto: CreateTransactionDto) {
        await this.verifyCategoryOwnership(dto.categoryId, userId);

        if (dto.bankAccountId) {
            await this.verifyBankAccountOwnership(dto.bankAccountId, userId);
        }

        if (dto.cardAccountId) {
            await this.verifyCardAccountOwnership(dto.cardAccountId, userId);
        }

        return this.prisma.transaction.create({
            data: {
                money: dto.money,
                recived: dto.recived,
                date: new Date(dto.date),
                description: dto.description,
                recurrent: dto.recurrent,
                repeat: dto.repeat,
                note: dto.note,
                type: dto.type,
                userId,
                categoryId: dto.categoryId,
                bankAccountId: dto.bankAccountId,
                cardAccountId: dto.cardAccountId,
            },
        });
    }

    async updateTransaction(id: number, userId: number, dto: UpdateTransactionDto) {
        const transaction = await this.findTransactionOrThrow(id);
        this.checkOwnership(transaction.userId, userId);

        if (dto.categoryId) {
            await this.verifyCategoryOwnership(dto.categoryId, userId);
        }

        if (dto.bankAccountId) {
            await this.verifyBankAccountOwnership(dto.bankAccountId, userId);
        }

        if (dto.cardAccountId) {
            await this.verifyCardAccountOwnership(dto.cardAccountId, userId);
        }

        return this.prisma.transaction.update({
            where: { id },
            data: {
                ...dto,
                date: dto.date ? new Date(dto.date) : undefined,
                updateDate: new Date(),
            },
        });
    }

    async deleteTransaction(id: number, userId: number) {
        const transaction = await this.findTransactionOrThrow(id);
        this.checkOwnership(transaction.userId, userId);

        await this.prisma.transaction.delete({ where: { id } });

        return { message: 'Transaction deleted successfully' };
    }

    private async findTransactionOrThrow(id: number) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id },
        });

        if (!transaction) {
            throw new NotFoundException(`Transaction with id ${id} not found`);
        }

        return transaction;
    }

    private checkOwnership(resourceUserId: number | null | undefined, requestUserId: number) {
        if (resourceUserId !== requestUserId) {
            throw new ForbiddenException('You do not have access to this resource');
        }
    }

    private async verifyCategoryOwnership(categoryId: number, userId: number) {
        const category = await this.prisma.category.findUnique({
            where: { id: categoryId },
        });

        if (!category) {
            throw new NotFoundException(`Category with id ${categoryId} not found`);
        }

        if (category.userId !== userId) {
            throw new ForbiddenException('You do not have access to this category');
        }
    }

    private async verifyBankAccountOwnership(bankAccountId: number, userId: number) {
        const account = await this.prisma.bankAccount.findUnique({
            where: { id: bankAccountId },
        });

        if (!account) {
            throw new NotFoundException(`Bank account with id ${bankAccountId} not found`);
        }

        if (account.userId !== userId) {
            throw new ForbiddenException('You do not have access to this bank account');
        }
    }

    private async verifyCardAccountOwnership(cardAccountId: number, userId: number) {
        const card = await this.prisma.cardAccount.findUnique({
            where: { id: cardAccountId },
        });

        if (!card) {
            throw new NotFoundException(`Card with id ${cardAccountId} not found`);
        }

        if (card.userId !== userId) {
            throw new ForbiddenException('You do not have access to this card');
        }
    }
}
