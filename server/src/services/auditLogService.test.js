const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { listAuditLogs } = require('./auditLogService');

describe('listAuditLogs', () => {
  describe('filtering', () => {
    test('returns all rows when no filters are supplied', async () => {
      const rows = await listAuditLogs();
      assert.equal(rows.length, 22);
    });

    test('filters by readableAction substring (case-insensitive)', async () => {
      const rows = await listAuditLogs({ search: 'PIPELINE' });
      assert.equal(rows.length, 3);
      assert.ok(rows.every((row) => row.readableAction === 'Pipeline Created'));
    });

    test('filters by startDate (inclusive)', async () => {
      const rows = await listAuditLogs({ startDate: '2024-08-07T00:00:00Z' });
      assert.ok(rows.every((row) => new Date(row.timestamp) >= new Date('2024-08-07T00:00:00Z')));
    });

    test('filters by endDate (inclusive)', async () => {
      const rows = await listAuditLogs({ endDate: '2024-08-02T00:00:00Z' });
      assert.ok(rows.every((row) => new Date(row.timestamp) <= new Date('2024-08-02T00:00:00Z')));
    });

    test('combines search and date range', async () => {
      const rows = await listAuditLogs({
        search: 'pipeline',
        startDate: '2024-08-06T00:00:00Z',
        endDate: '2024-08-08T00:00:00Z',
      });
      assert.equal(rows.length, 1);
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
