import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { PrismaService } from '@prisma-client/prisma.service';
import { FilterTransactionDto } from './dto';
import {
  ICreateTransaction,
  ICreateTransfer,
  IUpdateTransaction,
} from './interfaces';
import { TransactionCoreService } from '@transaction-core/transaction-core.service';
import { RecurringService } from '@recurring/recurring.service';
import { TransactionWithRelations } from '@transaction-core/types';

@Injectable()
export class TransactionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly transactionCore: TransactionCoreService,
    private readonly recurringService: RecurringService,
  ) {}

  // ─── Queries ───────────────────────────────────────────────────────────────

  async getTransactions(userId: number, filters: FilterTransactionDto) {
    return this.transactionCore.findMany({ userId, ...filters });
  }

  async getTransaction(
    id: number,
    userId: number,
  ): Promise<TransactionWithRelations> {
    const transaction = await this.findTransactionOrThrow(id);
    this.checkOwnership(transaction.userId, userId);
    return transaction;
  }

  // ─── Mutations ─────────────────────────────────────────────────────────────

  async createTransaction(
    userId: number,
    dto: ICreateTransaction,
  ): Promise<TransactionWithRelations> {
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

    if (dto.recurrent) {
      if (!dto.frequency) {
        throw new BadRequestException(
          'frequency is required when recurrent is true',
        );
      }

      const rule = await this.recurringService.createRecurringRule(userId, {
        description: dto.description,
        amount: dto.amount,
        type: dto.type === TransactionType.INCOME ? 'INCOME' : 'EXPENSE',
        frequency: dto.frequency,
        startDate: dto.date,
        endDate: dto.recurrenceEndDate,
        note: dto.note,
        categoryId: dto.categoryId!,
        bankAccountId: dto.bankAccountId,
        cardAccountId: dto.cardAccountId,
      });

      return this.transactionCore.create({
        amount: dto.amount,
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
      });
    }

    return this.transactionCore.create({
      amount: dto.amount,
      date: new Date(dto.date),
      description: dto.description,
      recurrent: false,
      note: dto.note,
      type: dto.type,
      userId,
      categoryId: dto.categoryId,
      bankAccountId: dto.bankAccountId,
      cardAccountId: dto.cardAccountId,
    });
  }

  async createTransfer(
    userId: number,
    dto: ICreateTransfer,
  ): Promise<TransactionWithRelations> {
    if (dto.fromAccountId === dto.toAccountId) {
      throw new BadRequestException(
        'Source and destination accounts must be different',
      );
    }

    await this.verifyBankAccountOwnership(dto.fromAccountId, userId);
    await this.verifyBankAccountOwnership(dto.toAccountId, userId);

    return this.transactionCore.createTransfer({
      amount: dto.amount,
      date: new Date(dto.date),
      description: dto.description,
      note: dto.note ?? '',
      userId,
      fromAccountId: dto.fromAccountId,
      toAccountId: dto.toAccountId,
    });
  }

  async updateTransaction(
    id: number,
    userId: number,
    dto: IUpdateTransaction,
  ): Promise<TransactionWithRelations> {
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

    return this.transactionCore.update(id, {
      ...dto,
      date: dto.date ? new Date(dto.date) : undefined,
    });
  }

  async deleteTransaction(
    id: number,
    userId: number,
  ): Promise<{ message: string }> {
    const transaction = await this.findTransactionOrThrow(id);
    this.checkOwnership(transaction.userId, userId);

    if (transaction.type === TransactionType.TRANSFER) {
      return this.deleteTransfer(transaction, userId);
    }

    await this.transactionCore.delete(id);
    return { message: 'Transaction deleted successfully' };
  }

  // ─── Private ───────────────────────────────────────────────────────────────

  private async deleteTransfer(
    transaction: TransactionWithRelations,
    userId: number,
  ): Promise<{ message: string }> {
    if (!transaction.transferDetailId) {
      await this.transactionCore.delete(transaction.id);
      return { message: 'Transaction deleted successfully' };
    }

    const linked = await this.transactionCore.findTransactionsByTransferDetail(
      transaction.transferDetailId,
    );

    linked.forEach((t) => this.checkOwnership(t.userId, userId));

    await this.transactionCore.deleteTransfer(transaction.transferDetailId);
    return { message: 'Transfer deleted successfully' };
  }

  private async findTransactionOrThrow(
    id: number,
  ): Promise<TransactionWithRelations> {
    const transaction = await this.transactionCore.findById(id);

    if (!transaction) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }

    return transaction;
  }

  private checkOwnership(
    resourceUserId: number | null | undefined,
    requestUserId: number,
  ): void {
    if (resourceUserId !== requestUserId) {
      throw new ForbiddenException('You do not have access to this resource');
    }
  }

  private async verifyCategoryOwnership(
    categoryId: number,
    userId: number,
  ): Promise<void> {
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
  ): Promise<void> {
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
  ): Promise<void> {
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
