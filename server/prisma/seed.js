const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const SEED_FILE = path.join(__dirname, '..', 'seed-data', 'audit-logs.json');

async function main() {
  const prisma = new PrismaClient();
  try {
    const existingCount = await prisma.auditLog.count();
    if (existingCount > 0) {
      console.log(`Skipping seed — ${existingCount} audit logs already present.`);
      return;
    }
    const records = loadSeedRecords();
    await prisma.auditLog.createMany({ data: records.map(toAuditLogRow) });
    console.log(`Seeded ${records.length} audit logs.`);
  } finally {
    await prisma.$disconnect();
  }
}

function loadSeedRecords() {
  return JSON.parse(fs.readFileSync(SEED_FILE, 'utf8'));
}

function toAuditLogRow(record) {
  return {
    id: record.id,
    timestamp: new Date(record.timestamp),
    action: record.action,
    readableAction: record.readableAction,
    description: record.description || '',
    userName: record.user.name,
    userEmail: record.user.email,
  };
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
