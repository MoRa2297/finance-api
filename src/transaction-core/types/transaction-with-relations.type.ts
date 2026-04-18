import { Prisma } from '@prisma/client';
import { TRANSACTION_INCLUDE } from './transaction-include.constant';

export type TransactionWithRelations = Prisma.TransactionGetPayload<{
  include: typeof TRANSACTION_INCLUDE;
}>;
