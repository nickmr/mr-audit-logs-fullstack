const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { listAuditLogs } = require('./auditLogService');

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

describe('listAuditLogs', () => {
  describe('filtering', () => {
    test('returns rows when no filters are supplied', async () => {
      const rows = await listAuditLogs();
      assert.ok(rows.length > 0, 'seed data should produce at least one row');
    });

    test('filters by readableAction substring (case-insensitive)', async () => {
      const rows = await listAuditLogs({ search: 'PIPELINE' });
      assert.ok(rows.length > 0, 'seed data should include matching rows');
      assert.ok(
        rows.every((row) => row.readableAction.toLowerCase().includes('pipeline')),
        'every returned row should match the search term'
      );
    });

    test('filters by startDate (inclusive)', async () => {
      const threshold = new Date(Date.now() - 2 * ONE_DAY_MS);
      const rows = await listAuditLogs({ startDate: threshold.toISOString() });
      assert.ok(rows.length > 0, 'seed data should include rows within the last 2 days');
      assert.ok(rows.every((row) => new Date(row.timestamp) >= threshold));
    });

    test('filters by endDate (inclusive)', async () => {
      const threshold = new Date(Date.now() - 2 * ONE_DAY_MS);
      const rows = await listAuditLogs({ endDate: threshold.toISOString() });
      assert.ok(rows.length > 0, 'seed data should include rows older than 2 days');
      assert.ok(rows.every((row) => new Date(row.timestamp) <= threshold));
    });

    test('combines search and date range', async () => {
      const startDate = new Date(Date.now() - 7 * ONE_DAY_MS);
      const rows = await listAuditLogs({
        search: 'pipeline',
        startDate: startDate.toISOString(),
      });
      assert.ok(rows.length > 0, 'seed data should include pipeline events in the last week');
      assert.ok(rows.every((row) =>
        row.readableAction.toLowerCase().includes('pipeline')
        && new Date(row.timestamp) >= startDate
      ));
    });
  });

  describe('sorting', () => {
    test('defaults to timestamp desc', async () => {
      const rows = await listAuditLogs();
      const timestamps = rows.map((row) => row.timestamp);
      const sorted = [...timestamps].sort().reverse();
      assert.deepEqual(timestamps, sorted);
    });

    test('sorts by action asc', async () => {
      const rows = await listAuditLogs({ sortField: 'action', sortDirection: 'asc' });
      const actions = rows.map((row) => row.action);
      assert.deepEqual(actions, [...actions].sort());
    });

    test('sorts by userEmail desc', async () => {
      const rows = await listAuditLogs({ sortField: 'userEmail', sortDirection: 'desc' });
      const emails = rows.map((row) => row.user.email);
      assert.deepEqual(emails, [...emails].sort().reverse());
    });
  });

  describe('validation', () => {
    test('rejects unknown sortField (including injection attempts)', async () => {
      await assert.rejects(
        () => listAuditLogs({ sortField: "'; DROP TABLE audit_logs" }),
        { name: 'BadRequestError' }
      );
    });

    test('rejects unknown sortDirection', async () => {
      await assert.rejects(
        () => listAuditLogs({ sortDirection: 'sideways' }),
        { name: 'BadRequestError' }
      );
    });

    test('rejects unparseable startDate', async () => {
      await assert.rejects(
        () => listAuditLogs({ startDate: 'yesterday' }),
        { name: 'BadRequestError' }
      );
    });

    test('rejects unparseable endDate', async () => {
      await assert.rejects(
        () => listAuditLogs({ endDate: 'tomorrow' }),
        { name: 'BadRequestError' }
      );
    });
  });
});
