# Contributing to Finance API

Thanks for your interest in contributing! This project is primarily maintained by [@MoRa2297](https://github.com/MoRa2297), but external contributions are welcome.

> **Note:** All PRs require approval from [@MoRa2297](https://github.com/MoRa2297) before merging. CI passing is necessary but not sufficient.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Reporting bugs](#reporting-bugs)
- [Requesting features](#requesting-features)
- [Development setup](#development-setup)
- [Project structure](#project-structure)
- [Coding standards](#coding-standards)
- [Commit conventions](#commit-conventions)
- [Pull request process](#pull-request-process)
- [Testing](#testing)
- [Security issues](#security-issues)

## Code of Conduct

This project adheres to a [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you're expected to uphold it.

## Reporting bugs

Before opening a bug report:

1. **Search existing issues** to avoid duplicates
2. **Verify on the latest `main`** — the bug might already be fixed
3. **Use the bug report template** when opening a new issue

Include reproduction steps, expected vs actual behavior, environment details, and logs if applicable.

## Requesting features

1. **Open a discussion first** if you're unsure whether the feature fits the project scope
2. **Use the feature request template** for concrete proposals
3. Wait for maintainer feedback before starting work on large features — this avoids wasted effort if the proposal isn't a good fit

## Development setup

### Prerequisites

- Node.js 20.x
- Docker & Docker Compose (for local Postgres)
- npm 10.x+

### Setup

```bash
# 1. Fork and clone
git clone https://github.com/<your-username>/finance-api.git
cd finance-api

# 2. Install dependencies
npm install

# 3. Copy env file and fill in values
cp .env.production.example .env.development

# 4. Start local Postgres
npm run db:start

# 5. Run migrations
npm run db:migrate

# 6. Seed (optional)
npm run db:seed

# 7. Start dev server
npm run start:dev
```

The API runs on `http://localhost:3000` with Swagger at `/api/docs`.

### Keeping your fork in sync

```bash
git remote add upstream https://github.com/MoRa2297/finance-api.git
git fetch upstream
git checkout main
git merge upstream/main
```

## Project structure

```
finance-api/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   ├── workflows/
│   ├── CODEOWNERS
│   └── pull_request_template.md
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── auth/              # Authentication (JWT, Passport)
│   ├── bank-account/      # Bank accounts module
│   ├── card-account/      # Card accounts module
│   ├── category/          # User categories
│   ├── common/            # Shared: guards, interceptors, filters, decorators
│   ├── config/            # Typed config (@nestjs/config)
│   ├── health/            # Health check endpoint
│   ├── lookup/            # Static lookup data (colors, icons, bank types)
│   ├── prisma/            # Prisma service wrapper
│   ├── recurring/         # Recurring transactions (templates + generation)
│   ├── scheduler/         # Cron jobs (@nestjs/schedule) for recurring tasks
│   ├── test/              # Shared test helpers, fixtures, factory functions
│   ├── transaction/       # Transactions module (REST + GraphQL surface)
│   ├── transaction-core/  # Transaction business logic (shared between transaction/ and recurring/)
│   ├── app.module.ts
│   ├── app.resolver.ts
│   ├── main.ts
│   └── schema.gql         # Auto-generated GraphQL schema
└── test/                  # E2E tests (jest-e2e.json)
```

### Module conventions

Each feature module follows the NestJS pattern:

- `*.module.ts` — module definition
- `*.controller.ts` — REST endpoints
- `*.resolver.ts` — GraphQL resolvers
- `*.service.ts` — business logic
- `dto/` — DTOs with `class-validator` decorators
- `entities/` — Prisma entity types / GraphQL object types

### Where to put what

- **Pure business logic** → `*-core/` modules (like `transaction-core/`). No HTTP/GraphQL concerns, easily testable, reusable
- **HTTP/GraphQL surface** → feature modules (`transaction/`, `bank-account/`, etc.). Thin — they translate input/output and delegate to services
- **Cron/scheduled jobs** → `scheduler/`. Never put business logic here — call services from core modules
- **Test helpers** → `src/test/`. Fixtures, factory functions, mock builders used across `*.spec.ts` files
- **E2E tests** → root `test/` with `jest-e2e.json` config

## Coding standards

### TypeScript

- Strict mode is enabled — no `any` without a comment explaining why
- Prefer `type` for unions, `interface` for object shapes
- Use path aliases (`@auth/*`, `@common/*`, `@transaction-core/*`, `@test/*`, etc.) — see `tsconfig.json` and Jest `moduleNameMapper`

### Style

- **Formatter:** Prettier (config in `.prettierrc`)
- **Linter:** ESLint flat config (`eslint.config.mjs`)
- Run `npm run format` and `npm run lint` before committing
- CI will reject PRs that fail `npm run lint:check` or `npm run format:check`

### Naming

- Files: `kebab-case.ts` (e.g. `bank-account.service.ts`)
- Classes: `PascalCase`
- Functions/variables: `camelCase`
- Constants: `SCREAMING_SNAKE_CASE`
- DTOs: `CreateFooDto`, `UpdateFooDto`, `FooResponseDto`

### API design

- REST endpoints follow resource naming: `/transaction`, `/bank-account`
- All authenticated routes use `@UseGuards(JwtAuthGuard)`
- Input validation via `class-validator` DTOs with `@IsNotEmpty`, `@IsInt`, etc.
- Responses wrapped by `ResponseInterceptor` — return raw data from controllers
- Errors thrown as NestJS exceptions (`NotFoundException`, `ForbiddenException`, etc.)
- Ownership checks: never trust `userId` from the request body — always read from `req.user.id`

### Database

- **Never write raw SQL** with string concatenation — use Prisma query builder or parameterized `$queryRaw` with tagged templates
- New migrations: `npm run db:migrate -- --name <descriptive_name>`
- Migration names should be imperative and descriptive: `add_recurrent_flag_to_transaction`, not `update_schema`
- Never edit an applied migration — create a new one

### GraphQL

- `schema.gql` is **auto-generated** — don't edit it manually
- Define types with `@ObjectType()`, inputs with `@InputType()` decorators
- Keep resolvers thin: delegate to services, same pattern as REST controllers

## Commit conventions

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

| Type       | Use for                                           |
| ---------- | ------------------------------------------------- |
| `feat`     | New feature                                       |
| `fix`      | Bug fix                                           |
| `refactor` | Code change without new features or bug fixes     |
| `perf`     | Performance improvement                           |
| `test`     | Adding/updating tests                             |
| `docs`     | Documentation only                                |
| `chore`    | Build, deps, tooling                              |
| `ci`       | CI/CD changes                                     |
| `style`    | Formatting (no logic change)                      |

### Examples

```
feat(transaction): add date range filter
fix(auth): reject expired JWTs with 401 instead of 500
refactor(transaction-core): extract ownership check to shared helper
feat(scheduler): add daily cron for recurring transaction generation
docs(readme): clarify Railway deploy steps
chore(deps): bump @nestjs/core to 11.0.5
```

### Breaking changes

Add `!` after the type/scope, or a `BREAKING CHANGE:` footer:

```
feat(transaction)!: change money field from number to string

BREAKING CHANGE: Money is now a string to avoid float precision issues.
Clients must update their parsing logic.
```

## Pull request process

1. **Branch from `main`** — never from `release`
2. **Name the branch descriptively**: `feat/date-range-filter`, `fix/jwt-expiry-handling`
3. **Keep PRs focused** — one feature or one fix per PR. Large PRs are hard to review and will be asked to split
4. **Write tests** for new logic (unit + e2e where applicable)
5. **Update docs** if you change public APIs, env vars, or setup steps
6. **Fill in the PR template** — all relevant sections
7. **Ensure CI passes** — lint, typecheck, tests, build
8. **Request review** from `@MoRa2297` (auto-assigned via CODEOWNERS)
9. **Address feedback** with additional commits (don't force-push until approved)
10. After approval, the maintainer will merge (squash merge is default)

### PR review timeline

Best effort, since this is a solo-maintained project:

- First response: within 1 week
- Review iterations: depends on complexity
- Stale PRs (no response to feedback for 30+ days) may be closed with a note

## Testing

```bash
npm test                    # unit tests (fast, no DB)
npm run test:watch          # unit tests in watch mode
npm run test:cov            # with coverage summary
npm run test:e2e            # e2e tests (requires Postgres)
```

### Writing tests

- **Unit tests**: `*.spec.ts` next to the source file. Mock dependencies with Jest
- **E2E tests**: `test/*.e2e-spec.ts` in the root `test/` folder. Use a real Postgres via `docker-compose`
- **Shared helpers**: use `src/test/` (imported via `@test/*` alias) for fixtures, factory functions, mock builders reused across spec files
- **Coverage target**: services (especially `*-core/`) should have >80% coverage. Controllers/resolvers can be lighter since they're thin

### Testing recurring/scheduler logic

- `scheduler/` handlers should be tested by invoking the service method directly — **do not** rely on `@Cron` triggers in tests
- Use fake timers (`jest.useFakeTimers()`) when testing time-dependent recurrence logic
- Recurring transaction generation should have e2e coverage to catch timezone/date edge cases

## Security issues

**Do not open public issues for security vulnerabilities.** Follow the process in [SECURITY.md](./SECURITY.md).

## Questions

For general questions or discussion, open a [Discussion](https://github.com/MoRa2297/finance-api/discussions) rather than an issue.

Thanks for contributing! 🙏
