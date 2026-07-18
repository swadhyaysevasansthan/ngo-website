import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Loader2, ShieldAlert, Play, RotateCcw } from 'lucide-react';
import { evaluationAdminAPI } from '../../utils/api';

const Toggle = ({ label, description, checked, onChange, disabled }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
    <div>
      <p className="font-medium text-gray-800">{label}</p>
      {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
    </div>
    <button
      onClick={() => onChange(!checked)}
      disabled={disabled}
      className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
        checked ? 'bg-primary' : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
          checked ? 'translate-x-6' : ''
        }`}
      />
    </button>
  </div>
);

const EvaluationSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [qualifying, setQualifying] = useState(false);
  const [judges, setJudges] = useState([]);
  const [resetScope, setResetScope] = useState('scores');
  const [resetRound, setResetRound] = useState('');
  const [resetJudgeId, setResetJudgeId] = useState('');
  const [resetting, setResetting] = useState(false);

  const load = useCallback(async () => {
    try {
      const [settingsRes, judgesRes] = await Promise.all([
        evaluationAdminAPI.getSettings(),
        evaluationAdminAPI.getJudges(),
      ]);
      setSettings(settingsRes.data.data.settings);
      setJudges(judgesRes.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (patch) => {
    setSaving(true);
    try {
      const res = await evaluationAdminAPI.updateSettings(patch);
      setSettings(res.data.data);
      toast.success('Settings updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleRunQualification = async () => {
    setQualifying(true);
    try {
      const res = await evaluationAdminAPI.runQualification();
      toast.success(`Qualification applied — ${res.data.data.qualifiedCount} entries now qualified`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to run qualification');
    } finally {
      setQualifying(false);
    }
  };

  const handleReset = async () => {
    const scopeLabel = resetScope === 'full' ? 'scores + qualification + winners' : 'scores only';
    const scopeDetail = [
      resetRound ? `Round ${resetRound}` : 'all rounds',
      resetJudgeId ? judges.find((j) => j.id === Number(resetJudgeId))?.full_name : 'all judges',
    ].join(', ');
    if (
      !window.confirm(
        `Reset (${scopeLabel}) for ${scopeDetail}? This cannot be undone. Use this for testing only.`
      )
    ) {
      return;
    }
    setResetting(true);
    try {
      const res = await evaluationAdminAPI.resetEvaluationData({
        scope: resetScope,
        round: resetRound ? Number(resetRound) : undefined,
        judgeId: resetJudgeId ? Number(resetJudgeId) : undefined,
      });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset');
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin text-primary" size={28} />
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="space-y-6 max-w-2xl">
      {settings.frozen && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 flex items-center gap-2 text-sm font-medium">
          <ShieldAlert size={18} /> Competition is frozen — all judging is locked.
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-bold text-gray-800 mb-1">Scoring Scale</h3>
        <p className="text-xs text-gray-500 mb-3">
          Judges score each entry as a whole number from 0 up to this maximum (e.g. 5, 10, 100).
        </p>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={1}
            value={settings.max_score}
            onChange={(e) => setSettings({ ...settings, max_score: Number(e.target.value) })}
            onBlur={(e) => save({ max_score: Number(e.target.value) })}
            disabled={saving || settings.frozen}
            className="w-28 px-3 py-2 border rounded-lg text-sm"
          />
          <p className="text-xs text-gray-500">
            Max possible total per entry (5 judges): <strong>{settings.max_score * 5}</strong>
          </p>
        </div>
        <div className="mt-3 bg-amber-50 border border-amber-100 rounded-lg p-3">
          <p className="text-xs text-amber-700">
            Changing this does <strong>not</strong> rescale scores already submitted. Change it
            before Round 1 opens, or only between rounds — not mid-way through judging, or
            existing scores and new scores will be on different scales in the same total.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-bold text-gray-800 mb-1">Round 1</h3>
        <Toggle
          label="Round 1 Open"
          description="Judges can submit scores for Round 1"
          checked={settings.round1_status === 'open'}
          onChange={(v) => save({ round1_status: v ? 'open' : 'closed' })}
          disabled={saving || settings.frozen}
        />
        <Toggle
          label="Allow Re-evaluation"
          description="Judges may edit a Round 1 score after saving it"
          checked={settings.allow_reevaluation}
          onChange={(v) => save({ allow_reevaluation: v })}
          disabled={saving || settings.frozen}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-bold text-gray-800 mb-3">Qualification</h3>
        <div className="flex gap-3 mb-3">
          <select
            value={settings.qualification_method}
            onChange={(e) => save({ qualification_method: e.target.value })}
            disabled={saving || settings.frozen}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="top_n">Top N</option>
            <option value="min_score">Minimum Score</option>
          </select>
          <input
            type="number"
            min={1}
            value={settings.qualification_value}
            onChange={(e) => setSettings({ ...settings, qualification_value: Number(e.target.value) })}
            onBlur={(e) => save({ qualification_value: Number(e.target.value) })}
            disabled={saving || settings.frozen}
            className="w-28 px-3 py-2 border rounded-lg text-sm"
          />
        </div>
        <p className="text-xs text-gray-500">
          {settings.qualification_method === 'top_n'
            ? `Top ${settings.qualification_value} highest-scoring entries qualify for Round 2.`
            : `Entries scoring ${settings.qualification_value} or above qualify for Round 2.`}
        </p>
        <div className="mt-3 bg-amber-50 border border-amber-100 rounded-lg p-3 flex items-center justify-between gap-3">
          <p className="text-xs text-amber-700">
            Changing the method or value above does <strong>not</strong> retroactively update Round 1
            Results — it only takes effect the next time qualification is run.
          </p>
          <button
            onClick={handleRunQualification}
            disabled={qualifying || settings.frozen}
            className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-dark disabled:opacity-50"
          >
            <Play size={12} /> {qualifying ? 'Running…' : 'Run Qualification Now'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-bold text-gray-800 mb-1">Verification</h3>
        <Toggle
          label="Verification Open"
          description="Admin can process the identity verification queue"
          checked={settings.verification_status === 'open'}
          onChange={(v) => save({ verification_status: v ? 'open' : 'closed' })}
          disabled={saving || settings.frozen}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-bold text-gray-800 mb-1">Round 2</h3>
        <Toggle
          label="Round 2 Open"
          description="Judges see only qualified entries, only their own score"
          checked={settings.round2_status === 'open'}
          onChange={(v) => save({ round2_status: v ? 'open' : 'closed' })}
          disabled={saving || settings.frozen}
        />
        <Toggle
          label="Round 2 Scoring Enabled"
          description="Off = discussion only, judges cannot submit scores"
          checked={settings.round2_scoring_enabled}
          onChange={(v) => save({ round2_scoring_enabled: v })}
          disabled={saving || settings.frozen}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-bold text-gray-800 mb-1">Publishing</h3>
        <Toggle
          label="Publish Results"
          description="Make final results visible externally"
          checked={settings.results_published}
          onChange={(v) => save({ results_published: v })}
          disabled={saving || settings.frozen}
        />
      </div>

      <div className="bg-red-50 rounded-xl border border-red-100 p-5">
        <h3 className="font-bold text-red-700 mb-1">Danger Zone</h3>
        <Toggle
          label="Freeze Competition"
          description="Immediately locks ALL judging, both rounds. Cannot be undone lightly."
          checked={settings.frozen}
          onChange={(v) => {
            if (v && !window.confirm('This immediately locks all judging for both rounds. Continue?')) return;
            save({ frozen: v });
          }}
          disabled={saving}
        />

        <div className="pt-4 mt-2 border-t border-red-200">
          <p className="font-medium text-gray-800 flex items-center gap-2 mb-1">
            <RotateCcw size={16} className="text-red-600" /> Reset Evaluation Data (testing only)
          </p>
          <p className="text-xs text-gray-500 mb-3">
            Clears submitted scores so you can re-test the flow. Entries, judges, and settings are
            untouched. The audit log is preserved — this action itself is not logged there, so use
            it deliberately.
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            <select
              value={resetScope}
              onChange={(e) => setResetScope(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="scores">Scores only</option>
              <option value="full">Scores + qualification + winners (full reset)</option>
            </select>
            <select
              value={resetRound}
              onChange={(e) => setResetRound(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="">Both rounds</option>
              <option value="1">Round 1 only</option>
              <option value="2">Round 2 only</option>
            </select>
            <select
              value={resetJudgeId}
              onChange={(e) => setResetJudgeId(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="">All judges</option>
              {judges.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.full_name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleReset}
            disabled={resetting}
            className="px-4 py-2 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 text-sm"
          >
            {resetting ? 'Resetting…' : 'Reset Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvaluationSettings;