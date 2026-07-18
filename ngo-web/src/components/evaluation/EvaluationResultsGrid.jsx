import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { RefreshCw, Play, Download, Ban, RotateCcw, Loader2, Eye } from 'lucide-react';
import { evaluationAdminAPI } from '../../utils/api';
import AdminEntryPhotoModal from './AdminEntryPhotoModal';

const CONFLICT_STYLE = {
  HIGH: 'bg-red-100 text-red-700',
  MEDIUM: 'bg-amber-100 text-amber-700',
  LOW: 'bg-green-100 text-green-700',
};

const EvaluationResultsGrid = () => {
  const [entries, setEntries] = useState([]);
  const [judges, setJudges] = useState([]);
  const [maxTotal, setMaxTotal] = useState(25);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [qualifying, setQualifying] = useState(false);
  const [exportingFmt, setExportingFmt] = useState(null);
  const [actionId, setActionId] = useState(null);
  const [viewingId, setViewingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await evaluationAdminAPI.getResults();
      setEntries(res.data.data);
      setJudges(res.data.judges);
      setMaxTotal(res.data.maxTotal || 25);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load results');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await evaluationAdminAPI.syncEntries();
      toast.success(res.data.message);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  const handleQualify = async () => {
    if (!window.confirm('Run qualification? This will update qualified status for all entries based on current settings.')) return;
    setQualifying(true);
    try {
      const res = await evaluationAdminAPI.runQualification();
      toast.success(`Qualification applied — ${res.data.data.qualifiedCount} entries qualified`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Qualification failed');
    } finally {
      setQualifying(false);
    }
  };

  const handleExport = async (format) => {
    setExportingFmt(format);
    try {
      const res = await evaluationAdminAPI.exportResults(format);
      const ext = format === 'excel' ? 'xlsx' : format;
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `Round1_Results.${ext}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error('Export failed');
    } finally {
      setExportingFmt(null);
    }
  };

  const handleDisqualify = async (entryId) => {
    if (!window.confirm('Disqualify this entry? It will be excluded from scoring totals.')) return;
    setActionId(entryId);
    try {
      const res = await evaluationAdminAPI.disqualifyEntry(entryId);
      toast.success(res.data.message);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to disqualify');
    } finally {
      setActionId(null);
    }
  };

  const handleReinstate = async (entryId) => {
    setActionId(entryId);
    try {
      const res = await evaluationAdminAPI.reinstateEntry(entryId);
      toast.success(res.data.message);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reinstate');
    } finally {
      setActionId(null);
    }
  };

  const qualifiedCount = entries.filter((e) => e.qualified).length;
  const highConflicts = entries.filter((e) => e.conflict === 'HIGH').length;

  return (
    <div className="space-y-5">
      {/* Action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm font-semibold hover:border-primary hover:text-primary disabled:opacity-50 transition-colors"
          >
            <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Syncing…' : 'Sync Entries'}
          </button>
          <button
            onClick={handleQualify}
            disabled={qualifying}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark disabled:opacity-50 transition-colors"
          >
            <Play size={14} />
            {qualifying ? 'Running…' : 'Run Qualification'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {['csv', 'excel', 'pdf'].map((fmt) => (
            <button
              key={fmt}
              onClick={() => handleExport(fmt)}
              disabled={!!exportingFmt}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 text-sm font-semibold hover:border-primary hover:text-primary disabled:opacity-50 transition-colors uppercase"
            >
              {exportingFmt === fmt
                ? <Loader2 size={13} className="animate-spin" />
                : <Download size={13} />}
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Entries', value: entries.length, color: 'text-gray-800' },
          { label: 'Judges Active', value: judges.length, color: 'text-blue-600' },
          { label: 'Qualified', value: qualifiedCount, color: 'text-green-600' },
          { label: 'HIGH Conflicts', value: highConflicts, color: 'text-red-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-primary" size={28} />
        </div>
      ) : entries.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400">
          No entries yet. Click <strong>Sync Entries</strong> to import from submissions.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
          <table className="w-full text-sm" style={{ minWidth: 800 }}>
            <thead className="bg-gray-50 text-gray-500 text-left text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">Entry</th>
                <th className="px-4 py-3">Participant</th>
                {judges.map((j, i) => (
                  <th key={j.id} className="px-3 py-3 text-center">J{i + 1}</th>
                ))}
                <th className="px-3 py-3 text-center">Total /{maxTotal}</th>
                <th className="px-3 py-3 text-center">Conflict</th>
                <th className="px-3 py-3 text-center">Qualified</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => {
                const isDisq = entry.status === 'disqualified';
                const isActing = actionId === entry.entryId;
                return (
                  <tr
                    key={entry.entryId}
                    className={`border-t border-gray-100 ${isDisq ? 'opacity-50 bg-gray-50' : 'hover:bg-gray-50/40'}`}
                  >
                    <td className="px-4 py-3 font-mono font-bold text-gray-800">
                      #{entry.entryNumber}
                    </td>
                    <td className="px-4 py-3 text-gray-700 max-w-[150px] truncate">
                      {entry.fullName || entry.participantId}
                    </td>
                    {judges.map((j) => {
                      const js = entry.judgeScores.find((s) => s.judgeId === j.id);
                      return (
                        <td key={j.id} className="px-3 py-3 text-center">
                          {js?.score !== null && js?.score !== undefined
                            ? <span className="font-semibold text-gray-700">{js.score}</span>
                            : <span className="text-gray-300">—</span>}
                        </td>
                      );
                    })}
                    <td className="px-3 py-3 text-center font-bold text-gray-800">{entry.total}</td>
                    <td className="px-3 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${CONFLICT_STYLE[entry.conflict] || 'bg-gray-100 text-gray-500'}`}>
                        {entry.conflict}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center text-xs font-semibold">
                      {isDisq
                        ? <span className="text-red-500">DISQ</span>
                        : entry.qualified
                          ? <span className="text-green-600">✓ Yes</span>
                          : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => setViewingId(entry.entryId)}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-700 font-semibold transition-colors"
                        >
                          <Eye size={11} /> View
                        </button>
                        {isActing ? (
                          <Loader2 size={15} className="animate-spin text-gray-400 inline-block" />
                        ) : isDisq ? (
                          <button
                            onClick={() => handleReinstate(entry.entryId)}
                            className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700 font-semibold transition-colors"
                          >
                            <RotateCcw size={11} /> Reinstate
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDisqualify(entry.entryId)}
                            className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-700 font-semibold transition-colors"
                          >
                            <Ban size={11} /> Disqualify
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {viewingId && (
        <AdminEntryPhotoModal entryId={viewingId} onClose={() => setViewingId(null)} />
      )}
    </div>
  );
};

export default EvaluationResultsGrid;