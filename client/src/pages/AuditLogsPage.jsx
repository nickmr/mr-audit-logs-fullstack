import React, { useState } from 'react';
import { Box, Stack, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DateRangePicker, LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LicenseInfo } from '@mui/x-license';
import useQueryAuditLogs from "../api/useQueryAuditLogs";

LicenseInfo.setLicenseKey('Xse7c1bbvzdreH3dtzlPPU1VSS1Eb2MsRT0gMTcyNTkwOTY1OSxTPXByZW1pdW0sTE09c3Vic2NyaXB0aW9uLEtWPTI=');

const COLUMNS = [
  {
    field: 'userName',
    headerName: 'Email',
    width: 150,
    valueGetter: (value, row) => `${row.user.email}`,
  },
  {
    field: 'readableAction',
    headerName: 'Action',
    width: 150,
  },
  {
    field: 'description',
    headerName: 'Description',
    width: 200,
  },
  {
    field: 'timestamp',
    headerName: 'Timestamp',
    width: 300,
  },
];

export default function AuditLogsPage() {
  const [searchText, setSearchText] = useState('');
  const { loading, response: auditLogs } = useQueryAuditLogs({ searchText });
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack>
        <Stack direction='row' justifyContent='center' padding={1}>
          <Typography variant='h5'>Audit Log</Typography>
        </Stack>
        <Stack justifyContent='center' padding={2}>
          <Stack direction='row' pb={2} spacing={2}>
            <Box>
              <TextField size='small' onChange={event => setSearchText(event.target.value)} />
            </Box>
          </Stack>
          <DataGrid columns={COLUMNS} rows={auditLogs} loading={loading} pageSizeOptions={[5]} disableRowSelectionOnClick initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          />
        </Stack>
      </Stack>
    </LocalizationProvider>
  );
}
