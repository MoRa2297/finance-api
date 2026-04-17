import { Frequency, TransactionType } from '@prisma/client';

export interface ICreateTransaction {
  amount: number;
  date: string;
  description: string;
  note: string;
  recurrent: boolean;
  type: TransactionType;
  frequency?: Frequency;
  recurrenceEndDate?: string;
  categoryId?: number;
  bankAccountId?: number;
  cardAccountId?: number;
}
