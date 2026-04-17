import { Injectable } from '@nestjs/common';
import { Prisma, TransactionType } from '@prisma/client';
import { PrismaService } from '@prisma-client/prisma.service';
import {
  ICreateTransaction,
  ICreateTransfer,
  IUpdateTransaction,
  IFindManyTransactions,
} from './interfaces';
import { TRANSACTION_INCLUDE, TransactionWithRelations } from './types';

@Injectable()
export class TransactionCoreService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(params: IFindManyTransactions) {
    const {
      userId,
      type,
      categoryId,
      bankAccountId,
      cardAccountId,
      month,
      year,
    } = params;
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.TransactionWhereInput = { userId };

    if (type) where.type = type;
    if (categoryId) where.categoryId = categoryId;
    if (bankAccountId) where.bankAccountId = bankAccountId;
    if (cardAccountId) where.cardAccountId = cardAccountId;

    if (month && year) {
      where.date = {
        gte: new Date(year, month - 1, 1),
        lte: new Date(year, month, 0),
      };
    } else if (year) {
      where.date = {
        gte: new Date(year, 0, 1),
        lte: new Date(year, 11, 31),
      };
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

  async findById(id: number): Promise<TransactionWithRelations | null> {
    return this.prisma.transaction.findUnique({
      where: { id },
      include: TRANSACTION_INCLUDE,
    });
  }

  async create(data: ICreateTransaction): Promise<TransactionWithRelations> {
    return this.prisma.transaction.create({
      data,
      include: TRANSACTION_INCLUDE,
    });
  }

  async createMany(data: ICreateTransaction[]): Promise<number> {
    const result = await this.prisma.transaction.createMany({ data });
    return result.count;
  }

  async createTransfer(
    data: ICreateTransfer,
  ): Promise<TransactionWithRelations> {
    return this.prisma.$transaction(async (tx) => {
      const transferDetail = await tx.transferDetail.create({
        data: {
          fromAccountId: data.fromAccountId,
          toAccountId: data.toAccountId,
        },
      });

      await tx.transaction.createMany({
        data: [
          {
            amount: data.amount,
            date: data.date,
            description: data.description,
            note: data.note,
            recurrent: false,
            type: TransactionType.TRANSFER,
            userId: data.userId,
            bankAccountId: data.fromAccountId,
            transferDetailId: transferDetail.id,
          },
          {
            amount: data.amount,
            date: data.date,
            description: data.description,
            note: data.note,
            recurrent: false,
            type: TransactionType.TRANSFER,
            userId: data.userId,
            bankAccountId: data.toAccountId,
            transferDetailId: transferDetail.id,
          },
        ],
      });

      const transaction = await tx.transaction.findFirst({
        where: { transferDetailId: transferDetail.id },
        include: TRANSACTION_INCLUDE,
      });

      if (!transaction) {
        throw new Error('Transfer creation failed');
      }

      return transaction;
    });
  }
  async update(
    id: number,
    data: IUpdateTransaction,
  ): Promise<TransactionWithRelations> {
    return this.prisma.transaction.update({
      where: { id },
      data: { ...data, updateDate: new Date() },
      include: TRANSACTION_INCLUDE,
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.transaction.delete({ where: { id } });
  }

  async deleteTransfer(transferDetailId: number): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.transaction.deleteMany({ where: { transferDetailId } }),
      this.prisma.transferDetail.delete({ where: { id: transferDetailId } }),
    ]);
  }

  async findTransferDetailByTransactionId(transactionId: number) {
    return this.prisma.transferDetail.findFirst({
      where: {
        transactions: { some: { id: transactionId } },
      },
    });
  }

  async findTransactionsByTransferDetail(transferDetailId: number) {
    return this.prisma.transaction.findMany({
      where: { transferDetailId },
    });
  }
}
