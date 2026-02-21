import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CardAccountService } from '@card-account/card-account.service';
import { PrismaService } from '@prisma-client/prisma.service';
import { mockPrismaService } from '@test/mocks';
import {
  mockCardAccount,
  mockBankAccount,
  createCardAccountDto,
} from '@test/fixtures';

describe('CardAccountService', () => {
  let cardAccountService: CardAccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardAccountService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    cardAccountService = module.get<CardAccountService>(CardAccountService);
    jest.clearAllMocks();
  });

  // ─── getCardAccounts ───────────────────────────────────────────────────────

  describe('getCardAccounts', () => {
    it('should return all cards for the user', async () => {
      // Arrange
      mockPrismaService.cardAccount.findMany.mockResolvedValue([
        mockCardAccount,
      ]);

      // Act
      const result = await cardAccountService.getCardAccounts(1);

      // Assert
      expect(result).toEqual([mockCardAccount]);
    });

    it('should return empty array if user has no cards', async () => {
      // Arrange
      mockPrismaService.cardAccount.findMany.mockResolvedValue([]);

      // Act
      const result = await cardAccountService.getCardAccounts(1);

      // Assert
      expect(result).toEqual([]);
    });
  });

  // ─── getCardAccount ────────────────────────────────────────────────────────

  describe('getCardAccount', () => {
    it('should return card if owned by user', async () => {
      // Arrange
      mockPrismaService.cardAccount.findUnique.mockResolvedValue(
        mockCardAccount,
      );

      // Act
      const result = await cardAccountService.getCardAccount(1, 1);

      // Assert
      expect(result).toEqual(mockCardAccount);
    });

    it('should throw NotFoundException if card does not exist', async () => {
      // Arrange
      mockPrismaService.cardAccount.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(cardAccountService.getCardAccount(999, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if card belongs to another user', async () => {
      // Arrange
      mockPrismaService.cardAccount.findUnique.mockResolvedValue({
        ...mockCardAccount,
        userId: 2,
      });

      // Act & Assert
      await expect(cardAccountService.getCardAccount(1, 1)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  // ─── createCardAccount ─────────────────────────────────────────────────────

  describe('createCardAccount', () => {
    it('should create and return a new card', async () => {
      // Arrange — bank account exists and belongs to user
      mockPrismaService.bankAccount.findUnique.mockResolvedValue(
        mockBankAccount,
      );
      mockPrismaService.cardAccount.create.mockResolvedValue(mockCardAccount);

      // Act
      const result = await cardAccountService.createCardAccount(
        1,
        createCardAccountDto,
      );

      // Assert
      expect(result).toEqual(mockCardAccount);
    });

    it('should throw NotFoundException if bank account does not exist', async () => {
      // Arrange
      mockPrismaService.bankAccount.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(
        cardAccountService.createCardAccount(1, createCardAccountDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if bank account belongs to another user', async () => {
      // Arrange
      mockPrismaService.bankAccount.findUnique.mockResolvedValue({
        ...mockBankAccount,
        userId: 2,
      });

      // Act & Assert
      await expect(
        cardAccountService.createCardAccount(1, createCardAccountDto),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // ─── deleteCardAccount ─────────────────────────────────────────────────────

  describe('deleteCardAccount', () => {
    it('should delete card and return message', async () => {
      // Arrange
      mockPrismaService.cardAccount.findUnique.mockResolvedValue(
        mockCardAccount,
      );
      mockPrismaService.cardAccount.delete.mockResolvedValue(mockCardAccount);

      // Act
      const result = await cardAccountService.deleteCardAccount(1, 1);

      // Assert
      expect(result.message).toBeDefined();
    });

    it('should throw NotFoundException if card does not exist', async () => {
      // Arrange
      mockPrismaService.cardAccount.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(
        cardAccountService.deleteCardAccount(999, 1),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
