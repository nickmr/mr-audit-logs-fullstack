# Audit Logs Full-Stack Interview

A small app for browsing audit logs. The repo has two pieces:

- `client/` is the React + MUI frontend. It displays audit logs in a `DataGrid` with a search input.
- `server/` is the Node + Express + Prisma backend. It serves audit logs from a seeded SQLite database.

The frontend already calls the backend (`GET /api/audit-logs`), but **nothing is actually wired up yet:**

- The search input sends a `search` query param to the API, but the API ignores it. Typing in the search box will not filter the table.
- The API accepts `startDate`, `endDate`, `sortField`, and `sortDirection` and ignores those too.
- There is no date range picker on the page.

The objectives below walk through implementing the missing pieces.

## Quick start

First-time setup (installs deps, runs the migration, seeds the DB):

```bash
make setup
```

Then run both servers in one terminal:

```bash
make dev          # client on :3000, server on :3001, Ctrl+C stops both
```

Or in two terminals, if you prefer separate logs:

```bash
make server       # http://localhost:3001
make client       # http://localhost:3000
```

The dev server proxies `/api/*` to `http://localhost:3001`, so the frontend talks to the backend without CORS gymnastics.

Run `make help` to see the rest of the targets (migrate, seed, reset-db, test, clean).

## Objectives

Work through these in order. The frontend objective depends on the backend supporting date range filtering.

### 1. Backend filtering and sorting

`GET /api/audit-logs` accepts these query params but ignores all of them today:

| Param           | Type                                              | Behavior                                                      |
| --------------- | ------------------------------------------------- | ------------------------------------------------------------- |
| `search`        | string                                            | Case-insensitive match on `readableAction`                    |
| `startDate`     | ISO 8601 string                                   | Inclusive lower bound on `timestamp`                          |
| `endDate`       | ISO 8601 string                                   | Inclusive upper bound on `timestamp`                          |
| `sortField`     | `timestamp` \| `action` \| `userEmail`            | Column to sort by                                             |
| `sortDirection` | `asc` \| `desc`                                   | Sort direction                                                |

**Wire the params up in [`server/src/services/auditLogService.js`](server/src/services/auditLogService.js)** — `listAuditLogs` has a TODO comment with the available query fields and the Prisma syntax to use. The handler in [`server/src/routes/auditLogs.js`](server/src/routes/auditLogs.js) already forwards them, so you shouldn't need to touch it. The Prisma schema lives in [`server/prisma/schema.prisma`](server/prisma/schema.prisma).

A test suite at [`server/src/services/auditLogService.test.js`](server/src/services/auditLogService.test.js) doubles as the spec. Run `make test` and make them all green. Add more cases if you see something worth covering.

Anything else we should consider?

### 2. Frontend DateRangePicker

**Add MUI's `DateRangePicker` next to the search box** on [`client/src/pages/AuditLogsPage.jsx`](client/src/pages/AuditLogsPage.jsx). Picking a range should filter the table by hitting the `startDate` and `endDate` params from step 1.

![goal](./docs/goal.png)

The hook at [`client/src/api/useQueryAuditLogs.js`](client/src/api/useQueryAuditLogs.js) already accepts a `dateRange` arg and forwards it to the API. You just need to plumb the picker's value into it.

### 3. Refactor the frontend

There's a lot of tech debt at MR. The frontend in this example was built in a similarly messy way. How would you clean things up?
