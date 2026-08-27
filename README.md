# Audit Logs Full-Stack Interview

A small app for browsing audit logs.

## Quick start

```bash
make start
```

## The end result

![goal](./docs/goal.png)

The starter has this scaffolded but **nothing is wired up yet** — typing in the search box doesn't filter, there's no date range picker, and the API ignores every query param. Two steps to get there:

1. **Update the backend API** to fill in the implementation from the scaffold.
2. **Update the UI** to look like the screenshot above.

## Objectives

### 1. Backend filtering

`GET /api/audit-logs` accepts these query params but ignores them today:

| Param       | Type              | Behavior                                        |
| ----------- | ----------------- | ----------------------------------------------- |
| `search`    | string            | Case-insensitive match on `readableAction`      |
| `startDate` | ISO 8601 string   | Inclusive lower bound on `timestamp`            |
| `endDate`   | ISO 8601 string   | Inclusive upper bound on `timestamp`            |

#### Your challenge

**Wire the params up in [`server/src/services/auditLogService.js`](server/src/services/auditLogService.js)** — `listAuditLogs` has a `// TODO` marker with inline Prisma syntax hints. The handler in [`server/src/routes/auditLogs.js`](server/src/routes/auditLogs.js) already forwards them, so you shouldn't need to touch it. The Prisma schema lives in [`server/prisma/schema.prisma`](server/prisma/schema.prisma).

A test suite at [`server/src/services/auditLogService.test.js`](server/src/services/auditLogService.test.js) doubles as the spec. Run `make test` and make them all green. Add more cases if you see something worth covering.

Anything else we should consider?

### 2. Frontend DateRangePicker

![goal](./docs/goal.png)

#### Your challenge

**Add MUI's `DateRangePicker` next to the search box** on [`client/src/pages/AuditLogsPage.jsx`](client/src/pages/AuditLogsPage.jsx). Picking a range should filter the table by hitting the `startDate` and `endDate` params from step 1.

The hook at [`client/src/api/useQueryAuditLogs.js`](client/src/api/useQueryAuditLogs.js) already accepts a `dateRange` arg and forwards it to the API. You just need to plumb the picker's value into it.

### 3. Refactor the frontend

There's a lot of tech debt at MR. The frontend in this example was built in a similarly messy way. How would you clean things up?

## Stack

- `client/` — React + MUI + Vite.
- `server/` — Node + Express + Prisma + SQLite.
