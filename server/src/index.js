const express = require('express');
const cors = require('cors');
const auditLogsRouter = require('./routes/auditLogs');
const { PORT } = require('./config');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/audit-logs', auditLogsRouter);

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Audit logs server listening on http://localhost:${PORT}`);
});
