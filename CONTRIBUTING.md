# Contributing to Pulse

Thanks for your interest in Pulse. This guide covers local setup and the conventions used across the
codebase.

## Local development

**Requirements:** Node.js 22+, PostgreSQL (local or [Neon](https://neon.tech)).

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL and secrets
npm run db:migrate
npm run dev
```

## Project layout

```
src/
├── app/            # App Router routes (dashboard, public status pages, API routes)
├── components/     # Reusable UI components
├── lib/            # Domain logic (auth, db, monitoring, billing, real-time)
├── server/         # Server-only actions & services
└── test/           # Test setup & utilities
prisma/
└── schema.prisma   # Database schema & migrations
```

## Conventions

### Code style

- TypeScript everywhere; prefer explicit types at module boundaries.
- Formatting is enforced by Prettier — run `npm run format` before committing.
- Linting via ESLint — `npm run lint`.

### Commits

- We follow [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `chore:`,
  `refactor:`, `test:`, `docs:`.
- Keep commits focused and self-contained — each should pass CI on its own.

### Testing

- Unit tests with Vitest (`npm run test`), colocated as `*.test.ts(x)`.
- End-to-end tests with Playwright in `e2e/` — run with `npm run test:e2e`.
- New behavior should ship with tests.

### Database

- The schema lives in `prisma/schema.prisma`.
- Create migrations with `npm run db:migrate` and commit them alongside the code that needs them.

## Before opening a pull request

Run the full local check — the same steps CI runs:

```bash
npm run format && npm run lint && npm run typecheck && npm run test && npm run build
```
