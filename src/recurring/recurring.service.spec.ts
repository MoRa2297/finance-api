import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { RecurringService } from '@recurring/recurring.service';
import { TransactionCoreService } from '@transaction-core/transaction-core.service';
import { PrismaService } from '@prisma-client/prisma.service';
import { mockPrismaService } from '@test/mocks';
import {
  mockRecurringRule,
  mockRecurringRuleWithRelations,
  createRecurringRuleDto,
  updateRecurringRuleDto,
  mockCategory,
  mockBankAccount,
} from '@test/fixtures';
import { Frequency, RecurringType, TransactionType } from '@prisma/client';

const mockTransactionCoreService = {
  createMany: jest.fn(),
};

describe('RecurringService', () => {
  let service: RecurringService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecurringService,
        { provide: PrismaService, useValue: mockPrismaService },
        {
          provide: TransactionCoreService,
          useValue: mockTransactionCoreService,
        },
      ],
    }).compile();

    service = module.get<RecurringService>(RecurringService);
    jest.clearAllMocks();
  });

  // ─── getRecurringRules ─────────────────────────────────────────────────────

  describe('getRecurringRules', () => {
    it('should return paginated recurring rules', async () => {
      mockPrismaService.recurringRule.findMany.mockResolvedValue([
        mockRecurringRuleWithRelations,
      ]);
      mockPrismaService.recurringRule.count.mockResolvedValue(1);

      const result = await service.getRecurringRules(1, { page: 1, limit: 20 });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should apply filters correctly', async () => {
      mockPrismaService.recurringRule.findMany.mockResolvedValue([]);
      mockPrismaService.recurringRule.count.mockResolvedValue(0);

      await service.getRecurringRules(1, {
        type: RecurringType.EXPENSE,
        frequency: Frequency.MONTHLY,
        isActive: true,
      });

      expect(mockPrismaService.recurringRule.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            type: RecurringType.EXPENSE,
            frequency: Frequency.MONTHLY,
            isActive: true,
          }),
        }),
      );
    });
  });

  // ─── getRecurringRule ──────────────────────────────────────────────────────

  describe('getRecurringRule', () => {
    it('should return rule if owned by user', async () => {
      mockPrismaService.recurringRule.findUnique.mockResolvedValue(
        mockRecurringRuleWithRelations,
      );

      const result = await service.getRecurringRule(1, 1);

      expect(result).toEqual(mockRecurringRuleWithRelations);
    });

    it('should throw NotFoundException if rule does not exist', async () => {
      mockPrismaService.recurringRule.findUnique.mockResolvedValue(null);

      await expect(service.getRecurringRule(999, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if rule belongs to another user', async () => {
      mockPrismaService.recurringRule.findUnique.mockResolvedValue({
        ...mockRecurringRuleWithRelations,
        userId: 2,
      });

      await expect(service.getRecurringRule(1, 1)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  // ─── createRecurringRule ───────────────────────────────────────────────────

  describe('createRecurringRule', () => {
    it('should create and return a recurring rule', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);
      mockPrismaService.bankAccount.findUnique.mockResolvedValue(
        mockBankAccount,
      );
      mockPrismaService.recurringRule.create.mockResolvedValue(
        mockRecurringRuleWithRelations,
      );

      const result = await service.createRecurringRule(
        1,
        createRecurringRuleDto,
      );

      expect(result).toEqual(mockRecurringRuleWithRelations);
    });

    it('should throw NotFoundException if category does not exist', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(null);

      await expect(
        service.createRecurringRule(1, createRecurringRuleDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if category belongs to another user', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue({
        ...mockCategory,
        userId: 2,
      });

      await expect(
        service.createRecurringRule(1, createRecurringRuleDto),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // ─── updateRecurringRule ───────────────────────────────────────────────────

  describe('updateRecurringRule', () => {
    it('should update and return the rule', async () => {
      const updated = { ...mockRecurringRuleWithRelations, amount: 17.99 };
      mockPrismaService.recurringRule.findUnique.mockResolvedValue(
        mockRecurringRuleWithRelations,
      );
      mockPrismaService.recurringRule.update.mockResolvedValue(updated);

      const result = await service.updateRecurringRule(
        1,
        1,
        updateRecurringRuleDto,
      );

      expect(result.amount).toBe(17.99);
    });

    it('should throw NotFoundException if rule does not exist', async () => {
      mockPrismaService.recurringRule.findUnique.mockResolvedValue(null);

      await expect(service.updateRecurringRule(999, 1, {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ─── deleteRecurringRule ───────────────────────────────────────────────────

  describe('deleteRecurringRule', () => {
    it('should delete rule and return message', async () => {
      mockPrismaService.recurringRule.findUnique.mockResolvedValue(
        mockRecurringRuleWithRelations,
      );
      mockPrismaService.recurringRule.delete.mockResolvedValue(
        mockRecurringRule,
      );

      const result = await service.deleteRecurringRule(1, 1);

      expect(result.message).toBeDefined();
    });

    it('should throw NotFoundException if rule does not exist', async () => {
      mockPrismaService.recurringRule.findUnique.mockResolvedValue(null);

      await expect(service.deleteRecurringRule(999, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ─── generateDueTransactions ───────────────────────────────────────────────

  describe('generateDueTransactions', () => {
    it('should generate transactions for due rules', async () => {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 2);

      mockPrismaService.recurringRule.findMany.mockResolvedValue([
        {
          ...mockRecurringRule,
          startDate,
          lastGeneratedDate: null,
          frequency: Frequency.MONTHLY,
        },
      ]);
      mockTransactionCoreService.createMany.mockResolvedValue(2);
      mockPrismaService.recurringRule.update.mockResolvedValue(
        mockRecurringRule,
      );

      const result = await service.generateDueTransactions(1);

      expect(result.generated).toBeGreaterThan(0);
      expect(mockTransactionCoreService.createMany).toHaveBeenCalledTimes(1);
    });

    it('should skip rules that have not started yet', async () => {
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + 1);

      mockPrismaService.recurringRule.findMany.mockResolvedValue([
        { ...mockRecurringRule, startDate: futureDate },
      ]);

      const result = await service.generateDueTransactions(1);

      expect(result.generated).toBe(0);
      expect(mockTransactionCoreService.createMany).not.toHaveBeenCalled();
    });

    it('should skip expired rules', async () => {
      const pastDate = new Date();
      pastDate.setMonth(pastDate.getMonth() - 3);
      const expiredDate = new Date();
      expiredDate.setMonth(expiredDate.getMonth() - 1);

      mockPrismaService.recurringRule.findMany.mockResolvedValue([
        {
          ...mockRecurringRule,
          startDate: pastDate,
          endDate: expiredDate,
        },
      ]);

      const result = await service.generateDueTransactions(1);

      expect(result.generated).toBe(0);
      expect(mockTransactionCoreService.createMany).not.toHaveBeenCalled();
    });

    it('should return correct message for single transaction', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      mockPrismaService.recurringRule.findMany.mockResolvedValue([
        {
          ...mockRecurringRule,
          startDate: yesterday,
          lastGeneratedDate: null,
          frequency: Frequency.DAILY,
        },
      ]);
      mockTransactionCoreService.createMany.mockResolvedValue(1);
      mockPrismaService.recurringRule.update.mockResolvedValue(
        mockRecurringRule,
      );

      const result = await service.generateDueTransactions(1);

      expect(result.message).toContain('transaction');
    });
  });
});
