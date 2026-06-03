const express = require('express');
const { listAuditLogs } = require('../services/auditLogService');

const router = express.Router();

router.get('/', async (request, response, next) => {
  try {
    const auditLogs = await listAuditLogs({
      search: request.query.search,
      startDate: request.query.startDate,
      endDate: request.query.endDate,
      sortField: request.query.sortField,
      sortDirection: request.query.sortDirection,
    });
    response.json({ auditLogs });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
