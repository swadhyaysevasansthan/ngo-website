import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Loader2, Trash2, Trophy } from 'lucide-react';
import { evaluationAdminAPI } from '../../utils/api';

const PRIZE_META = {
  first: { label: '🥇 First Prize', max: 1 },
  second: { label: '🥈 Second Prize', max: 1 },
  third: { label: '🥉 Third Prize', max: 1 },
  consolation: { label: '⭐ Consolation', max: 5 },
};

const WinnerSelection = () => {
  const [winners, setWinners] = useState([]);
  const [verified, setVerified] = useState([]);
  const [loading, setLoading] = useState(true);
  const [entryId, setEntryId] = useState('');
  const [prizeType, setPrizeType] = useState('first');
  const [assigning, setAssigning] = useState(false);

  const load = useCallback(async () => {
    try {
      const [winnersRes, queueRes] = await Promise.all([
        evaluationAdminAPI.getWinners(),
        evaluationAdminAPI.getVerificationQueue(),
      ]);
      setWinners(winnersRes.data.data);
      setVerified(queueRes.data.data.filter((q) => q.verification_status === 'verified'));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load winners');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const winnerEntryIds = new Set(winners.map((w) => w.entry_id ?? w.entryId));
  const availableEntries = verified.filter((v) => !winnerEntryIds.has(v.entry_id));

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!entryId) {
      toast.error('Select a verified entry first');
      return;
    }
    setAssigning(true);
    try {
      await evaluationAdminAPI.assignWinner(Number(entryId), prizeType);
      toast.success('Winner assigned');
      setEntryId('');
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign winner');
    } finally {
      setAssigning(false);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm('Remove this prize assignment?')) return;
    try {
      await evaluationAdminAPI.removeWinner(id);
      toast.success('Assignment removed');
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove assignment');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin text-primary" size={28} />
      </div>
    );
  }

  const consolationCount = winners.filter((w) => w.prize_type === 'consolation').length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
          <Trophy size={18} className="text-primary" /> Assign a Winner
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Only verified entries can be assigned a prize. Winners are always manual — nothing here is automatic.
        </p>
        <form onSubmit={handleAssign} className="flex flex-col sm:flex-row gap-3">
          <select
            value={entryId}
            onChange={(e) => setEntryId(e.target.value)}
            className="flex-1 px-3 py-2.5 border rounded-lg text-sm"
          >
            <option value="">Select a verified entry…</option>
            {availableEntries.map((v) => (
              <option key={v.entry_id} value={v.entry_id}>
                #{v.entry_number} — {v.full_name} (score {v.total_score})
              </option>
            ))}
          </select>
          <select
            value={prizeType}
            onChange={(e) => setPrizeType(e.target.value)}
            className="px-3 py-2.5 border rounded-lg text-sm"
          >
            {Object.entries(PRIZE_META).map(([value, meta]) => (
              <option key={value} value={value}>
                {meta.label} {value === 'consolation' ? `(${consolationCount}/5)` : ''}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={assigning}
            className="px-5 py-2.5 rounded-lg font-semibold bg-primary text-white hover:bg-primary-dark disabled:opacity-60"
          >
            {assigning ? 'Assigning…' : 'Assign'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(PRIZE_META).map(([type, meta]) => {
          const assigned = winners.filter((w) => w.prize_type === type);
          return (
            <div key={type} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h4 className="font-bold text-gray-800 mb-3">
                {meta.label} <span className="text-xs font-normal text-gray-400">({assigned.length}/{meta.max})</span>
              </h4>
              {assigned.length === 0 ? (
                <p className="text-sm text-gray-400">Not assigned yet</p>
              ) : (
                <div className="space-y-2">
                  {assigned.map((w) => (
                    <div key={w.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                      <div className="text-sm">
                        <p className="font-medium text-gray-800">#{w.entry_number} — {w.full_name}</p>
                      </div>
                      <button onClick={() => handleRemove(w.id)} className="text-gray-400 hover:text-red-600">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WinnerSelection;
