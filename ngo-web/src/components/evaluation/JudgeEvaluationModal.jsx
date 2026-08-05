import React, { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { X, MapPin, Calendar, Camera, Leaf, Maximize2, Loader2, Lock, Tag, History, ChevronLeft, ChevronRight } from 'lucide-react';
import { judgeAPI } from '../../utils/api';
import JudgeImageViewer from './JudgeImageViewer';
import CategoryBadge from './CategoryBadge';

const LOCK_MESSAGES = {
  frozen: 'The competition is frozen. Scores cannot be submitted or changed.',
  round_closed: 'This round is not currently open for scoring. You can still view the entry.',
  discussion_only: 'Round 2 is discussion-only right now — scoring is disabled.',
  reevaluation_disabled:
    'You already scored this entry and re-evaluation is currently disabled, so the score can\u2019t be changed. You can still view it.',
};

const AUTO_ADVANCE_DELAY_MS = 450;

/**
 * queue: ordered array of { entryId, entryNumber, ... } — whatever the
 * dashboard currently has loaded (respecting its active filters).
 * currentIndex: position within that queue this modal is showing.
 * onNavigate(newIndex): move to a different position in the queue.
 * onScored(): fire-and-forget notification so the dashboard can
 * refresh progress counts in the background without closing the modal.
 */
const JudgeEvaluationModal = ({ queue, currentIndex, round, onClose, onNavigate, onScored }) => {
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedScore, setSelectedScore] = useState(null);
  const [saving, setSaving] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const advanceTimer = useRef(null);

  const current = queue[currentIndex];
  const entryId = current?.entryId;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < queue.length - 1;

  const loadEntry = useCallback(async () => {
    if (!entryId) return;
    setLoading(true);
    try {
      const res = await judgeAPI.getEntryDetail(entryId, round);
      setEntry(res.data.data);
      setSelectedScore(res.data.data.myScore);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load entry');
      onClose();
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entryId, round]);

  useEffect(() => {
    loadEntry();
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, [loadEntry]);

  const locked = entry && !entry.canScore;

  const goNext = useCallback(() => {
    if (currentIndex < queue.length - 1) {
      onNavigate(currentIndex + 1);
    } else {
      toast.info('That was the last entry in this list.');
    }
  }, [currentIndex, queue.length, onNavigate]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) onNavigate(currentIndex - 1);
  }, [currentIndex, onNavigate]);

  const submit = async (score) => {
    if (locked || saving) return;
    setSaving(true);
    try {
      await judgeAPI.submitScore(entryId, round, score);
      onScored?.();
      // Brief confirmation, then move on automatically — the whole
      // point is the judge shouldn't have to re-open the next entry
      // by hand.
      toast.success('Score saved', { autoClose: 900 });
      advanceTimer.current = setTimeout(() => {
        goNext();
      }, AUTO_ADVANCE_DELAY_MS);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save score');
    } finally {
      setSaving(false);
    }
  };

  // For the button-grid case, picking a score both selects AND saves
  // immediately — no separate "Save" step. For the free-form number
  // input (very large scales), keep an explicit action since typing
  // shouldn't submit on every keystroke.
  const handleScoreButtonClick = (s) => {
    setSelectedScore(s);
    submit(s);
  };

  const handleManualSaveAndNext = () => {
    if (selectedScore === null) {
      toast.error('Enter a score first');
      return;
    }
    submit(selectedScore);
  };

  if (!current) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto relative">
        {/* Prev/Next arrows, always available regardless of score state */}
        <button
          onClick={goPrev}
          disabled={!hasPrev}
          className="hidden sm:flex items-center justify-center absolute left-[-56px] top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg text-gray-600 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous entry"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          onClick={goNext}
          disabled={!hasNext}
          className="hidden sm:flex items-center justify-center absolute right-[-56px] top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg text-gray-600 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next entry"
        >
          <ChevronRight size={22} />
        </button>

        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            {entry ? `Entry #${entry.entryNumber}` : 'Loading entry…'}
            {entry && <CategoryBadge category={entry.category} />}
            <span className="text-xs font-normal text-gray-400">
              {currentIndex + 1} / {queue.length}
            </span>
          </h2>
          <div className="flex items-center gap-1">
            {/* Mobile-visible arrows since the floating side ones are hidden below sm */}
            <button
              onClick={goPrev}
              disabled={!hasPrev}
              className="sm:hidden p-2 text-gray-400 disabled:opacity-30"
              aria-label="Previous entry"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goNext}
              disabled={!hasNext}
              className="sm:hidden p-2 text-gray-400 disabled:opacity-30"
              aria-label="Next entry"
            >
              <ChevronRight size={20} />
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-2" aria-label="Close">
              <X size={22} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : entry ? (
          <div className="p-6 space-y-5">
            {locked && (
              <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-lg p-3 flex items-start gap-2 text-sm font-medium">
                <Lock size={16} className="mt-0.5 shrink-0" />
                <span>{LOCK_MESSAGES[entry.lockReason] || 'Scoring is currently unavailable for this entry.'}</span>
              </div>
            )}

            {round === 2 && entry.myRound1Score !== null && (
              <div className="bg-blue-50 border border-blue-100 text-blue-700 rounded-lg p-3 flex items-center gap-2 text-sm">
                <History size={16} className="shrink-0" />
                <span>
                  Your Round 1 score for this entry was <strong>{entry.myRound1Score}</strong>. This is just for
                  your own reference — it has no effect on Round 2 scoring.
                </span>
              </div>
            )}

            <div className="relative group">
              {entry.imageUrl ? (
                <img
                  src={entry.imageUrl}
                  alt={`Entry #${entry.entryNumber}`}
                  loading="eager"
                  decoding="async"
                  className="w-full max-h-[50vh] object-contain bg-gray-100 rounded-xl cursor-zoom-in"
                  onClick={() => setFullscreen(true)}
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                  Image not available
                </div>
              )}
              {entry.imageUrl && (
                <button
                  onClick={() => setFullscreen(true)}
                  className="absolute bottom-3 right-3 bg-black/60 text-white rounded-lg px-3 py-1.5 text-sm flex items-center gap-1.5 opacity-90 hover:opacity-100"
                >
                  <Maximize2 size={14} /> View fullscreen
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
                <span>{entry.captureLocation || '—'}</span>
              </div>
              <div className="flex items-start gap-2 text-gray-600">
                <Calendar size={16} className="mt-0.5 shrink-0 text-primary" />
                <span>
                  {entry.captureDate ? new Date(entry.captureDate).toLocaleDateString() : '—'}
                </span>
              </div>
              <div className="flex items-start gap-2 text-gray-600">
                <Camera size={16} className="mt-0.5 shrink-0 text-primary" />
                <span>{entry.cameraModel || '—'}</span>
              </div>
              <div className="flex items-start gap-2 text-gray-600">
                <Tag size={16} className="mt-0.5 shrink-0 text-primary" />
                <span className="capitalize">{entry.category || '—'}</span>
              </div>
            </div>

            {entry.environmentalMessage && (
              <div className="flex items-start gap-2 bg-green-50 border border-green-100 rounded-lg p-3 text-sm text-green-800">
                <Leaf size={16} className="mt-0.5 shrink-0" />
                <span>{entry.environmentalMessage}</span>
              </div>
            )}

            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Score {entry.maxScore ? `(1–${entry.maxScore})` : ''}
                {!locked && <span className="font-normal text-gray-400"> — tap a score to save and move on</span>}
              </p>
              {entry.maxScore && entry.maxScore <= 20 ? (
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: entry.maxScore }, (_, i) => i + 1).map((s) => (
                    <button
                      key={s}
                      onClick={() => handleScoreButtonClick(s)}
                      disabled={locked || saving}
                      className={`w-12 h-12 rounded-lg font-bold text-lg border-2 transition-colors ${locked || saving
                          ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                          : selectedScore === s
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-primary'
                        }`}
                    >
                      {saving && selectedScore === s ? <Loader2 size={16} className="animate-spin mx-auto" /> : s}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    max={entry.maxScore || 100}
                    step={1}
                    value={selectedScore ?? ''}
                    disabled={locked}
                    onChange={(e) => {
                      const v = e.target.value === '' ? null : Math.max(1, Math.min(entry.maxScore, Math.round(Number(e.target.value))));
                      setSelectedScore(v);
                    }}
                    className="w-28 px-3 py-2.5 border-2 rounded-lg text-lg font-bold text-center disabled:bg-gray-50 disabled:text-gray-300"
                    placeholder="1"
                  />
                  {!locked && (
                    <button
                      onClick={handleManualSaveAndNext}
                      disabled={saving}
                      className="px-4 py-2.5 rounded-lg font-semibold bg-primary text-white hover:bg-primary-dark disabled:opacity-60"
                    >
                      {saving ? 'Saving…' : 'Save & Next'}
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={goPrev}
                disabled={!hasPrev}
                className="flex-1 py-3 rounded-lg font-semibold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 flex items-center justify-center gap-1.5"
              >
                <ChevronLeft size={16} /> Back
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-lg font-semibold border-2 border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={goNext}
                disabled={!hasNext}
                className="flex-1 py-3 rounded-lg font-semibold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 flex items-center justify-center gap-1.5"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {fullscreen && entry?.imageUrl && (
        <JudgeImageViewer
          imageUrl={entry.fullImageUrl || entry.imageUrl}
          alt={`Entry #${entry.entryNumber}`}
          onClose={() => setFullscreen(false)}
        />
      )}
    </div>
  );
};

export default JudgeEvaluationModal;