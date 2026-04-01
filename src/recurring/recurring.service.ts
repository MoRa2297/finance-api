import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Frequency, RecurringType, TransactionType } from '@prisma/client';
import { PrismaService } from '@prisma-client/prisma.service';
import {
  CreateRecurringRuleDto,
  UpdateRecurringRuleDto,
  FilterRecurringRuleDto,
} from './dto';

const RECURRING_RULE_INCLUDE = {
  category: {
    include: {
      categoryIcon: true,
      categoryColor: true,
    },
  },
  bankAccount: {
    include: {
      bankType: true,
    },
  },
  card: true,
};

@Injectable()
export class RecurringService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── CRUD ──────────────────────────────────────────────────────────────────

  async getRecurringRules(userId: number, filters: FilterRecurringRuleDto) {
    const { type, frequency, isActive, categoryId, bankAccountId } = filters;
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = { userId };

    if (type) where.type = type;
    if (frequency) where.frequency = frequency;
    if (isActive !== undefined) where.isActive = isActive;
    if (categoryId) where.categoryId = categoryId;
    if (bankAccountId) where.bankAccountId = bankAccountId;

    const [rules, total] = await Promise.all([
      this.prisma.recurringRule.findMany({
        where,
        orderBy: { createdDate: 'desc' },
        skip,
        take: limit,
        include: RECURRING_RULE_INCLUDE,
      }),
      this.prisma.recurringRule.count({ where }),
    ]);

    return {
      data: rules,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getRecurringRule(id: number, userId: number) {
    const rule = await this.findRuleOrThrow(id);
    this.checkOwnership(rule.userId, userId);
    return rule;
  }

  async createRecurringRule(userId: number, dto: CreateRecurringRuleDto) {
    await this.verifyCategoryOwnership(dto.categoryId, userId);
    if (dto.bankAccountId) {
      await this.verifyBankAccountOwnership(dto.bankAccountId, userId);
    }
    if (dto.cardAccountId) {
      await this.verifyCardAccountOwnership(dto.cardAccountId, userId);
    }

    return this.prisma.recurringRule.create({
      data: {
        description: dto.description,
        amount: dto.amount,
        type: dto.type,
        frequency: dto.frequency,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        dayOfMonth: dto.dayOfMonth ?? null,
        dayOfWeek: dto.dayOfWeek ?? null,
        note: dto.note ?? '',
        isActive: dto.isActive ?? true,
        userId,
        categoryId: dto.categoryId,
        bankAccountId: dto.bankAccountId ?? null,
        cardAccountId: dto.cardAccountId ?? null,
      },
      include: RECURRING_RULE_INCLUDE,
    });
  }

  async updateRecurringRule(
    id: number,
    userId: number,
    dto: UpdateRecurringRuleDto,
  ) {
    const rule = await this.findRuleOrThrow(id);
    this.checkOwnership(rule.userId, userId);

    if (dto.categoryId) {
      await this.verifyCategoryOwnership(dto.categoryId, userId);
    }
    if (dto.bankAccountId) {
      await this.verifyBankAccountOwnership(dto.bankAccountId, userId);
    }
    if (dto.cardAccountId) {
      await this.verifyCardAccountOwnership(dto.cardAccountId, userId);
    }

    return this.prisma.recurringRule.update({
      where: { id },
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        updateDate: new Date(),
      },
      include: RECURRING_RULE_INCLUDE,
    });
  }

  async deleteRecurringRule(id: number, userId: number) {
    const rule = await this.findRuleOrThrow(id);
    this.checkOwnership(rule.userId, userId);
    await this.prisma.recurringRule.delete({ where: { id } });
    return { message: 'Recurring rule deleted successfully' };
  }

  // ─── Generation ────────────────────────────────────────────────────────────

  async generateDueTransactions(
    userId: number,
  ): Promise<{ generated: number; message: string }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const rules = await this.prisma.recurringRule.findMany({
      where: { userId, isActive: true },
    });

    let generated = 0;

    for (const rule of rules) {
      // Se la regola non è ancora iniziata, skip
      if (rule.startDate > today) continue;

      // Se la regola è scaduta, skip
      if (rule.endDate && rule.endDate < today) continue;

      const fromDate = rule.lastGeneratedDate
        ? this.addOneDay(rule.lastGeneratedDate)
        : rule.startDate;

      const dueDates = this.getDueDates(rule.frequency, fromDate, today);

      if (dueDates.length === 0) continue;

      // Crea le transazioni mancanti in una singola query batch
      await this.prisma.transaction.createMany({
        data: dueDates.map((date) => ({
          money: rule.amount,
          date,
          description: rule.description,
          note: rule.note,
          recurrent: true,
          type:
            rule.type === RecurringType.INCOME
              ? TransactionType.INCOME
              : TransactionType.EXPENSE,
          userId,
          categoryId: rule.categoryId,
          bankAccountId: rule.bankAccountId,
          cardAccountId: rule.cardAccountId,
          recurringRuleId: rule.id,
        })),
      });

      generated += dueDates.length;

      // Aggiorna lastGeneratedDate all'ultima data generata
      await this.prisma.recurringRule.update({
        where: { id: rule.id },
        data: { lastGeneratedDate: dueDates[dueDates.length - 1] },
      });
    }

    return {
      generated,
      message: `Generated ${generated} transaction${generated !== 1 ? 's' : ''}`,
    };
  }

  // ─── Date helpers ──────────────────────────────────────────────────────────

  private getDueDates(frequency: Frequency, from: Date, until: Date): Date[] {
    const dates: Date[] = [];
    let cursor = this.stripTime(new Date(from));

    while (cursor <= until) {
      dates.push(new Date(cursor));
      cursor = this.advance(cursor, frequency);
    }

    return dates;
  }

  private advance(date: Date, frequency: Frequency): Date {
    const next = new Date(date);

    switch (frequency) {
      case Frequency.DAILY:
        next.setDate(next.getDate() + 1);
        break;
      case Frequency.WEEKLY:
        next.setDate(next.getDate() + 7);
        break;
      case Frequency.BIWEEKLY:
        next.setDate(next.getDate() + 14);
        break;
      case Frequency.MONTHLY:
        next.setMonth(next.getMonth() + 1);
        break;
      case Frequency.BIMONTHLY:
        next.setMonth(next.getMonth() + 2);
        break;
      case Frequency.QUARTERLY:
        next.setMonth(next.getMonth() + 3);
        break;
      case Frequency.SEMIANNUAL:
        next.setMonth(next.getMonth() + 6);
        break;
      case Frequency.YEARLY:
        next.setFullYear(next.getFullYear() + 1);
        break;
    }

    return next;
  }

  private addOneDay(date: Date): Date {
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    return this.stripTime(next);
  }

  private stripTime(date: Date): Date {
    date.setHours(0, 0, 0, 0);
    return date;
  }

  // ─── Ownership helpers ─────────────────────────────────────────────────────

  private async findRuleOrThrow(id: number) {
    const rule = await this.prisma.recurringRule.findUnique({
      where: { id },
      include: RECURRING_RULE_INCLUDE,
    });

    if (!rule) {
      throw new NotFoundException(`Recurring rule with id ${id} not found`);
    }

    return rule;
  }

  private checkOwnership(
    resourceUserId: number | null | undefined,
    requestUserId: number,
  ) {
    if (resourceUserId !== requestUserId) {
      throw new ForbiddenException('You do not have access to this resource');
    }
  }

  private async verifyCategoryOwnership(categoryId: number, userId: number) {
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
  ) {
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
  ) {
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
