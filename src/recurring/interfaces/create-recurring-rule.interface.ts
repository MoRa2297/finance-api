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
  categoryId: number;
  bankAccountId?: number;
  cardAccountId?: number;
}
