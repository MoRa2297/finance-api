import { Frequency, RecurringType } from '@prisma/client';

export interface ICreateRecurringRule {
  description: string;
  amount: number;
  type: RecurringType;
  frequency: Frequency;
  startDate: string;
  endDate?: string;
  dayOfMonth?: number;
  dayOfWeek?: string;
  note?: string;
  isActive?: boolean;
  // INCOME / EXPENSE
  categoryId?: number;
  bankAccountId?: number;
  cardAccountId?: number;
  // TRANSFER
  fromAccountId?: number;
  toAccountId?: number;
}
