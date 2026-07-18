import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { X, MapPin, Calendar, Camera, Leaf, Maximize2, Loader2, Lock, Tag } from 'lucide-react';
import { judgeAPI } from '../../utils/api';
import JudgeImageViewer from './JudgeImageViewer';

export const CATEGORY_STYLE = {
  wildlife: 'bg-orange-100 text-orange-700',
  nature: 'bg-green-100 text-green-700',
};

export const CategoryBadge = ({ category }) => {
  if (!category) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
        CATEGORY_STYLE[category] || 'bg-gray-100 text-gray-600'
      }`}
    >
      <Tag size={11} /> {category}
    </span>
  );
};

const LOCK_MESSAGES = {
  frozen: 'The competition is frozen. Scores cannot be submitted or changed.',
  round_closed: 'This round is not currently open for scoring. You can still view the entry.',
  discussion_only: 'Round 2 is discussion-only right now — scoring is disabled.',
  reevaluation_disabled:
    'You already scored this entry and re-evaluation is currently disabled, so the score can\u2019t be changed. You can still view it.',
};

const JudgeEvaluationModal = ({ entryId, round, onClose, onSaved }) => {
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedScore, setSelectedScore] = useState(null);
  const [saving, setSaving] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const loadEntry = useCallback(async () => {
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
  }, [loadEntry]);

  const locked = entry && !entry.canScore;

  const handleSave = async () => {
    if (locked) return; // buttons are disabled, but guard just in case
    if (selectedScore === null) {
      toast.error('Please select a score before saving');
      return;
    }
    setSaving(true);
    try {
      await judgeAPI.submitScore(entryId, round, selectedScore);
      toast.success('Score saved');
      onSaved?.();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save score');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-gray-800">
            {entry ? `Entry #${entry.entryNumber}` : 'Loading entry…'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700" aria-label="Close">
            <X size={22} />
          </button>
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

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-sm">
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
                <CategoryBadge category={entry.category} />
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
                Score {entry.maxScore ? `(0–${entry.maxScore})` : ''}
              </p>
              {entry.maxScore && entry.maxScore <= 20 ? (
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: entry.maxScore + 1 }, (_, s) => s).map((s) => (
                    <button
                      key={s}
                      onClick={() => !locked && setSelectedScore(s)}
                      disabled={locked}
                      className={`w-12 h-12 rounded-lg font-bold text-lg border-2 transition-colors ${
                        locked
                          ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                          : selectedScore === s
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-primary'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  type="number"
                  min={0}
                  max={entry.maxScore || 100}
                  step={1}
                  value={selectedScore ?? ''}
                  disabled={locked}
                  onChange={(e) => {
                    const v = e.target.value === '' ? null : Math.max(0, Math.min(entry.maxScore, Math.round(Number(e.target.value))));
                    setSelectedScore(v);
                  }}
                  className="w-28 px-3 py-2.5 border-2 rounded-lg text-lg font-bold text-center disabled:bg-gray-50 disabled:text-gray-300"
                  placeholder="0"
                />
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-lg font-semibold border-2 border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                {locked ? 'Close' : 'Cancel'}
              </button>
              {!locked && (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3 rounded-lg font-semibold bg-primary text-white hover:bg-primary-dark disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Save'}
                </button>
              )}
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