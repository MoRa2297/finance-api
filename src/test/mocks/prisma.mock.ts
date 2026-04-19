import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';

/**
 * Deep-mocked Prisma client used in unit tests.
 *
 * All methods are automatically typed and `.mockResolvedValue(...)` returns
 * the correct Prisma return type, so tests don't need manual casts.
 *
 * Call `resetPrismaMock()` in a global `beforeEach` to reset all mocks
 * between tests.
 */
export const mockPrismaService: DeepMockProxy<PrismaClient> =
  mockDeep<PrismaClient>();

export const resetPrismaMock = (): void => {
  mockReset(mockPrismaService);
};
