import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '@prisma-client/prisma.service';
import { CreateBankAccountDto, UpdateBankAccountDto } from './dto';

const BANK_ACCOUNT_INCLUDE = {
  bankType: true,
  bankAccountType: true,
  color: true,
};

@Injectable()
export class BankAccountService {
  constructor(private readonly prisma: PrismaService) {}

  async getBankAccounts(userId: number) {
    return this.prisma.bankAccount.findMany({
      where: { userId },
      orderBy: { createdDate: 'asc' },
      include: BANK_ACCOUNT_INCLUDE,
    });
  }

  async getBankAccount(id: number, userId: number) {
    const account = await this.findBankAccountOrThrow(id);
    this.checkOwnership(account.userId, userId);
    return account;
  }

  async createBankAccount(userId: number, dto: CreateBankAccountDto) {
    return this.prisma.bankAccount.create({
      data: {
        name: dto.name,
        startingBalance: dto.startingBalance,
        userId,
        colorId: dto.colorId,
        bankTypeId: dto.bankTypeId,
        bankAccountTypeId: dto.bankAccountTypeId,
      },
      include: BANK_ACCOUNT_INCLUDE,
    });
  }

  async updateBankAccount(
    id: number,
    userId: number,
    dto: UpdateBankAccountDto,
  ) {
    const account = await this.findBankAccountOrThrow(id);
    this.checkOwnership(account.userId, userId);

    return this.prisma.bankAccount.update({
      where: { id },
      data: { ...dto, updateDate: new Date() },
      include: BANK_ACCOUNT_INCLUDE,
    });
  }

  async deleteBankAccount(id: number, userId: number) {
    const account = await this.findBankAccountOrThrow(id);
    this.checkOwnership(account.userId, userId);
    await this.prisma.bankAccount.delete({ where: { id } });
    return { message: 'Bank account deleted successfully' };
  }

  private async findBankAccountOrThrow(id: number) {
    const account = await this.prisma.bankAccount.findUnique({
      where: { id },
      include: BANK_ACCOUNT_INCLUDE,
    });

    if (!account) {
      throw new NotFoundException(`Bank account with id ${id} not found`);
    }

    return account;
  }

  private checkOwnership(resourceUserId: number, requestUserId: number) {
    if (resourceUserId !== requestUserId) {
      throw new ForbiddenException('You do not have access to this resource');
    }
  }
}
