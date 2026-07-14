import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Loader2, Search, History } from 'lucide-react';
import { evaluationAdminAPI } from '../../utils/api';

const AuditLog = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = useCallback(async (query) => {
    setLoading(true);
    try {
      const res = await evaluationAdminAPI.getAuditLog(query);
      setRows(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load audit log');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const t = setTimeout(() => load(search || undefined), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <History size={18} className="text-primary" /> Audit Log
        </h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search entry or judge…"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-primary" size={28} />
        </div>
      ) : rows.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400">
          No score modifications recorded yet.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">Entry</th>
                <th className="px-4 py-3">Judge</th>
                <th className="px-4 py-3 text-center">Round</th>
                <th className="px-4 py-3 text-center">Old Score</th>
                <th className="px-4 py-3 text-center">New Score</th>
                <th className="px-4 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-mono font-bold text-gray-800">#{row.entry_number}</td>
                  <td className="px-4 py-3 text-gray-700">{row.judge_name}</td>
                  <td className="px-4 py-3 text-center text-gray-500">{row.round}</td>
                  <td className="px-4 py-3 text-center text-gray-400">
                    {row.old_score === null ? '—' : row.old_score}
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-gray-800">{row.new_score}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(row.changed_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AuditLog;
