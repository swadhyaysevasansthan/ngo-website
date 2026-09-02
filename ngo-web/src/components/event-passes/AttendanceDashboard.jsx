import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { eventPassAPI } from '../../utils/api';
import Card from '../Card';
import Button from '../Button';

const AttendanceDashboard = ({ selectedEventId }) => {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const loadEventData = useCallback(async (silent = false) => {
    if (!selectedEventId) return;
    if (!silent) setLoading(true);
    try {
      const [statsRes, logsRes] = await Promise.all([
        eventPassAPI.getAttendanceStats(selectedEventId),
        eventPassAPI.getCheckInLogs(selectedEventId, { limit: 100 }),
      ]);
      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (logsRes.data.success) setLogs(logsRes.data.logs);
    } catch {
      if (!silent) toast.error('Failed to load event dashboard statistics');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [selectedEventId]);

  const handleClearAllLogs = async () => {
    if (!selectedEventId) return;
    if (!window.confirm('Are you sure you want to PERMANENTLY delete all check-in/scan logs for this event? This action cannot be undone.')) return;
    try {
      const res = await eventPassAPI.clearAllCheckInLogs(selectedEventId);
      if (res.data.success) {
        toast.success(res.data.message || 'All scan logs cleared successfully');
        loadEventData();
      }
    } catch {
      toast.error('Failed to clear scan logs');
    }
  };

  const handleDeleteLog = async (logId) => {
    if (!window.confirm('Are you sure you want to permanently delete this scan log entry?')) return;
    try {
      const res = await eventPassAPI.deleteCheckInLog(logId);
      if (res.data.success) {
        toast.success('Scan log entry deleted');
        loadEventData();
      }
    } catch {
      toast.error('Failed to delete scan log entry');
    }
  };

  // Downloads a CSV of Time / Pass-Token / Guest Name / Result.
  // Fetches the full log set (the on-screen table is capped at 100
  // rows), so the export isn't silently truncated.
  const escapeCsvCell = (value) => {
    const str = value === null || value === undefined ? '' : String(value);
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };

  const handleDownloadLogs = async () => {
    if (!selectedEventId) return;
    setDownloading(true);
    try {
      const res = await eventPassAPI.getCheckInLogs(selectedEventId, { limit: 100000 });
      const allLogs = res.data.success ? res.data.logs : [];

      if (!allLogs || allLogs.length === 0) {
        toast.info('No scan logs to download for this event');
        return;
      }

      const header = ['Time', 'Pass/Token', 'Guest Name', 'Result'];
      const rows = allLogs.map((log) => [
        new Date(log.scanned_at).toLocaleString(),
        log.pass_number || log.raw_token || 'INVALID_TOKEN',
        log.guest_name || 'N/A',
        log.result,
      ]);
      // Leading BOM so Excel opens UTF-8 (e.g. Hindi guest names) correctly.
      const csvContent = '\uFEFF' + [header, ...rows].map((row) => row.map(escapeCsvCell).join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
      link.href = url;
      link.download = `scan-audit-log-event-${selectedEventId}-${stamp}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${allLogs.length} log entr${allLogs.length === 1 ? 'y' : 'ies'}`);
    } catch {
      toast.error('Failed to download scan logs');
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    loadEventData();
  }, [loadEventData]);

  // Live Auto-Refresh Polling effect
  useEffect(() => {
    let intervalId;
    if (autoRefresh && selectedEventId) {
      intervalId = setInterval(() => {
        loadEventData(true);
      }, 10000); // 10 seconds interval
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefresh, selectedEventId, loadEventData]);

  if (!selectedEventId) {
    return (
      <div className="py-16 text-center text-gray-400">
        Select an event above to view attendance data.
      </div>
    );
  }

  if (loading && !stats) {
    return <div className="py-16 text-center text-gray-400">Loading attendance data…</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {stats ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-5 border border-gray-100 shadow-sm hover:shadow-md">
            <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Passes</div>
            <div className="text-3xl font-extrabold text-slate-800 mt-1">{stats.summary.total_passes}</div>
            <div className="text-xs text-gray-400 mt-2">Allocated invites</div>
          </Card>

          <Card className="p-5 border border-gray-100 shadow-sm hover:shadow-md">
            <div className="text-green-600 text-xs font-bold uppercase tracking-wider">Checked In</div>
            <div className="text-3xl font-extrabold text-green-600 mt-1">{stats.summary.checked_in}</div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-green-500 h-full rounded-full"
                style={{
                  width: `${stats.summary.total_passes > 0
                    ? Math.round((stats.summary.checked_in / stats.summary.total_passes) * 100)
                    : 0}%`,
                }}
              />
            </div>
          </Card>

          <Card className="p-5 border border-gray-100 shadow-sm hover:shadow-md">
            <div className="text-amber-600 text-xs font-bold uppercase tracking-wider">Pending Entry</div>
            <div className="text-3xl font-extrabold text-amber-600 mt-1">{stats.summary.pending}</div>
            <div className="text-xs text-gray-400 mt-2">
              {stats.summary.total_passes > 0
                ? Math.round((stats.summary.pending / stats.summary.total_passes) * 100)
                : 0}% guests remaining
            </div>
          </Card>

          <Card className="p-5 border border-gray-100 shadow-sm hover:shadow-md">
            <div className="text-rose-600 text-xs font-bold uppercase tracking-wider">Cancelled</div>
            <div className="text-3xl font-extrabold text-rose-600 mt-1">{stats.summary.cancelled}</div>
            <div className="text-xs text-gray-400 mt-2">Revoked access credentials</div>
          </Card>
        </div>
      ) : (
        <div className="py-12 text-center text-gray-500">No statistical summary available for this event.</div>
      )}

      {/* Category & Gate Breakdowns */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-5 border border-gray-100">
            <h3 className="font-bold text-gray-800 border-b pb-3 mb-4">Category Breakdown</h3>
            <div className="space-y-3">
              {stats.categories.map((cat, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center text-sm border-b border-gray-50 pb-2 last:border-0 last:pb-0"
                >
                  <div className="font-semibold text-gray-700 flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        i % 3 === 0 ? 'bg-primary' : i % 3 === 1 ? 'bg-saffron-500' : 'bg-slate-400'
                      }`}
                    />
                    {cat.category}
                  </div>
                  <div className="text-gray-500">
                    <span className="font-bold text-slate-800">{cat.checked_in}</span> / {cat.total_passes} checked in
                  </div>
                </div>
              ))}
              {stats.categories.length === 0 && (
                <div className="text-center text-gray-400 py-6">No categorised guests yet.</div>
              )}
            </div>
          </Card>

          <Card className="p-5 border border-gray-100">
            <h3 className="font-bold text-gray-800 border-b pb-3 mb-4">Gate Breakdown</h3>
            <div className="space-y-3">
              {stats.gates.map((g, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center text-sm border-b border-gray-50 pb-2 last:border-0 last:pb-0"
                >
                  <div className="font-semibold text-gray-700">🚪 {g.gate}</div>
                  <div className="font-bold text-slate-800">{g.count} checks</div>
                </div>
              ))}
              {stats.gates.length === 0 && (
                <div className="text-center text-gray-400 py-6">No check-ins registered at any gate yet.</div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Live Audit Log */}
      <Card className="p-5 border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b pb-4 mb-4">
          <h3 className="font-bold text-gray-800 text-lg">📋 Live Scan Audit Log</h3>
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 cursor-pointer select-none bg-gray-50 px-3 py-1.5 rounded-lg border">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
              />
              <span>🔄 Auto-Refresh (10s)</span>
            </label>
            <Button
              variant="outline"
              className="text-xs px-3 py-1.5 hover:scale-100 flex items-center gap-1.5"
              onClick={() => loadEventData(false)}
            >
              🔄 Refresh Logs
            </Button>
            {logs.length > 0 && (
              <Button
                variant="outline"
                className="text-xs px-3 py-1.5 hover:scale-100 flex items-center gap-1.5"
                onClick={handleDownloadLogs}
                disabled={downloading}
              >
                {downloading ? 'Preparing…' : '⬇️ Download Logs'}
              </Button>
            )}
            {logs.length > 0 && (
              <Button
                className="text-xs px-3 py-1.5 hover:scale-100 flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg"
                onClick={handleClearAllLogs}
              >
                🗑️ Clear All Logs
              </Button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold">
                <th className="p-3">Time</th>
                <th className="p-3">Pass/Token</th>
                <th className="p-3">Guest Details</th>
                <th className="p-3">Gate/Device</th>
                <th className="p-3">Method</th>
                <th className="p-3 text-center">Result</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50">
                  <td className="p-3 text-gray-500 whitespace-nowrap">
                    {new Date(log.scanned_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </td>
                  <td className="p-3">
                    <span className="font-mono text-xs text-gray-600 block">{log.pass_number || 'INVALID_TOKEN'}</span>
                    <span className="text-[10px] text-gray-400 block truncate max-w-[120px]" title={log.raw_token}>
                      {log.raw_token}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-slate-800">{log.guest_name || 'N/A'}</div>
                    <span className="text-[11px] text-gray-500">{log.category || 'N/A'}</span>
                  </td>
                  <td className="p-3">
                    <div className="text-gray-700">{log.gate || 'N/A'}</div>
                    <span className="text-xs text-gray-400">{log.scanner_name || 'Admin Manual'}</span>
                  </td>
                  <td className="p-3 text-xs text-gray-600">
                    {log.action === 'SCAN' ? '📸 Camera Scan' : '🖥️ Admin Desk'}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        log.result === 'SUCCESS'
                          ? 'bg-green-100 text-green-800'
                          : log.result === 'ALREADY_CHECKED_IN'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {log.result}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      className="text-xs px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium"
                      onClick={() => handleDeleteLog(log.id)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-gray-400 py-8">
                    No scan logs recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AttendanceDashboard;