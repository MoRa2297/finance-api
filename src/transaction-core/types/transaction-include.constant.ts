import { Prisma } from '@prisma/client';

export const TRANSACTION_INCLUDE = {
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
  transferDetail: {
    include: {
      fromAccount: true,
      toAccount: true,
    },
  },
  recurringRule: {
    include: {
      fromAccount: true,
      toAccount: true,
    },
  },
} satisfies Prisma.TransactionInclude;
