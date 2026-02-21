import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { BankAccountService } from '@bank-account/bank-account.service';
import { PrismaService } from '@prisma-client/prisma.service';
import { mockPrismaService } from '@test/mocks';
import { mockBankAccount, createBankAccountDto } from '@test/fixtures';

describe('BankAccountService', () => {
  let bankAccountService: BankAccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BankAccountService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    bankAccountService = module.get<BankAccountService>(BankAccountService);
    jest.clearAllMocks();
  });

  // ─── getBankAccounts ───────────────────────────────────────────────────────

  describe('getBankAccounts', () => {
    it('should return all bank accounts for the user', async () => {
      // Arrange
      mockPrismaService.bankAccount.findMany.mockResolvedValue([
        mockBankAccount,
      ]);

      // Act
      const result = await bankAccountService.getBankAccounts(1);

      // Assert
      expect(result).toEqual([mockBankAccount]);
      expect(mockPrismaService.bankAccount.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        orderBy: { createdDate: 'desc' },
      });
    });

    it('should return empty array if user has no bank accounts', async () => {
      // Arrange
      mockPrismaService.bankAccount.findMany.mockResolvedValue([]);

      // Act
      const result = await bankAccountService.getBankAccounts(1);

      // Assert
      expect(result).toEqual([]);
    });
  });

  // ─── getBankAccount ────────────────────────────────────────────────────────

  describe('getBankAccount', () => {
    it('should return bank account if owned by user', async () => {
      // Arrange
      mockPrismaService.bankAccount.findUnique.mockResolvedValue(
        mockBankAccount,
      );

      // Act
      const result = await bankAccountService.getBankAccount(1, 1);

      // Assert
      expect(result).toEqual(mockBankAccount);
    });

    it('should throw NotFoundException if bank account does not exist', async () => {
      // Arrange
      mockPrismaService.bankAccount.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(bankAccountService.getBankAccount(999, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if bank account belongs to another user', async () => {
      // Arrange
      mockPrismaService.bankAccount.findUnique.mockResolvedValue({
        ...mockBankAccount,
        userId: 2,
      });

      // Act & Assert
      await expect(bankAccountService.getBankAccount(1, 1)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  // ─── createBankAccount ─────────────────────────────────────────────────────

  describe('createBankAccount', () => {
    it('should create and return a new bank account', async () => {
      // Arrange
      mockPrismaService.bankAccount.create.mockResolvedValue(mockBankAccount);

      // Act
      const result = await bankAccountService.createBankAccount(
        1,
        createBankAccountDto,
      );

      // Assert
      expect(result).toEqual(mockBankAccount);
      expect(mockPrismaService.bankAccount.create).toHaveBeenCalledWith({
        data: {
          name: createBankAccountDto.name,
          startingBalance: createBankAccountDto.startingBalance,
          userId: 1,
          colorId: createBankAccountDto.colorId,
          bankTypeId: createBankAccountDto.bankTypeId,
          bankAccountTypeId: createBankAccountDto.bankAccountTypeId,
        },
      });
    });
  });

  // ─── updateBankAccount ─────────────────────────────────────────────────────

  describe('updateBankAccount', () => {
    it('should update and return the bank account', async () => {
      // Arrange
      mockPrismaService.bankAccount.findUnique.mockResolvedValue(
        mockBankAccount,
      );
      mockPrismaService.bankAccount.update.mockResolvedValue({
        ...mockBankAccount,
        name: 'Conto Aggiornato',
      });

      // Act
      const result = await bankAccountService.updateBankAccount(1, 1, {
        name: 'Conto Aggiornato',
      });

      // Assert
      expect(result.name).toBe('Conto Aggiornato');
    });

    it('should throw ForbiddenException if bank account belongs to another user', async () => {
      // Arrange
      mockPrismaService.bankAccount.findUnique.mockResolvedValue({
        ...mockBankAccount,
        userId: 2,
      });

      // Act & Assert
      await expect(
        bankAccountService.updateBankAccount(1, 1, { name: 'Test' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // ─── deleteBankAccount ─────────────────────────────────────────────────────

  describe('deleteBankAccount', () => {
    it('should delete bank account and return message', async () => {
      // Arrange
      mockPrismaService.bankAccount.findUnique.mockResolvedValue(
        mockBankAccount,
      );
      mockPrismaService.bankAccount.delete.mockResolvedValue(mockBankAccount);

      // Act
      const result = await bankAccountService.deleteBankAccount(1, 1);

      // Assert
      expect(result.message).toBeDefined();
      expect(mockPrismaService.bankAccount.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if bank account does not exist', async () => {
      // Arrange
      mockPrismaService.bankAccount.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(
        bankAccountService.deleteBankAccount(999, 1),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
