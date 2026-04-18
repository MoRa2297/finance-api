# Security Policy

## Supported Versions

This project is under active development. Only the latest version on the `release` branch receives security updates.

| Version       | Supported          |
| ------------- | ------------------ |
| `release` (latest) | ✅                 |
| `main` (dev)  | ⚠️ Best effort     |
| Older commits | ❌                 |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues, discussions, or pull requests.**

Instead, report them privately via one of these channels:

### Preferred: GitHub Private Vulnerability Reporting

1. Go to the [Security tab](https://github.com/MoRa2297/finance-api/security) of this repository
2. Click **"Report a vulnerability"**
3. Fill in the form with details

This keeps the report private between you and the maintainer, and gives you a tracked thread.

### Alternative: Email

If you prefer email, contact `@MoRa2297` directly via GitHub. Do **not** include vulnerability details in your first message — just request a secure channel.

## What to include

To help triage quickly, please include:

- **Type of issue** (e.g. SQL injection, auth bypass, XSS, RCE, information disclosure)
- **Affected endpoint or module** (e.g. `POST /transaction`, `auth/jwt.strategy.ts`)
- **Steps to reproduce** — request payload, headers, sequence of actions
- **Impact** — what can an attacker achieve?
- **Your environment** — API version/commit, Node version
- **Suggested fix** (optional but appreciated)

## Response timeline

Since this is a solo-maintained project, response times are best-effort:

| Stage                | Target                      |
| -------------------- | --------------------------- |
| Initial response     | Within 72 hours             |
| Severity assessment  | Within 7 days               |
| Fix for critical issues | Within 14 days           |
| Fix for non-critical | Next scheduled release      |
| Public disclosure    | After fix is deployed       |

## Disclosure policy

- I follow **coordinated disclosure**: the vulnerability stays private until a fix is released
- Once fixed, a security advisory is published via GitHub's Security Advisories
- Reporters are credited in the advisory unless they prefer to remain anonymous
- No bug bounty program — this is a personal project

## Out of scope

The following are **not** considered security vulnerabilities for this project:

- Issues requiring physical access to a user's device
- Self-XSS (requires victim to paste attacker-controlled code into their own console)
- Social engineering attacks
- Missing security headers with no demonstrable exploit
- Rate limiting bypass on endpoints that already have `@Throttle` applied (report as a feature request instead)
- Vulnerabilities in third-party dependencies without a demonstrated exploit in this project's context — please report those upstream

## Security best practices for contributors

If you're contributing code, please:

- Never commit secrets, API keys, or `.env` files
- Never log user passwords, JWTs, or other credentials
- Always use Prisma's parameterized queries (never raw SQL with string concatenation)
- Validate all user input with `class-validator` DTOs
- Use `@UseGuards(JwtAuthGuard)` on all authenticated endpoints

Thanks for helping keep this project secure.
