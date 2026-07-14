import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Plus, Pencil, Trash2, Power, KeyRound, Loader2, Copy, Check } from 'lucide-react';
import { evaluationAdminAPI } from '../../utils/api';

const CredentialModal = ({ credential, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`Username: ${credential.username}\nPassword: ${credential.password}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-1">Judge Credentials</h3>
        <p className="text-sm text-amber-600 mb-4">This password will not be shown again — copy it now.</p>
        <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm font-mono">
          <p><span className="text-gray-500">Username:</span> {credential.username}</p>
          <p><span className="text-gray-500">Password:</span> {credential.password}</p>
        </div>
        <div className="flex gap-3 mt-5">
          <button
            onClick={handleCopy}
            className="flex-1 py-2.5 rounded-lg font-semibold border-2 border-primary text-primary hover:bg-primary/5 flex items-center justify-center gap-2"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copied' : 'Copy'}
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg font-semibold bg-primary text-white hover:bg-primary-dark">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

const JudgeFormModal = ({ initial, onClose, onSubmit }) => {
  const [fullName, setFullName] = useState(initial?.full_name || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSubmit(fullName);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">{initial ? 'Edit Judge' : 'Add Judge'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="Judge's full name"
              required
              autoFocus
            />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg font-semibold border-2 border-gray-200 text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-lg font-semibold bg-primary text-white hover:bg-primary-dark disabled:opacity-60">
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const JudgeManagement = () => {
  const [judges, setJudges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formModal, setFormModal] = useState(null); // null | 'new' | judge object
  const [credential, setCredential] = useState(null);

  const loadJudges = useCallback(async () => {
    try {
      const res = await evaluationAdminAPI.getJudges();
      setJudges(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load judges');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJudges();
  }, [loadJudges]);

  const handleCreate = async (fullName) => {
    try {
      const res = await evaluationAdminAPI.createJudge(fullName);
      toast.success('Judge created');
      setFormModal(null);
      setCredential({ username: res.data.data.username, password: res.data.data.password });
      loadJudges();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create judge');
    }
  };

  const handleEdit = async (fullName) => {
    try {
      await evaluationAdminAPI.updateJudge(formModal.id, fullName);
      toast.success('Judge updated');
      setFormModal(null);
      loadJudges();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update judge');
    }
  };

  const handleDelete = async (judge) => {
    if (!window.confirm(`Delete judge "${judge.full_name}"? This cannot be undone.`)) return;
    try {
      await evaluationAdminAPI.deleteJudge(judge.id);
      toast.success('Judge deleted');
      loadJudges();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete judge');
    }
  };

  const handleToggleActive = async (judge) => {
    try {
      await evaluationAdminAPI.toggleJudgeActive(judge.id, !judge.is_active);
      toast.success(judge.is_active ? 'Judge disabled' : 'Judge enabled');
      loadJudges();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update judge status');
    }
  };

  const handleResetPassword = async (judge) => {
    if (!window.confirm(`Regenerate password for "${judge.full_name}"? Their old password will stop working.`)) return;
    try {
      const res = await evaluationAdminAPI.resetJudgePassword(judge.id);
      setCredential({ username: res.data.data.username, password: res.data.data.password });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    }
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleString() : '—');

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">Judges ({judges.length}/5)</h2>
        <button
          onClick={() => setFormModal('new')}
          disabled={judges.length >= 5}
          className="px-4 py-2 rounded-lg font-semibold bg-primary text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Plus size={16} /> Add Judge
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-primary" size={28} />
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Progress</th>
                <th className="px-4 py-3">Last Login</th>
                <th className="px-4 py-3">Last Activity</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {judges.map((judge) => (
                <tr key={judge.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-800">{judge.full_name}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono">{judge.username}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {judge.reviewed}/{judge.reviewed + judge.pending} ({judge.completionPct}%)
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(judge.last_login)}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(judge.last_activity)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        judge.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {judge.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setFormModal(judge)} title="Edit" className="p-1.5 text-gray-400 hover:text-primary">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleResetPassword(judge)} title="Reset password" className="p-1.5 text-gray-400 hover:text-blue-600">
                        <KeyRound size={16} />
                      </button>
                      <button onClick={() => handleToggleActive(judge)} title={judge.is_active ? 'Disable' : 'Enable'} className="p-1.5 text-gray-400 hover:text-amber-600">
                        <Power size={16} />
                      </button>
                      <button onClick={() => handleDelete(judge)} title="Delete" className="p-1.5 text-gray-400 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {judges.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                    No judges yet. Add up to 5 to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {formModal && (
        <JudgeFormModal
          initial={formModal === 'new' ? null : formModal}
          onClose={() => setFormModal(null)}
          onSubmit={formModal === 'new' ? handleCreate : handleEdit}
        />
      )}

      {credential && <CredentialModal credential={credential} onClose={() => setCredential(null)} />}
    </div>
  );
};

export default JudgeManagement;
