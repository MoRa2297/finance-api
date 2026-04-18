import { Frequency } from '@prisma/client';

export interface ICreateTransfer {
  amount: number;
  date: string;
  description: string;
  note?: string;
  fromAccountId: number;
  toAccountId: number;
  recurrent?: boolean;
  frequency?: Frequency;
  recurrenceEndDate?: string;
}
