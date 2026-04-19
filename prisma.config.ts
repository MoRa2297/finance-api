import 'dotenv/config';
import { defineConfig } from 'prisma/config';
import { PrismaPg } from '@prisma/adapter-pg';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  adapter: async () => {
    const direct = process.env.DIRECT_URL;
    const main = process.env.DATABASE_URL;
    const connectionString = direct ?? main;

    // Debug (masks password for safety)
    const mask = (url?: string) =>
      url?.replace(/:[^:@]+@/, ':***@') ?? '<unset>';

    console.log('[prisma.config] DIRECT_URL   =', mask(direct));
    console.log('[prisma.config] DATABASE_URL =', mask(main));
    console.log('[prisma.config] → using      =', mask(connectionString));

    if (!connectionString) {
      throw new Error(
        'DIRECT_URL or DATABASE_URL must be defined in the environment',
      );
    }

    return new PrismaPg({ connectionString });
  },
});
