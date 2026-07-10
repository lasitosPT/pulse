# Pulse

> Uptime & status monitoring for modern teams — real-time incident detection, alerting that actually reaches you, and branded public status pages.

[![CI](https://github.com/lasitosPT/pulse/actions/workflows/ci.yml/badge.svg)](https://github.com/lasitosPT/pulse/actions/workflows/ci.yml)
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)
![License: MIT](https://img.shields.io/badge/license-MIT-green)

**Status:** 🚧 Active development

Pulse continuously checks your HTTP endpoints, detects incidents the moment they happen, and keeps
your team and your users informed through real-time dashboards, alerts, and shareable status pages.

## Features

- **Endpoint monitoring** — scheduled HTTP/HTTPS checks with configurable intervals, timeouts, and
  expected status codes.
- **Real-time dashboard** — live monitor status and incident updates streamed over Server-Sent Events.
- **Incident engine** — automatic incident open → acknowledge → resolve lifecycle backed by an explicit
  state machine.
- **Uptime & latency analytics** — time-series charts for response time and availability (SLA %).
- **Alerting** — email (Resend) and outbound webhook notifications the moment something breaks.
- **Public status pages** — branded, shareable status pages per organization.
- **Teams & roles** — multi-tenant organizations with role-based access control.
- **Billing** — Stripe subscriptions with plan-based usage limits.

## Tech stack

| Layer     | Choice                         | Why                                         |
| --------- | ------------------------------ | ------------------------------------------- |
| Framework | Next.js 16 (App Router, RSC)   | One codebase, server-first rendering        |
| Language  | TypeScript                     | End-to-end type safety                      |
| Database  | PostgreSQL (Neon)              | Reliable relational store, serverless-ready |
| ORM       | Prisma 7                       | Type-safe data access + migrations          |
| Auth      | Auth.js v5                     | Self-hosted sessions + RBAC                 |
| Real-time | SSE + Postgres `LISTEN/NOTIFY` | Live updates without extra infrastructure   |
| Payments  | Stripe                         | Subscriptions + hosted billing portal       |
| Email     | Resend                         | Transactional alerts                        |
| Styling   | Tailwind CSS v4                | Utility-first, fast iteration               |
| Testing   | Vitest + Playwright            | Unit + end-to-end                           |
| CI        | GitHub Actions                 | Lint, typecheck, test, build on every push  |

## Getting started

### Prerequisites

- Node.js 22+
- A PostgreSQL database (local or [Neon](https://neon.tech))

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
#   → fill in DATABASE_URL and secrets

# 3. Apply the database schema
npm run db:migrate

# 4. Start the dev server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command              | Description                       |
| -------------------- | --------------------------------- |
| `npm run dev`        | Start the development server      |
| `npm run build`      | Production build                  |
| `npm run start`      | Serve the production build        |
| `npm run lint`       | Lint with ESLint                  |
| `npm run typecheck`  | Type-check with `tsc --noEmit`    |
| `npm run test`       | Run unit tests (Vitest)           |
| `npm run format`     | Format the codebase with Prettier |
| `npm run db:migrate` | Apply database migrations         |
| `npm run db:studio`  | Open Prisma Studio                |

## Architecture

Pulse is a single Next.js application using the App Router and React Server Components. Scheduled
checks run as background jobs that write time-series results to Postgres; an incident state machine
derives incidents from consecutive failures, and the dashboard subscribes to changes in real time via
Server-Sent Events fed by Postgres `LISTEN/NOTIFY`.

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

## Roadmap

- [x] Project foundation — Next.js, Prisma, tooling, CI
- [x] Design system, theming & landing page
- [x] Auth & multi-tenant teams (Auth.js v5, RBAC)
- [x] Monitors & scheduled checks
- [x] Incident engine, charts & real-time dashboard (SSE)
- [x] Alerting (email + webhooks) & public status pages
- [x] Stripe billing (plans, checkout, webhooks, portal)
- [ ] Production deploy

## License

Released under the [MIT License](LICENSE).
