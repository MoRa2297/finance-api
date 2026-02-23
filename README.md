# Finance API

Personal finance management REST and GraphQL API built with NestJS, Prisma 7, and PostgreSQL.

![CI](https://github.com/YOUR_USERNAME/finance-api/actions/workflows/ci.yml/badge.svg)

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL (Supabase in production)
- **ORM**: Prisma 7
- **Auth**: JWT with Passport
- **API**: REST + GraphQL (Apollo)
- **Testing**: Jest with coverage reporting
- **Deploy**: Railway (auto-deploy from `release` branch)

## Architecture
```
src/
├── auth/          # Authentication (register, login, profile)
├── lookup/        # Static data (colors, icons, bank types)
├── category/      # User categories with ownership
├── bank-account/  # Bank accounts with ownership
├── card-account/  # Card accounts with ownership
├── transaction/   # Transactions with filters and pagination
├── health/        # Health check endpoint
├── common/        # Guards, decorators, filters, interceptors
├── config/        # Typed configuration
└── prisma/        # Database service
```

## Getting Started

### Prerequisites

- Node.js 20+
- Docker (for local PostgreSQL)

### Installation
```bash
npm install
```

### Environment Variables

Copy `.env.production.example` to `.env` and fill in the values:
```bash
cp .env.production.example .env
```

### Database
```bash
# Start local PostgreSQL
npm run db:start

# Push schema
npm run db:push

# Seed database
npm run db:seed
```

### Running
```bash
# Development
npm run start:dev

# Production
npm run start:prod
```

### Testing
```bash
# Run tests with coverage
npm run test
```

## API Documentation

- **Swagger**: `http://localhost:3000/api/docs` (development only)
- **GraphQL Playground**: `http://localhost:3000/graphql` (development only)

## Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /auth/register | Register new user | ❌ |
| POST | /auth/login | Login | ❌ |
| GET | /auth/me | Get current user | ✅ |
| PUT | /auth/profile | Update profile | ✅ |
| PUT | /auth/change-password | Change password | ✅ |
| DELETE | /auth/profile | Delete account | ✅ |
| GET | /lookup/colors | Get all colors | ✅ |
| GET | /lookup/category-icons | Get all icons | ✅ |
| GET | /lookup/bank-types | Get all bank types | ✅ |
| GET | /lookup/bank-account-types | Get all account types | ✅ |
| GET | /lookup/card-types | Get all card types | ✅ |
| GET | /categories | Get user categories | ✅ |
| POST | /categories | Create category | ✅ |
| GET | /categories/:id | Get category | ✅ |
| PUT | /categories/:id | Update category | ✅ |
| DELETE | /categories/:id | Delete category | ✅ |
| GET | /bank-accounts | Get user bank accounts | ✅ |
| POST | /bank-accounts | Create bank account | ✅ |
| GET | /bank-accounts/:id | Get bank account | ✅ |
| PUT | /bank-accounts/:id | Update bank account | ✅ |
| DELETE | /bank-accounts/:id | Delete bank account | ✅ |
| GET | /cards | Get user cards | ✅ |
| POST | /cards | Create card | ✅ |
| GET | /cards/:id | Get card | ✅ |
| PUT | /cards/:id | Update card | ✅ |
| DELETE | /cards/:id | Delete card | ✅ |
| GET | /transactions | Get transactions (filtered) | ✅ |
| POST | /transactions | Create transaction | ✅ |
| GET | /transactions/:id | Get transaction | ✅ |
| PUT | /transactions/:id | Update transaction | ✅ |
| DELETE | /transactions/:id | Delete transaction | ✅ |
| GET | /health | Health check | ❌ |

## Git Workflow
```
main    → active development
release → production (auto-deploy to Railway)
```

## License

MIT
