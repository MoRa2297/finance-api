import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { TransactionService } from '@transaction/transaction.service';
import { PrismaService } from '@prisma-client/prisma.service';
import { mockPrismaService } from '@test/mocks';
import {
  mockTransaction,
  mockCategory,
  mockBankAccount,
  createTransactionDto,
} from '@test/fixtures';

describe('TransactionService', () => {
  let transactionService: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    transactionService = module.get<TransactionService>(TransactionService);
    jest.clearAllMocks();
  });

  // ─── getTransactions ───────────────────────────────────────────────────────

  describe('getTransactions', () => {
    it('should return paginated transactions for the user', async () => {
      // Arrange
      mockPrismaService.transaction.findMany.mockResolvedValue([
        mockTransaction,
      ]);
      mockPrismaService.transaction.count.mockResolvedValue(1);

      // Act
      const result = await transactionService.getTransactions(1, {
        page: 1,
        limit: 20,
      });

      // Assert
      expect(result.data).toEqual([mockTransaction]);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
      expect(result.meta.totalPages).toBe(1);
    });

    it('should apply month and year filters correctly', async () => {
      // Arrange
      mockPrismaService.transaction.findMany.mockResolvedValue([]);
      mockPrismaService.transaction.count.mockResolvedValue(0);

      // Act
      await transactionService.getTransactions(1, {
        month: 2,
        year: 2026,
        page: 1,
        limit: 20,
      });

      // Assert — verify that date filter was applied
      expect(mockPrismaService.transaction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            date: expect.objectContaining({
              gte: expect.any(Date),
              lte: expect.any(Date),
            }),
          }),
        }),
      );
    });

    it('should calculate correct totalPages', async () => {
      // Arrange — 45 total transactions with limit 20 = 3 pages
      mockPrismaService.transaction.findMany.mockResolvedValue([]);
      mockPrismaService.transaction.count.mockResolvedValue(45);

      // Act
      const result = await transactionService.getTransactions(1, {
        page: 1,
        limit: 20,
      });

      // Assert
      expect(result.meta.totalPages).toBe(3);
    });
  });

  // ─── getTransaction ────────────────────────────────────────────────────────

  describe('getTransaction', () => {
    it('should return transaction if owned by user', async () => {
      // Arrange
      mockPrismaService.transaction.findUnique.mockResolvedValue(
        mockTransaction,
      );

      // Act
      const result = await transactionService.getTransaction(1, 1);

      // Assert
      expect(result).toEqual(mockTransaction);
    });

    it('should throw NotFoundException if transaction does not exist', async () => {
      // Arrange
      mockPrismaService.transaction.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(transactionService.getTransaction(999, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if transaction belongs to another user', async () => {
      // Arrange
      mockPrismaService.transaction.findUnique.mockResolvedValue({
        ...mockTransaction,
        userId: 2,
      });

      // Act & Assert
      await expect(transactionService.getTransaction(1, 1)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  // ─── createTransaction ─────────────────────────────────────────────────────

  describe('createTransaction', () => {
    it('should create and return a new transaction', async () => {
      // Arrange — all related resources exist and belong to user
      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);
      mockPrismaService.bankAccount.findUnique.mockResolvedValue(
        mockBankAccount,
      );
      mockPrismaService.transaction.create.mockResolvedValue(mockTransaction);

      // Act
      const result = await transactionService.createTransaction(
        1,
        createTransactionDto,
      );

      // Assert
      expect(result).toEqual(mockTransaction);
    });

    it('should throw NotFoundException if category does not exist', async () => {
      // Arrange
      mockPrismaService.category.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(
        transactionService.createTransaction(1, createTransactionDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if category belongs to another user', async () => {
      // Arrange
      mockPrismaService.category.findUnique.mockResolvedValue({
        ...mockCategory,
        userId: 2,
      });

      // Act & Assert
      await expect(
        transactionService.createTransaction(1, createTransactionDto),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if bank account belongs to another user', async () => {
      // Arrange
      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);
      mockPrismaService.bankAccount.findUnique.mockResolvedValue({
        ...mockBankAccount,
        userId: 2,
      });

      // Act & Assert
      await expect(
        transactionService.createTransaction(1, createTransactionDto),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // ─── deleteTransaction ─────────────────────────────────────────────────────

  describe('deleteTransaction', () => {
    it('should delete transaction and return message', async () => {
      // Arrange
      mockPrismaService.transaction.findUnique.mockResolvedValue(
        mockTransaction,
      );
      mockPrismaService.transaction.delete.mockResolvedValue(mockTransaction);

      // Act
      const result = await transactionService.deleteTransaction(1, 1);

      // Assert
      expect(result.message).toBeDefined();
      expect(mockPrismaService.transaction.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if transaction does not exist', async () => {
      // Arrange
      mockPrismaService.transaction.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(
        transactionService.deleteTransaction(999, 1),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
