const { getPrismaClient } = require('../db/client');

async function listAuditLogs(query = {}) {
  const prisma = getPrismaClient();

  // TODO(candidate): implement filtering by `search`, `startDate`, `endDate`
  // and sorting by `sortField` + `sortDirection`. Use `query` to drive a
  // Prisma findMany call against the `audit_logs` table.
  //
  // Available query fields:
  //   - search:        string — case-insensitive match on readableAction
  //   - startDate:     ISO 8601 string — inclusive lower bound on timestamp
  //   - endDate:       ISO 8601 string — inclusive upper bound on timestamp
  //   - sortField:     'timestamp' | 'readableAction' | 'userEmail'
  //   - sortDirection: 'asc' | 'desc'
  const rows = await prisma.auditLog.findMany();

  return rows.map(toApiShape);
}

function toApiShape(row) {
  return {
    id: row.id,
    timestamp: row.timestamp.toISOString(),
    action: row.action,
    readableAction: row.readableAction,
    description: row.description,
    user: {
      name: row.userName,
      email: row.userEmail,
    },
  };
}

module.exports = { listAuditLogs };
