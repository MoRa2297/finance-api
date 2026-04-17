import { TransactionType } from '@prisma/client';

export const mockTransaction = {
  id: 1,
  amount: 50.0,
  date: new Date('2026-02-19'),
  description: 'Spesa al supermercato',
  recurrent: false,
  note: '',
  type: TransactionType.EXPENSE,
  userId: 1,
  categoryId: 1,
  bankAccountId: 1,
  cardAccountId: null,
  recurringRuleId: null,
  transferDetailId: null,
  createdDate: new Date('2026-01-01'),
  updateDate: new Date('2026-01-01'),
  category: null,
  bankAccount: null,
  card: null,
  transferDetail: null,
};

export const mockTransactionWithRelations = {
  ...mockTransaction,
  category: {
    id: 1,
    name: 'Spesa',
    type: 'EXPENSE',
    userId: 1,
    colorId: 1,
    iconId: 1,
    categoryIcon: {
      id: 1,
      iconName: 'shopping-cart-outline',
      createdDate: new Date(),
      updateDate: new Date(),
    },
    categoryColor: {
      id: 1,
      hexCode: '#FF0000',
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
};

export const mockTransferTransaction = {
  ...mockTransaction,
  id: 2,
  type: TransactionType.TRANSFER,
  transferDetailId: 1,
  categoryId: null,
};

export const createTransactionDto = {
  amount: 50.0,
  date: '2026-02-19',
  description: 'Spesa al supermercato',
  recurrent: false,
  note: '',
  type: TransactionType.EXPENSE,
  categoryId: 1,
  bankAccountId: 1,
};

export const updateTransactionDto = {
  amount: 75.0,
  description: 'Spesa aggiornata',
};
