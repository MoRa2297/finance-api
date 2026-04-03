import { TransactionType } from '@prisma/client';

export interface ICreateTransaction {
  amount: number;
  date: Date;
  description: string;
  note: string;
  recurrent: boolean;
  type: TransactionType;
  userId: number;
  categoryId?: number;
  bankAccountId?: number;
  cardAccountId?: number;
  recurringRuleId?: number;
  transferDetailId?: number;
}
