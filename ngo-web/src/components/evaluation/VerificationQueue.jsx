import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Loader2, Mail, Phone, Lock, Eye } from 'lucide-react';
import { evaluationAdminAPI } from '../../utils/api';
import AdminEntryPhotoModal from './AdminEntryPhotoModal';
import CategoryBadge from './CategoryBadge';

const STATUS_STYLE = {
  pending_verification: 'bg-amber-100 text-amber-700',
  verified: 'bg-green-100 text-green-700',
  disqualified: 'bg-red-100 text-red-700',
  needs_clarification: 'bg-blue-100 text-blue-700',
};

const STATUS_LABEL = {
  pending_verification: 'Pending Verification',
  verified: 'Verified',
  disqualified: 'Disqualified',
  needs_clarification: 'Need Clarification',
};

const VerificationQueue = () => {
  const [queue, setQueue] = useState([]);
  const [verificationOpen, setVerificationOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [viewingId, setViewingId] = useState(null);

  const load = useCallback(async () => {
    try {
      const [queueRes, settingsRes] = await Promise.all([
        evaluationAdminAPI.getVerificationQueue(),
        evaluationAdminAPI.getSettings(),
      ]);
      setQueue(queueRes.data.data);
      setVerificationOpen(settingsRes.data.data.settings.verification_status === 'open');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load verification queue');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleStatusChange = async (entryId, status) => {
    if (status === 'disqualified' && !window.confirm('Disqualify this participant? The next highest-scoring entry will be auto-promoted to fill the slot.')) {
      return;
    }
    setUpdatingId(entryId);
    try {
      const res = await evaluationAdminAPI.updateVerificationStatus(entryId, status);
      toast.success(
        res.data.autoPromoted > 0
          ? `Status updated — ${res.data.autoPromoted} entry auto-promoted to fill the open slot`
          : 'Status updated'
      );
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin text-primary" size={28} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">Verification Queue ({queue.length})</h2>
      </div>

      {!verificationOpen && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-lg p-3 flex items-center gap-2 text-sm font-medium">
          <Lock size={16} className="shrink-0" />
          Verification is currently closed. You can view the queue, but statuses can't be changed until it's opened in Settings.
        </div>
      )}

      {queue.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400">
          No qualified entries yet. Run qualification from the Results tab first.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">Entry</th>
                <th className="px-4 py-3">Participant</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3 text-center">Score</th>
                <th className="px-4 py-3 text-center">Conflict</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {queue.map((row) => (
                <tr key={row.entry_id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-mono font-bold text-gray-800">#{row.entry_number}</td>
                  <td className="px-4 py-3 text-gray-700">
                    <p className="font-medium">{row.full_name}</p>
                    <p className="text-xs text-gray-400">{row.participant_id}</p>
                    <div className="mt-1"><CategoryBadge category={row.category} /></div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs space-y-0.5">
                    <p className="flex items-center gap-1"><Mail size={12} /> {row.email}</p>
                    <p className="flex items-center gap-1"><Phone size={12} /> {row.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-gray-800">{row.total_score}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        row.conflict_level === 'HIGH'
                          ? 'bg-red-100 text-red-700'
                          : row.conflict_level === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {row.conflict_level}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {updatingId === row.entry_id ? (
                      <Loader2 size={16} className="animate-spin text-gray-400" />
                    ) : !verificationOpen ? (
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          STATUS_STYLE[row.verification_status] || 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {STATUS_LABEL[row.verification_status]}
                      </span>
                    ) : (
                      <select
                        value={row.verification_status}
                        onChange={(e) => handleStatusChange(row.entry_id, e.target.value)}
                        className={`text-xs font-semibold rounded-full px-3 py-1.5 border-0 cursor-pointer ${
                          STATUS_STYLE[row.verification_status] || 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {Object.entries(STATUS_LABEL).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setViewingId(row.entry_id)}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-700 font-semibold transition-colors"
                    >
                      <Eye size={11} /> View
                    </button>
                  </td>
                </tr>
              ))}
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

export default VerificationQueue;