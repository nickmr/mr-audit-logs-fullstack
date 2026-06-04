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
    const shiftTimestamp = buildTimestampShifter(records);
    await prisma.auditLog.createMany({
      data: records.map((record) => toAuditLogRow(record, shiftTimestamp)),
    });
    console.log(`Seeded ${records.length} audit logs.`);
  } finally {
    await prisma.$disconnect();
  }
}

function loadSeedRecords() {
  return JSON.parse(fs.readFileSync(SEED_FILE, 'utf8'));
}

// Anchor the most recent seed entry to "now" so candidates see fresh
// timestamps regardless of when the repo was set up.
function buildTimestampShifter(records) {
  const epochs = records.map((record) => new Date(record.timestamp).getTime());
  const latest = Math.max(...epochs);
  const offset = Date.now() - latest;
  return (originalIsoString) => new Date(new Date(originalIsoString).getTime() + offset);
}

function toAuditLogRow(record, shiftTimestamp) {
  return {
    id: record.id,
    timestamp: shiftTimestamp(record.timestamp),
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
