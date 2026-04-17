import { CategoryType } from '@prisma/client';

export const mockCategory = {
  id: 1,
  name: 'Spesa',
  type: CategoryType.EXPENSE,
  userId: 1,
  colorId: 1,
  iconId: 1,
  createdDate: new Date('2026-01-01'),
  updateDate: new Date('2026-01-01'),
};

export const createCategoryDto = {
  name: 'Spesa',
  type: CategoryType.EXPENSE,
  colorId: 1,
  iconId: 1,
};

export const updateCategoryDto = {
  name: 'Spesa Aggiornata',
};
