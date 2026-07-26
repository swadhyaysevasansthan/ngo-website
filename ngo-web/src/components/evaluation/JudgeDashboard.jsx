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
  const [category, setCategory] = useState('');
  const [activeIndex, setActiveIndex] = useState(null);

  const round = dashboard?.round || 1;

  const loadDashboard = useCallback(async () => {
    try {
      const res = await judgeAPI.getDashboard();
      setDashboard(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load dashboard');
    }
  }, []);

  const fetchEntries = useCallback(
    async (overrides = {}) => {
      const params = {
        round,
        status: overrides.status ?? status,
        search: (overrides.search ?? search) || undefined,
        category: (overrides.category ?? category) || undefined,
      };
      const res = await judgeAPI.getEntries(params);
      return res.data.data;
    },
    [round, status, search, category]
  );

  const loadEntries = useCallback(async () => {
    try {
      const data = await fetchEntries();
      setEntries(data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load entries');
    } finally {
      setLoading(false);
    }
  }, [fetchEntries]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    if (dashboard) loadEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboard, status, category]);

  useEffect(() => {
    if (!dashboard) return;
    const t = setTimeout(() => loadEntries(), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleEvaluate = (entry) => {
    const idx = entries.findIndex((e) => e.entryId === entry.entryId);
    setActiveIndex(idx >= 0 ? idx : 0);
  };

  const handleCloseModal = () => {
    setActiveIndex(null);
    loadEntries(); // safe now — nothing is navigating off `entries` anymore
  };

  // Optimistic local update: keeps the queue's length/order stable
  // while the modal is open, so auto-advance never shifts under the
  // judge mid-navigation. A full reload happens on close instead.
  const handleScored = () => {
    loadDashboard(); // just refresh the progress numbers
  };

  const handleContinueReviewing = async () => {
    try {
      const res = await judgeAPI.getNextPendingEntry(round);
      if (!res.data.data) {
        toast.info('All entries reviewed for this round');
        return;
      }
      const targetId = res.data.data.entryId;

      // Reset filters so the target entry is guaranteed to be in the
      // queue, then fetch fresh (don't rely on state having settled).
      setStatus('all');
      setCategory('');
      setSearch('');
      const fresh = await fetchEntries({ status: 'all', category: '', search: '' });
      setEntries(fresh);
      const idx = fresh.findIndex((e) => e.entryId === targetId);
      setActiveIndex(idx >= 0 ? idx : 0);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch next entry');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <JudgeProgress dashboard={dashboard} onContinueReviewing={handleContinueReviewing} />

      <div className="bg-white rounded-2xl shadow-md p-6 space-y-5">
        <JudgeFilters
          status={status}
          onStatusChange={setStatus}
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
        />

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-primary" size={28} />
          </div>
        ) : entries.length === 0 ? (
          <p className="text-center text-gray-400 py-16">No entries match this filter.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {entries.map((entry) => (
              <JudgeEntryCard key={entry.entryId} entry={entry} onEvaluate={handleEvaluate} />
            ))}
          </div>
        )}
      </div>

      {activeIndex !== null && (
        <JudgeEvaluationModal
          queue={entries}
          currentIndex={activeIndex}
          round={round}
          onClose={handleCloseModal}
          onNavigate={setActiveIndex}
          onScored={handleScored}
        />
      )}
    </div>
  );
};

export default JudgeDashboard;