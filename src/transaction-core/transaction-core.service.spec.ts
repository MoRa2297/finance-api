import { Test, TestingModule } from '@nestjs/testing';
import { TransactionCoreService } from '@transaction-core/transaction-core.service';
import { PrismaService } from '@prisma-client/prisma.service';
import { mockPrismaService } from '@test/mocks';
import {
  mockTransactionWithRelations,
  createTransactionDto,
} from '@test/fixtures';
import { TransactionType } from '@prisma/client';

interface CreateTransactionInput {
  amount: number;
  date: Date;
  description: string;
  note: string;
  recurrent: boolean;
  type: TransactionType;
  userId: number;
  categoryId: number;
}

describe('TransactionCoreService', () => {
  let service: TransactionCoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionCoreService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TransactionCoreService>(TransactionCoreService);
    jest.clearAllMocks();
  });

  // ─── findMany ──────────────────────────────────────────────────────────────

  describe('findMany', () => {
    it('should return paginated transactions for a user', async () => {
      mockPrismaService.transaction.findMany.mockResolvedValue([
        mockTransactionWithRelations,
      ]);
      mockPrismaService.transaction.count.mockResolvedValue(1);

      const result = await service.findMany({
        userId: 1,
        page: 1,
        limit: 20,
      });

      expect(result.data).toEqual([mockTransactionWithRelations]);
      expect(result.meta.total).toBe(1);
      expect(result.meta.totalPages).toBe(1);
    });

    it('should apply month and year filters', async () => {
      mockPrismaService.transaction.findMany.mockResolvedValue([]);
      mockPrismaService.transaction.count.mockResolvedValue(0);

      await service.findMany({ userId: 1, month: 2, year: 2026 });

      expect(mockPrismaService.transaction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            date: expect.objectContaining({
              gte: expect.any(Date) as Date,
              lte: expect.any(Date) as Date,
            }),
          }),
        }),
      );
    });

    it('should apply only year filter when month is not provided', async () => {
      mockPrismaService.transaction.findMany.mockResolvedValue([]);
      mockPrismaService.transaction.count.mockResolvedValue(0);

      await service.findMany({ userId: 1, year: 2026 });

      expect(mockPrismaService.transaction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            date: expect.objectContaining({
              gte: new Date(2026, 0, 1),
              lte: new Date(2026, 11, 31),
            }),
          }),
        }),
      );
    });

    it('should calculate correct totalPages', async () => {
      mockPrismaService.transaction.findMany.mockResolvedValue([]);
      mockPrismaService.transaction.count.mockResolvedValue(45);

      const result = await service.findMany({
        userId: 1,
        page: 1,
        limit: 20,
      });

      expect(result.meta.totalPages).toBe(3);
    });
  });

  // ─── findById ──────────────────────────────────────────────────────────────

  describe('findById', () => {
    it('should return a transaction by id', async () => {
      mockPrismaService.transaction.findUnique.mockResolvedValue(
        mockTransactionWithRelations,
      );

      const result = await service.findById(1);

      expect(result).toEqual(mockTransactionWithRelations);
    });

    it('should return null if transaction does not exist', async () => {
      mockPrismaService.transaction.findUnique.mockResolvedValue(null);

      const result = await service.findById(999);

      expect(result).toBeNull();
    });
  });

  // ─── create ────────────────────────────────────────────────────────────────

  describe('create', () => {
    it('should create and return a transaction', async () => {
      mockPrismaService.transaction.create.mockResolvedValue(
        mockTransactionWithRelations,
      );

      const result = await service.create({
        amount: createTransactionDto.amount,
        date: new Date(createTransactionDto.date),
        description: createTransactionDto.description,
        recurrent: createTransactionDto.recurrent,
        note: createTransactionDto.note,
        type: TransactionType.EXPENSE,
        userId: 1,
        categoryId: createTransactionDto.categoryId,
        bankAccountId: createTransactionDto.bankAccountId,
      });

      expect(result).toEqual(mockTransactionWithRelations);
      expect(mockPrismaService.transaction.create).toHaveBeenCalledTimes(1);
    });
  });

  // ─── createMany ────────────────────────────────────────────────────────────

  describe('createMany', () => {
    it('should create multiple transactions and return count', async () => {
      mockPrismaService.transaction.createMany.mockResolvedValue({
        count: 3,
      });

      const transactions: CreateTransactionInput[] = [
        {
          amount: 15.99,
          date: new Date('2026-01-01'),
          description: 'Netflix',
          note: '',
          recurrent: true,
          type: TransactionType.EXPENSE,
          userId: 1,
          categoryId: 1,
        },
        {
          amount: 15.99,
          date: new Date('2026-02-01'),
          description: 'Netflix',
          note: '',
          recurrent: true,
          type: TransactionType.EXPENSE,
          userId: 1,
          categoryId: 1,
        },
        {
          amount: 15.99,
          date: new Date('2026-03-01'),
          description: 'Netflix',
          note: '',
          recurrent: true,
          type: TransactionType.EXPENSE,
          userId: 1,
          categoryId: 1,
        },
      ];

      const result = await service.createMany(transactions);

      expect(result).toBe(3);
    });
  });

  // ─── update ────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('should update and return the transaction', async () => {
      const updated = { ...mockTransactionWithRelations, amount: 75.0 };
      mockPrismaService.transaction.update.mockResolvedValue(updated);

      const result = await service.update(1, { amount: 75.0 });

      expect(result.amount).toBe(75.0);
      expect(mockPrismaService.transaction.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 1 } }),
      );
    });
  });

  // ─── delete ────────────────────────────────────────────────────────────────

  describe('delete', () => {
    it('should delete a transaction', async () => {
      mockPrismaService.transaction.delete.mockResolvedValue(
        mockTransactionWithRelations,
      );

      await service.delete(1);

      expect(mockPrismaService.transaction.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  // ─── deleteTransfer ────────────────────────────────────────────────────────

  describe('deleteTransfer', () => {
    it('should delete all transfer transactions and the detail', async () => {
      mockPrismaService.$transaction.mockResolvedValue([]);

      await service.deleteTransfer(1);

      expect(mockPrismaService.$transaction).toHaveBeenCalledTimes(1);
    });
  });
});
