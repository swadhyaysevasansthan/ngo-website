import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import { judgeAPI } from '../../utils/api';
import JudgeProgress from './JudgeProgress';
import JudgeFilters from './JudgeFilters';
import JudgeEntryCard from './JudgeEntryCard';
import JudgeEvaluationModal from './JudgeEvaluationModal';

const JudgeDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [activeEntryId, setActiveEntryId] = useState(null);

  const round = dashboard?.round || 1;

  const loadDashboard = useCallback(async () => {
    try {
      const res = await judgeAPI.getDashboard();
      setDashboard(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load dashboard');
    }
  }, []);

  const loadEntries = useCallback(async () => {
    try {
      const res = await judgeAPI.getEntries({ round, status, search: search || undefined });
      setEntries(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load entries');
    } finally {
      setLoading(false);
    }
  }, [round, status, search]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    if (dashboard) loadEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboard, status]);

  useEffect(() => {
    if (!dashboard) return;
    const t = setTimeout(() => loadEntries(), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const refreshAfterSave = () => {
    setActiveEntryId(null);
    loadDashboard();
    loadEntries();
  };

  const handleContinueReviewing = async () => {
    try {
      const res = await judgeAPI.getNextPendingEntry(round);
      if (!res.data.data) {
        toast.info('All entries reviewed for this round');
        return;
      }
      setActiveEntryId(res.data.data.entryId);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch next entry');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <JudgeProgress dashboard={dashboard} onContinueReviewing={handleContinueReviewing} />

      <div className="bg-white rounded-2xl shadow-md p-6 space-y-5">
        <JudgeFilters status={status} onStatusChange={setStatus} search={search} onSearchChange={setSearch} />

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-primary" size={28} />
          </div>
        ) : entries.length === 0 ? (
          <p className="text-center text-gray-400 py-16">No entries match this filter.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {entries.map((entry) => (
              <JudgeEntryCard key={entry.entryId} entry={entry} onEvaluate={setActiveEntryId} />
            ))}
          </div>
        )}
      </div>

      {activeEntryId && (
        <JudgeEvaluationModal
          entryId={activeEntryId}
          round={round}
          onClose={() => setActiveEntryId(null)}
          onSaved={refreshAfterSave}
        />
      )}
    </div>
  );
};

export default JudgeDashboard;