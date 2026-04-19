import { Frequency, RecurringType } from '@prisma/client';

export const mockRecurringRule = {
  id: 1,
  description: 'Netflix',
  amount: 15.99,
  type: RecurringType.EXPENSE,
  frequency: Frequency.MONTHLY,
  startDate: new Date('2026-01-01'),
  endDate: null,
  dayOfMonth: null,
  dayOfWeek: null,
  note: '',
  isActive: true,
  lastGeneratedDate: null,
  userId: 1,
  categoryId: 1,
  bankAccountId: 1,
  cardAccountId: null,
  createdDate: new Date('2026-01-01'),
  updateDate: new Date('2026-01-01'),
  category: null,
  bankAccount: null,
  card: null,
  fromAccountId: null,
  toAccountId: null,
};

export const mockRecurringRuleWithRelations = {
  ...mockRecurringRule,
  category: {
    id: 1,
    name: 'Abbonamenti',
    type: 'EXPENSE',
    userId: 1,
    colorId: 1,
    iconId: 1,
    categoryIcon: {
      id: 1,
      iconName: 'sync-outline',
      createdDate: new Date(),
      updateDate: new Date(),
    },
    categoryColor: {
      id: 1,
      hexCode: '#0000FF',
      createdDate: new Date(),
      updateDate: new Date(),
    },
    createdDate: new Date('2026-01-01'),
    updateDate: new Date('2026-01-01'),
  },
  bankAccount: {
    id: 1,
    name: 'Conto N26',
    startingBalance: 1500.0,
    userId: 1,
    colorId: 1,
    bankTypeId: 1,
    bankAccountTypeId: 1,
    bankType: {
      id: 1,
      name: 'N26',
      imageUrl: '',
      createdDate: new Date(),
      updateDate: new Date(),
    },
    createdDate: new Date('2026-01-01'),
    updateDate: new Date('2026-01-01'),
  },
  fromAccountId: null,
  toAccountId: null,
  fromAccount: null,
  toAccount: null,
};

export const createRecurringRuleDto = {
  description: 'Netflix',
  amount: 15.99,
  type: RecurringType.EXPENSE,
  frequency: Frequency.MONTHLY,
  startDate: '2026-01-01',
  note: '',
  categoryId: 1,
  bankAccountId: 1,
};

export const updateRecurringRuleDto = {
  amount: 17.99,
  description: 'Netflix Premium',
};
