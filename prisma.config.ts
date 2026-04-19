import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// Prisma CLI (migrate, db push, studio) needs a DIRECT connection,
// not a pooled one. In production we have:
//   - DATABASE_URL = Supabase Transaction pooler (port 6543)  → for the app runtime
//   - DIRECT_URL   = Supabase Direct connection   (port 5432) → for migrations
//
// In development we typically have only DATABASE_URL pointing to local Postgres.

const migrationUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? '';

// Debug (masks password)
const mask = (url?: string) => url?.replace(/:[^:@]+@/, ':***@') ?? '<unset>';

console.log('[prisma.config] DIRECT_URL   =', mask(process.env.DIRECT_URL));
console.log('[prisma.config] DATABASE_URL =', mask(process.env.DATABASE_URL));
console.log('[prisma.config] → migrate will use:', mask(migrationUrl));

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts',
  },
  datasource: {
    url: migrationUrl,
  },
});
