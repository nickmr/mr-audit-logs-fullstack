const { getPrismaClient } = require('../db/client');
const { BadRequestError } = require('../errors');

async function listAuditLogs(query = {}) {
  const prisma = getPrismaClient();

  // TODO(candidate): apply `search`, `startDate`, `endDate`, `sortField`,
  // and `sortDirection` from `query` to the findMany call below.
  //
  // Available query fields:
  //   - search:        string (case-insensitive match on readableAction)
  //   - startDate:     ISO 8601 string (inclusive lower bound on timestamp)
  //   - endDate:       ISO 8601 string (inclusive upper bound on timestamp)
  //   - sortField:     'timestamp' | 'action' | 'userEmail'
  //   - sortDirection: 'asc' | 'desc'
  //
  // Prisma syntax pointers:
  //   prisma.auditLog.findMany({ where, orderBy })
  //   where:   { fieldName: { contains: 'foo', gte: date, lte: date } }
  //   orderBy: { fieldName: 'asc' | 'desc' }
  //
  // For bad input, `throw new BadRequestError('msg')`. The global error
  // handler will turn it into a 400 response.
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
