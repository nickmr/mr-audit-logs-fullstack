const { getPrismaClient } = require('../db/client');
const { BadRequestError } = require('../errors');

// query fields (all optional):
//   - search:    string, case-insensitive match on readableAction
//   - startDate: ISO 8601, inclusive lower bound on timestamp
//   - endDate:   ISO 8601, inclusive upper bound on timestamp
// For invalid input, `throw new BadRequestError(msg)` — returned as 400.
async function listAuditLogs(query = {}) {
  const prisma = getPrismaClient();

  // TODO: Implementation here.

  // Prisma: findMany({ where: { fieldName: { contains, gte, lte } } })
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
