import { useEffect, useState } from "react";

const AUDIT_LOGS_ENDPOINT = "/api/audit-logs";

export default function useQueryAuditLogs({ searchText, dateRange }) {
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchAuditLogs({ searchText, dateRange })
      .then((auditLogs) => {
        if (cancelled) return;
        setResponse(auditLogs);
        setError(null);
      })
      .catch((fetchError) => {
        if (cancelled) return;
        setError(fetchError);
        setResponse([]);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [searchText, dateRange]);

  return { loading, response, error };
}

async function fetchAuditLogs({ searchText, dateRange }) {
  const url = `${AUDIT_LOGS_ENDPOINT}${buildQueryString({ searchText, dateRange })}`;
  const httpResponse = await fetch(url);
  if (!httpResponse.ok) {
    throw new Error(`Failed to load audit logs (${httpResponse.status})`);
  }
  const body = await httpResponse.json();
  return body.auditLogs;
}

function buildQueryString({ searchText, dateRange }) {
  const params = new URLSearchParams();
  if (searchText) params.set("search", searchText);
  const [startDate, endDate] = dateRange || [];
  if (startDate) params.set("startDate", startDate.toISOString());
  if (endDate) params.set("endDate", endDate.endOf("day").toISOString());
  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}
