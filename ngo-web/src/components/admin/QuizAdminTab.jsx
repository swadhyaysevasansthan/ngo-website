import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { quizSettingsAPI } from '../../utils/api';
import Card from '../Card1';
import Button from '../Button1';

/**
 * QuizAdminTab — Manages quiz entries (url, access code, metadata) and
 * the question bank access code from the admin dashboard.
 *
 * Passwords / access codes are stored and displayed in plain text so the
 * admin can easily view, copy, or update them.
 */
const QuizAdminTab = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Question bank
  const [questionBankCode, setQuestionBankCode] = useState('');

  // Quizzes list
  const [quizzes, setQuizzes] = useState([]);

  // Copy-to-clipboard helper
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(
      () => toast.success(`${label} copied to clipboard`),
      () => toast.error('Failed to copy')
    );
  };

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await quizSettingsAPI.getAdmin();
      const { quizzes: fetchedQuizzes, questionBankCode: qbCode } = res.data.data;
      setQuizzes(fetchedQuizzes || []);
      setQuestionBankCode(qbCode || '');
    } catch (err) {
      toast.error('Failed to load quiz settings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // ─── Quiz list helpers ────────────────────────────────────────────────────

  const handleQuizChange = (index, field, value) => {
    setQuizzes((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    );
  };

  const handleAddQuiz = () => {
    setQuizzes((prev) => [
      ...prev,
      {
        title: 'Environmental Awareness Quiz',
        description:
          'Test your knowledge about environmental conservation, climate change, biodiversity, and sustainable practices. Learn about the importance of protecting our planet.',
        url: '',
        duration: '10 minutes',
        questions: '25 questions',
        access_code: '',
        sort_order: prev.length,
      },
    ]);
  };

  const handleRemoveQuiz = (index) => {
    if (!window.confirm('Remove this quiz?')) return;
    setQuizzes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    setQuizzes((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const handleMoveDown = (index) => {
    setQuizzes((prev) => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  };

  // ─── Save ─────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    // Validate
    for (let i = 0; i < quizzes.length; i++) {
      const q = quizzes[i];
      if (!q.url.trim()) {
        toast.error(`Quiz #${i + 1}: URL is required`);
        return;
      }
      if (!q.access_code.trim()) {
        toast.error(`Quiz #${i + 1}: Access code is required`);
        return;
      }
    }

    setSaving(true);
    try {
      await quizSettingsAPI.update({
        quizzes: quizzes.map((q, i) => ({ ...q, sort_order: i })),
        questionBankCode,
      });
      toast.success('Quiz settings saved successfully!');
      fetchSettings(); // re-fetch to get fresh IDs
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save quiz settings');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">🧠 Quiz & Question Bank Settings</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage quiz Microsoft Form links, access codes, and the Question Bank access code.
            Access codes are shown in plain text so you can view or copy them at any time.
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          size="large"
        >
          {saving ? '⏳ Saving…' : '💾 Save All Changes'}
        </Button>
      </div>

      {/* ── Question Bank Code ── */}
      <Card>
        <h3 className="text-lg font-bold mb-4">📖 Question Bank Access Code</h3>
        <p className="text-sm text-gray-500 mb-4">
          This code is required by students/teachers to view the PDF question bank on the Question Bank page.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Current Access Code
            </label>
            <input
              type="text"
              value={questionBankCode}
              onChange={(e) => setQuestionBankCode(e.target.value)}
              placeholder="Enter question bank access code"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg font-mono focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard(questionBankCode, 'Question bank code')}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors whitespace-nowrap mt-5 sm:mt-6"
            title="Copy to clipboard"
          >
            📋 Copy
          </button>
        </div>
      </Card>

      {/* ── Quizzes ── */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h3 className="text-lg font-bold">🔗 Quiz Entries</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Each quiz has a unique access code. When a user enters the correct code on the Quiz page,
              they are redirected to that Microsoft Form link.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddQuiz}
            className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors whitespace-nowrap text-sm"
          >
            + Add Quiz
          </button>
        </div>

        {quizzes.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">🧠</div>
            <p className="font-semibold text-lg">No quizzes yet</p>
            <p className="text-sm mt-1">Click "Add Quiz" to create your first entry.</p>
          </div>
        )}

        <div className="space-y-6">
          {quizzes.map((quiz, index) => (
            <div
              key={index}
              className="border-2 border-gray-200 rounded-xl p-5 bg-gray-50 hover:border-primary/40 transition-colors"
            >
              {/* Quiz header */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-gray-700 text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                  Quiz #{index + 1}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 disabled:opacity-30 transition-colors text-sm"
                    title="Move up"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === quizzes.length - 1}
                    className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 disabled:opacity-30 transition-colors text-sm"
                    title="Move down"
                  >
                    ▼
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveQuiz(index)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors text-sm font-bold"
                    title="Remove quiz"
                  >
                    ✕ Remove
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                    Quiz Title
                  </label>
                  <input
                    type="text"
                    value={quiz.title}
                    onChange={(e) => handleQuizChange(index, 'title', e.target.value)}
                    placeholder="e.g. Environmental Awareness Quiz"
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none bg-white"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={quiz.description}
                    onChange={(e) => handleQuizChange(index, 'description', e.target.value)}
                    placeholder="Brief quiz description shown to participants"
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none bg-white resize-none"
                  />
                </div>

                {/* Microsoft Form URL */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                    Microsoft Form URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={quiz.url}
                    onChange={(e) => handleQuizChange(index, 'url', e.target.value)}
                    placeholder="https://forms.cloud.microsoft/r/..."
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm font-mono focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none bg-white"
                  />
                  {quiz.url && (
                    <a
                      href={quiz.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-1 text-xs text-primary hover:underline"
                    >
                      ↗ Open form link
                    </a>
                  )}
                </div>

                {/* Access Code */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                    Access Code <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={quiz.access_code}
                      onChange={(e) => handleQuizChange(index, 'access_code', e.target.value)}
                      placeholder="e.g. quiz1code"
                      className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm font-mono focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(quiz.access_code, `Quiz #${index + 1} code`)}
                      className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                      title="Copy code"
                    >
                      📋
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Case-insensitive. Students enter this to unlock the quiz.
                  </p>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={quiz.duration}
                    onChange={(e) => handleQuizChange(index, 'duration', e.target.value)}
                    placeholder="e.g. 10 minutes"
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none bg-white"
                  />
                </div>

                {/* Questions */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                    Number of Questions
                  </label>
                  <input
                    type="text"
                    value={quiz.questions}
                    onChange={(e) => handleQuizChange(index, 'questions', e.target.value)}
                    placeholder="e.g. 25 questions"
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none bg-white"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {quizzes.length > 0 && (
          <div className="mt-6 pt-5 border-t border-gray-200 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {quizzes.length} quiz{quizzes.length !== 1 ? 'zes' : ''} configured
            </p>
            <Button
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? '⏳ Saving…' : '💾 Save All Changes'}
            </Button>
          </div>
        )}
      </Card>

      {/* ── Access Code Summary ── */}
      {quizzes.length > 0 && (
        <Card>
          <h3 className="text-lg font-bold mb-4">🔑 Access Code Summary</h3>
          <p className="text-sm text-gray-500 mb-4">
            Quick reference — all access codes at a glance.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">#</th>
                  <th className="px-4 py-2 text-left font-semibold">Title</th>
                  <th className="px-4 py-2 text-left font-semibold">Access Code</th>
                  <th className="px-4 py-2 text-left font-semibold">Form Link</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map((quiz, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3 font-medium">{quiz.title || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <code className="bg-primary/10 text-primary px-2 py-0.5 rounded font-mono text-xs">
                          {quiz.access_code || '—'}
                        </code>
                        {quiz.access_code && (
                          <button
                            type="button"
                            onClick={() => copyToClipboard(quiz.access_code, `Quiz #${i + 1} code`)}
                            className="text-xs text-gray-400 hover:text-gray-600"
                            title="Copy"
                          >
                            📋
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {quiz.url ? (
                        <a
                          href={quiz.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-xs truncate block max-w-xs"
                        >
                          {quiz.url}
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {/* Question Bank row */}
                <tr className="border-b bg-blue-50/50 hover:bg-blue-50">
                  <td className="px-4 py-3 text-gray-500">QB</td>
                  <td className="px-4 py-3 font-medium text-blue-700">📖 Question Bank</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <code className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-mono text-xs">
                        {questionBankCode || '—'}
                      </code>
                      {questionBankCode && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(questionBankCode, 'Question bank code')}
                          className="text-xs text-gray-400 hover:text-gray-600"
                          title="Copy"
                        >
                          📋
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">PDF viewer (internal)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default QuizAdminTab;
