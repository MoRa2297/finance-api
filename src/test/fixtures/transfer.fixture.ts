import { TransactionType } from '@prisma/client';

export const mockTransferDetail = {
  id: 1,
  fromAccountId: 1,
  toAccountId: 2,
  createdDate: new Date('2026-01-01'),
  updateDate: new Date('2026-01-01'),
  fromAccount: {
    id: 1,
    name: 'Conto N26',
    startingBalance: 1500.0,
    userId: 1,
    colorId: 1,
    bankTypeId: 1,
    bankAccountTypeId: 1,
    createdDate: new Date('2026-01-01'),
    updateDate: new Date('2026-01-01'),
  },
  toAccount: {
    id: 2,
    name: 'Conto Risparmio',
    startingBalance: 5000.0,
    userId: 1,
    colorId: 2,
    bankTypeId: 1,
    bankAccountTypeId: 2,
    createdDate: new Date('2026-01-01'),
    updateDate: new Date('2026-01-01'),
  },
  transactions: [],
};

export const mockBankAccount2 = {
  id: 2,
  name: 'Conto Risparmio',
  startingBalance: 5000.0,
  userId: 1,
  colorId: 2,
  bankTypeId: 1,
  bankAccountTypeId: 2,
  createdDate: new Date('2026-01-01'),
  updateDate: new Date('2026-01-01'),
};

export const createTransferDto = {
  amount: 500.0,
  date: '2026-02-19',
  description: 'Trasferimento risparmio',
  note: '',
  fromAccountId: 1,
  toAccountId: 2,
};
