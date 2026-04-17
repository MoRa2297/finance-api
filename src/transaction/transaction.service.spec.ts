import { Test, TestingModule } from '@nestjs/testing';
import {
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TransactionService } from '@transaction/transaction.service';
import { TransactionCoreService } from '@transaction-core/transaction-core.service';
import { RecurringService } from '@recurring/recurring.service';
import { PrismaService } from '@prisma-client/prisma.service';
import { mockPrismaService } from '@test/mocks';
import {
  mockTransactionWithRelations,
  mockTransferTransaction,
  createTransactionDto,
  createTransferDto,
  mockBankAccount,
  mockBankAccount2,
  mockCategory,
  mockTransferDetail,
} from '@test/fixtures';
import { TransactionType } from '@prisma/client';

const mockTransactionCoreService = {
  findMany: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  createMany: jest.fn(),
  createTransfer: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  deleteTransfer: jest.fn(),
  findTransferDetailByTransactionId: jest.fn(),
  findTransactionsByTransferDetail: jest.fn(),
};

const mockRecurringService = {
  createRecurringRule: jest.fn(),
};

describe('TransactionService', () => {
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        { provide: PrismaService, useValue: mockPrismaService },
        {
          provide: TransactionCoreService,
          useValue: mockTransactionCoreService,
        },
        { provide: RecurringService, useValue: mockRecurringService },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    jest.clearAllMocks();
  });

  // ─── getTransactions ───────────────────────────────────────────────────────

  describe('getTransactions', () => {
    it('should return paginated transactions', async () => {
      mockTransactionCoreService.findMany.mockResolvedValue({
        data: [mockTransactionWithRelations],
        meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
      });

      const result = await service.getTransactions(1, { page: 1, limit: 20 });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });
  });

  // ─── getTransaction ────────────────────────────────────────────────────────

  describe('getTransaction', () => {
    it('should return transaction if owned by user', async () => {
      mockTransactionCoreService.findById.mockResolvedValue(
        mockTransactionWithRelations,
      );

      const result = await service.getTransaction(1, 1);

      expect(result).toEqual(mockTransactionWithRelations);
    });

    it('should throw NotFoundException if not found', async () => {
      mockTransactionCoreService.findById.mockResolvedValue(null);

      await expect(service.getTransaction(999, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if not owned by user', async () => {
      mockTransactionCoreService.findById.mockResolvedValue({
        ...mockTransactionWithRelations,
        userId: 2,
      });

      await expect(service.getTransaction(1, 1)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  // ─── createTransaction ─────────────────────────────────────────────────────

  describe('createTransaction', () => {
    it('should create and return a transaction', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);
      mockPrismaService.bankAccount.findUnique.mockResolvedValue(
        mockBankAccount,
      );
      mockTransactionCoreService.create.mockResolvedValue(
        mockTransactionWithRelations,
      );

      const result = await service.createTransaction(1, createTransactionDto);

      expect(result).toEqual(mockTransactionWithRelations);
    });

    it('should throw BadRequestException if type is TRANSFER', async () => {
      await expect(
        service.createTransaction(1, {
          ...createTransactionDto,
          type: TransactionType.TRANSFER,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if recurrent is true without frequency', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);
      mockPrismaService.bankAccount.findUnique.mockResolvedValue(
        mockBankAccount,
      );

      await expect(
        service.createTransaction(1, {
          ...createTransactionDto,
          recurrent: true,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if category does not exist', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(null);

      await expect(
        service.createTransaction(1, createTransactionDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if category belongs to another user', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue({
        ...mockCategory,
        userId: 2,
      });

      await expect(
        service.createTransaction(1, createTransactionDto),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should create recurring rule if recurrent is true', async () => {
      const mockRule = { id: 1 };
      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);
      mockPrismaService.bankAccount.findUnique.mockResolvedValue(
        mockBankAccount,
      );
      mockRecurringService.createRecurringRule.mockResolvedValue(mockRule);
      mockTransactionCoreService.create.mockResolvedValue({
        ...mockTransactionWithRelations,
        recurrent: true,
        recurringRuleId: 1,
      });

      const result = await service.createTransaction(1, {
        ...createTransactionDto,
        recurrent: true,
        frequency: 'MONTHLY' as any,
      });

      expect(mockRecurringService.createRecurringRule).toHaveBeenCalledTimes(1);
      expect(result.recurrent).toBe(true);
    });
  });

  // ─── createTransfer ────────────────────────────────────────────────────────

  describe('createTransfer', () => {
    it('should create a transfer', async () => {
      mockPrismaService.bankAccount.findUnique
        .mockResolvedValueOnce(mockBankAccount)
        .mockResolvedValueOnce(mockBankAccount2);
      mockTransactionCoreService.createTransfer.mockResolvedValue(
        mockTransactionWithRelations,
      );

      const result = await service.createTransfer(1, createTransferDto);

      expect(result).toEqual(mockTransactionWithRelations);
      expect(mockTransactionCoreService.createTransfer).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should throw BadRequestException if accounts are the same', async () => {
      await expect(
        service.createTransfer(1, {
          ...createTransferDto,
          toAccountId: createTransferDto.fromAccountId,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ForbiddenException if fromAccount belongs to another user', async () => {
      mockPrismaService.bankAccount.findUnique.mockResolvedValue({
        ...mockBankAccount,
        userId: 2,
      });

      await expect(
        service.createTransfer(1, createTransferDto),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // ─── updateTransaction ─────────────────────────────────────────────────────

  describe('updateTransaction', () => {
    it('should update and return the transaction', async () => {
      const updated = { ...mockTransactionWithRelations, amount: 75.0 };
      mockTransactionCoreService.findById.mockResolvedValue(
        mockTransactionWithRelations,
      );
      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);
      mockTransactionCoreService.update.mockResolvedValue(updated);

      const result = await service.updateTransaction(1, 1, { amount: 75.0 });

      expect(result.amount).toBe(75.0);
    });

    it('should throw BadRequestException if transaction is a TRANSFER', async () => {
      mockTransactionCoreService.findById.mockResolvedValue(
        mockTransferTransaction,
      );

      await expect(
        service.updateTransaction(1, 1, { amount: 100 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if transaction does not exist', async () => {
      mockTransactionCoreService.findById.mockResolvedValue(null);

      await expect(service.updateTransaction(999, 1, {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ─── deleteTransaction ─────────────────────────────────────────────────────

  describe('deleteTransaction', () => {
    it('should delete a transaction', async () => {
      mockTransactionCoreService.findById.mockResolvedValue(
        mockTransactionWithRelations,
      );
      mockTransactionCoreService.delete.mockResolvedValue(undefined);

      const result = await service.deleteTransaction(1, 1);

      expect(result.message).toBeDefined();
    });

    it('should delete both legs of a transfer', async () => {
      mockTransactionCoreService.findById.mockResolvedValue({
        ...mockTransferTransaction,
        userId: 1,
      });
      mockTransactionCoreService.findTransactionsByTransferDetail.mockResolvedValue(
        [
          { ...mockTransferTransaction, id: 2, userId: 1 },
          { ...mockTransferTransaction, id: 3, userId: 1 },
        ],
      );
      mockTransactionCoreService.deleteTransfer.mockResolvedValue(undefined);

      const result = await service.deleteTransaction(2, 1);

      expect(result.message).toBe('Transfer deleted successfully');
      expect(mockTransactionCoreService.deleteTransfer).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if transaction does not exist', async () => {
      mockTransactionCoreService.findById.mockResolvedValue(null);

      await expect(service.deleteTransaction(999, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
