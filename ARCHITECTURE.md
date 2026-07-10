# Architecture

Pulse is a single Next.js 16 application (App Router, React Server Components) backed by PostgreSQL.
This document explains how the pieces fit together and why.

## Overview

```
                    ┌─────────────────────────────────────────┐
   Browser  ◀──SSE──│  Next.js app (RSC + Server Actions)      │
      │             │                                          │
      ▼             │  ┌────────────┐   ┌───────────────────┐  │
  Dashboard ───────▶│  │ App routes │   │ Server actions    │  │
  Status page       │  │ API routes │   │ (auth, monitors,  │  │
                    │  └─────┬──────┘   │  incidents, …)    │  │
                    │        │          └─────────┬─────────┘  │
                    │        ▼                    ▼            │
                    │   ┌─────────────────────────────────┐   │
                    │   │ Domain logic (src/lib)           │   │
                    │   │ monitoring · notifications ·      │   │
                    │   │ billing · auth                    │   │
                    │   └───────────────┬─────────────────┘   │
                    └───────────────────┼─────────────────────┘
                                        ▼
             ┌─────────────┐     ┌────────────┐     ┌──────────────┐
   Cron ────▶│ check runner│────▶│ PostgreSQL │────▶│ pg_notify /  │──▶ SSE
             └─────────────┘     └────────────┘     │  LISTEN      │
                                        │            └──────────────┘
                                        ▼
                            Resend (email) · Webhooks · Stripe
```

## Tech choices

| Concern   | Choice                           | Rationale                                            |
| --------- | -------------------------------- | ---------------------------------------------------- |
| Framework | Next.js 16 (App Router, RSC)     | One codebase; server-first data fetching + mutations |
| Language  | TypeScript                       | End-to-end type safety across DB, server, and UI     |
| Database  | PostgreSQL + Prisma 7            | Relational integrity; type-safe queries + migrations |
| Auth      | Auth.js v5 (JWT sessions)        | Self-owned sessions + RBAC, credentials + OAuth      |
| Real-time | SSE + Postgres `LISTEN/NOTIFY`   | Push updates with no extra infrastructure            |
| Payments  | Stripe                           | Checkout, subscriptions, and a hosted billing portal |
| Email     | Resend                           | Simple transactional email                           |
| Styling   | Tailwind CSS v4 + CVA            | A small, hand-built design system                    |
| Testing   | Vitest (unit) + Playwright (e2e) | Fast unit checks + real-browser end-to-end coverage  |

## Data model

```
User ─┬─< Membership >─┬─ Organization ─┬─< Monitor ─┬─< Check
      │  (role)        │  (plan, stripe) │            └─< Incident
      └─ Account/Session (Auth.js)       └─< AlertChannel
```

- **Organization** is the tenant boundary. Every monitor, alert channel, and subscription belongs to one.
- **Membership** carries the user's `Role` (OWNER > ADMIN > MEMBER), enforced by `hasRole()`.
- **Check** is an append-only time series; **Incident** is derived from consecutive check outcomes.

## Key flows

### Check execution (`src/lib/monitoring`)

1. A scheduler (Vercel Cron or any HTTP caller) hits `GET /api/cron/run-checks`.
2. `runDueChecks()` selects active monitors whose interval has elapsed.
3. For each, `performCheck()` issues an HTTP request with a timeout and records status + latency.
4. `runMonitorCheck()` persists the `Check`, updates the monitor's derived status, and applies any
   incident transition — all in a single transaction.

### Incident state machine (`incidents.ts`)

`evaluateIncidentTransition()` is a pure function: a failing check with no open incident **opens** one;
a passing check with an open incident **resolves** it. This keeps the lifecycle testable in isolation
from the database.

### Real-time (`runner.ts` → `/api/orgs/[orgId]/events`)

After each check the runner calls `pg_notify('monitor_events', …)`. The SSE endpoint holds a dedicated
`LISTEN` connection and streams org-scoped events; the dashboard subscribes with `EventSource` and
refreshes its server components. **This requires a persistent Node server** (see Deployment).

### Alerting (`src/lib/notifications`)

On an incident open/resolve, alerts fan out to the organization's active channels (email via Resend,
outbound webhooks). Dispatch is isolated in a `try/catch` so alerting can never break a check run.

### Billing (`src/lib/billing`, `/api/webhooks/stripe`)

Checkout and the billing portal are created via server actions (owner-only). A signed Stripe webhook
keeps each organization's `plan` and subscription status in sync. Monitor creation enforces the plan's
`monitorLimit`.

## Deployment

Because real-time relies on a long-lived `LISTEN` connection, deploy to a **persistent Node server**
(the included `Dockerfile` builds Next.js standalone output) rather than short-lived serverless
functions. Scheduled checks can be driven by any external cron hitting `/api/cron/run-checks` with the
`CRON_SECRET` bearer token.
