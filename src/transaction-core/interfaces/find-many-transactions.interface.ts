import { TransactionType } from '@prisma/client';

export interface IFindManyTransactions {
  userId: number;
  type?: TransactionType;
  categoryId?: number;
  bankAccountId?: number;
  cardAccountId?: number;
  month?: number;
  year?: number;
  page?: number;
  limit?: number;
}
