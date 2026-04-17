import { Prisma } from '@prisma/client';

export const RECURRING_RULE_INCLUDE = {
  category: {
    include: {
      categoryIcon: true,
      categoryColor: true,
    },
  },
  bankAccount: {
    include: { bankType: true },
  },
  card: true,
  fromAccount: true,
  toAccount: true,
} satisfies Prisma.RecurringRuleInclude;

export type RecurringRuleWithRelations = Prisma.RecurringRuleGetPayload<{
  include: typeof RECURRING_RULE_INCLUDE;
}>;
