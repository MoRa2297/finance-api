import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@prisma-client/prisma.service';
import {
  CreateTransactionDto,
  CreateTransferDto,
  UpdateTransactionDto,
  FilterTransactionDto,
} from './dto';
import { TransactionType } from '@prisma/client';
import { RecurringService } from '../recurring/recurring.service';

const TRANSACTION_INCLUDE = {
  category: {
    include: {
      categoryIcon: true,
      categoryColor: true,
    },
  },
  bankAccount: {
    include: {
      bankType: true,
    },
  },
  card: true,
  transferFrom: {
    include: {
      fromAccount: true,
      toAccount: true,
    },
  },
  transferTo: {
    include: {
      fromAccount: true,
      toAccount: true,
    },
  },
};

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async getTransactions(userId: number, filters: FilterTransactionDto) {
    const { month, year, categoryId, type, bankAccountId, cardAccountId } =
      filters;
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = { userId };

    if (type) where.type = type;
    if (categoryId) where.categoryId = categoryId;
    if (bankAccountId) where.bankAccountId = bankAccountId;
    if (cardAccountId) where.cardAccountId = cardAccountId;

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
        include: TRANSACTION_INCLUDE,
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
    if (dto.type === TransactionType.TRANSFER) {
      throw new BadRequestException(
        'Use POST /transactions/transfer to create a transfer',
      );
    }

    if (dto.categoryId) {
      await this.verifyCategoryOwnership(dto.categoryId, userId);
    }
    if (dto.bankAccountId) {
      await this.verifyBankAccountOwnership(dto.bankAccountId, userId);
    }
    if (dto.cardAccountId) {
      await this.verifyCardAccountOwnership(dto.cardAccountId, userId);
    }

    // Se recurrent, crea la RecurringRule e collega la transazione
    if (dto.recurrent) {
      if (!dto.frequency) {
        throw new BadRequestException(
          'frequency is required when recurrent is true',
        );
      }

      const rule = await this.recurringService.createRecurringRule(userId, {
        description: dto.description,
        amount: dto.money,
        type: dto.type === TransactionType.INCOME ? 'INCOME' : 'EXPENSE',
        frequency: dto.frequency,
        startDate: dto.date,
        endDate: dto.recurrenceEndDate,
        note: dto.note,
        categoryId: dto.categoryId!,
        bankAccountId: dto.bankAccountId,
        cardAccountId: dto.cardAccountId,
      });

      return this.prisma.transaction.create({
        data: {
          money: dto.money,
          date: new Date(dto.date),
          description: dto.description,
          recurrent: true,
          note: dto.note,
          type: dto.type,
          userId,
          categoryId: dto.categoryId,
          bankAccountId: dto.bankAccountId,
          cardAccountId: dto.cardAccountId,
          recurringRuleId: rule.id,
        },
        include: TRANSACTION_INCLUDE,
      });
    }

    return this.prisma.transaction.create({
      data: {
        money: dto.money,
        date: new Date(dto.date),
        description: dto.description,
        recurrent: false,
        note: dto.note,
        type: dto.type,
        userId,
        categoryId: dto.categoryId,
        bankAccountId: dto.bankAccountId,
        cardAccountId: dto.cardAccountId,
      },
      include: TRANSACTION_INCLUDE,
    });
  }

  async createTransfer(userId: number, dto: CreateTransferDto) {
    if (dto.fromAccountId === dto.toAccountId) {
      throw new BadRequestException(
        'Source and destination accounts must be different',
      );
    }

    await this.verifyBankAccountOwnership(dto.fromAccountId, userId);
    await this.verifyBankAccountOwnership(dto.toAccountId, userId);

    const date = new Date(dto.date);
    const note = dto.note ?? '';

    return this.prisma.$transaction(async (tx) => {
      const fromTransaction = await tx.transaction.create({
        data: {
          money: dto.money,
          date,
          description: dto.description,
          note,
          recurrent: false,
          type: TransactionType.TRANSFER,
          userId,
          bankAccountId: dto.fromAccountId,
        },
      });

      const toTransaction = await tx.transaction.create({
        data: {
          money: dto.money,
          date,
          description: dto.description,
          note,
          recurrent: false,
          type: TransactionType.TRANSFER,
          userId,
          bankAccountId: dto.toAccountId,
        },
      });

      const transferDetail = await tx.transferDetail.create({
        data: {
          fromTransactionId: fromTransaction.id,
          toTransactionId: toTransaction.id,
          fromAccountId: dto.fromAccountId,
          toAccountId: dto.toAccountId,
        },
        include: {
          fromTransaction: true,
          toTransaction: true,
          fromAccount: true,
          toAccount: true,
        },
      });

      return transferDetail;
    });
  }

  async updateTransaction(
    id: number,
    userId: number,
    dto: UpdateTransactionDto,
  ) {
    const transaction = await this.findTransactionOrThrow(id);
    this.checkOwnership(transaction.userId, userId);

    if (transaction.type === TransactionType.TRANSFER) {
      throw new BadRequestException(
        'Transfer transactions cannot be updated directly. Delete and recreate the transfer.',
      );
    }

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
      include: TRANSACTION_INCLUDE,
    });
  }

  async deleteTransaction(id: number, userId: number) {
    const transaction = await this.findTransactionOrThrow(id);
    this.checkOwnership(transaction.userId, userId);

    // Se è un trasferimento, elimina entrambe le transazioni collegate
    if (transaction.type === TransactionType.TRANSFER) {
      return this.deleteTransfer(transaction, userId);
    }

    await this.prisma.transaction.delete({ where: { id } });
    return { message: 'Transaction deleted successfully' };
  }

  private async deleteTransfer(
    transaction: Awaited<ReturnType<typeof this.findTransactionOrThrow>>,
    userId: number,
  ) {
    // Trova il TransferDetail collegato (può essere fromTransaction o toTransaction)
    const transferDetail = await this.prisma.transferDetail.findFirst({
      where: {
        OR: [
          { fromTransactionId: transaction.id },
          { toTransactionId: transaction.id },
        ],
      },
    });

    if (!transferDetail) {
      // Caso anomalo: transazione TRANSFER senza detail — elimina solo questa
      await this.prisma.transaction.delete({ where: { id: transaction.id } });
      return { message: 'Transaction deleted successfully' };
    }

    // Verifica ownership dell'altra transazione
    const otherTransactionId =
      transferDetail.fromTransactionId === transaction.id
        ? transferDetail.toTransactionId
        : transferDetail.fromTransactionId;

    const otherTransaction = await this.prisma.transaction.findUnique({
      where: { id: otherTransactionId },
    });

    if (otherTransaction) {
      this.checkOwnership(otherTransaction.userId, userId);
    }

    // Elimina in cascata: TransferDetail → entrambe le Transaction
    // onDelete: Cascade sul TransferDetail gestisce il detail,
    // ma le Transaction vanno eliminate esplicitamente
    await this.prisma.$transaction([
      this.prisma.transferDetail.delete({ where: { id: transferDetail.id } }),
      this.prisma.transaction.delete({ where: { id: transaction.id } }),
      ...(otherTransaction
        ? [
            this.prisma.transaction.delete({
              where: { id: otherTransactionId },
            }),
          ]
        : []),
    ]);

    return { message: 'Transfer deleted successfully' };
  }

  private async findTransactionOrThrow(id: number) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: TRANSACTION_INCLUDE,
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }

    return transaction;
  }

  private checkOwnership(
    resourceUserId: number | null | undefined,
    requestUserId: number,
  ) {
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

  private async verifyBankAccountOwnership(
    bankAccountId: number,
    userId: number,
  ) {
    const account = await this.prisma.bankAccount.findUnique({
      where: { id: bankAccountId },
    });
    if (!account) {
      throw new NotFoundException(
        `Bank account with id ${bankAccountId} not found`,
      );
    }
    if (account.userId !== userId) {
      throw new ForbiddenException(
        'You do not have access to this bank account',
      );
    }
  }

  private async verifyCardAccountOwnership(
    cardAccountId: number,
    userId: number,
  ) {
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
