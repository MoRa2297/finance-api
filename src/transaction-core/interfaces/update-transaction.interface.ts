import { TransactionType } from '@prisma/client';

export interface IUpdateTransaction {
  amount?: number;
  date?: Date;
  description?: string;
  note?: string;
  recurrent?: boolean;
  type?: TransactionType;
  categoryId?: number;
  bankAccountId?: number;
  cardAccountId?: number;
  recurringRuleId?: number;
}
