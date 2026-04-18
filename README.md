# Finance API

[![CI](https://github.com/MoRa2297/finance-api/actions/workflows/ci.yml/badge.svg)](https://github.com/MoRa2297/finance-api/actions/workflows/ci.yml)
[![Deploy](https://github.com/MoRa2297/finance-api/actions/workflows/deploy.yml/badge.svg)](https://github.com/MoRa2297/finance-api/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Node](https://img.shields.io/badge/node-20.x-green.svg)](https://nodejs.org)

Backend API for a personal finance management app. Handles transactions, categories, bank/card accounts, budgets, and recurring transactions.

Built as a portfolio project — open source, MIT licensed.

## Tech stack

- **Framework:** [NestJS 11](https://nestjs.com/) (REST + GraphQL via Apollo)
- **Database:** PostgreSQL + [Prisma 7](https://www.prisma.io/)
- **Auth:** JWT + Passport
- **Validation:** `class-validator` + `class-transformer`
- **Docs:** Swagger (auto-generated, dev only)
- **Testing:** Jest (unit + e2e)
- **Deploy:** [Railway](https://railway.app/) — auto-deploy from `release` branch
- **DB hosting:** [Supabase](https://supabase.com/) (production)

## Quick start

### Prerequisites

- Node.js 20.x
- Docker & Docker Compose
- npm 10+

### Setup

```bash
# Clone and install
git clone https://github.com/MoRa2297/finance-api.git
cd finance-api
npm install

# Copy env template and fill in values
cp .env.production.example .env.development

# Start local Postgres
npm run db:start

# Run migrations and seed
npm run db:migrate
npm run db:seed

# Start dev server
npm run start:dev
```

The API runs on `http://localhost:3000`:

- Swagger: `http://localhost:3000/api/docs`
- GraphQL playground: `http://localhost:3000/graphql`
- Health: `http://localhost:3000/health`

## Scripts

| Script                 | Description                              |
| ---------------------- | ---------------------------------------- |
| `npm run start:dev`    | Dev server with hot reload               |
| `npm run build`        | Production build                         |
| `npm run lint`         | Lint with auto-fix                       |
| `npm run lint:check`   | Lint without fix (CI mode)               |
| `npm run format`       | Format with Prettier                     |
| `npm run typecheck`    | `tsc --noEmit`                           |
| `npm test`             | Unit tests                               |
| `npm run test:e2e`     | E2E tests (requires Postgres running)    |
| `npm run db:migrate`   | Apply Prisma migrations (dev)            |
| `npm run db:studio`    | Open Prisma Studio                       |
| `npm run db:seed`      | Seed database                            |

Full list in [`package.json`](./package.json).

## Project structure

```
src/
├── auth/              # JWT authentication
├── bank-account/      # Bank accounts
├── card-account/      # Card accounts
├── category/          # User categories
├── common/            # Shared: guards, interceptors, filters
├── config/            # Typed config
├── health/            # Health + readiness endpoints
├── lookup/            # Static lookup data (colors, icons, bank types)
├── prisma/            # Prisma service wrapper
├── recurring/         # Recurring transactions
├── scheduler/         # Cron jobs
├── test/              # Test helpers & fixtures
├── transaction/       # Transactions (REST + GraphQL)
└── transaction-core/  # Transaction business logic
```

## CI/CD

- **PRs to `main`/`release`**: full CI (lint, typecheck, unit, e2e with Postgres, build)
- **Push to `release`**: deploys to Railway after manual approval gate
- **Security updates**: handled automatically via Dependabot

Full setup details in [CICD.md](./CICD.md).

## Documentation

- [CICD.md](./CICD.md) — CI/CD setup and workflows
- [CONTRIBUTING.md](./CONTRIBUTING.md) — how to contribute
- [SECURITY.md](./SECURITY.md) — how to report vulnerabilities
- [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) — community guidelines

## Contributing

External contributions are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full workflow, coding standards, and PR process.

All PRs require approval from [@MoRa2297](https://github.com/MoRa2297).

## License

[MIT](./LICENSE) © 2026 Manuel Rossi ([@MoRa2297](https://github.com/MoRa2297))
