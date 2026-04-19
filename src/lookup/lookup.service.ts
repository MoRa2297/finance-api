import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma-client/prisma.service';

@Injectable()
export class LookupService {
  constructor(private readonly prisma: PrismaService) {}

  async getColors() {
    return this.prisma.color.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async getCategoryIcons() {
    return this.prisma.categoryIcon.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async getBankTypes() {
    return this.prisma.bankType.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async getBankAccountTypes() {
    return this.prisma.bankAccountType.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async getCardTypes() {
    return this.prisma.cardType.findMany({
      orderBy: { name: 'asc' },
    });
  }
}
