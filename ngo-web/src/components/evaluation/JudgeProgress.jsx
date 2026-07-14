import React from 'react';
import { AlertTriangle, Lock } from 'lucide-react';

const JudgeProgress = ({ dashboard, onContinueReviewing }) => {
  if (!dashboard) return null;

  const { fullName, round, totalEntries, reviewed, pending, completionPct, frozen, roundOpen } = dashboard;

  return (
    <div className="space-y-4">
      {frozen && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 flex items-center gap-3 text-sm font-medium">
          <Lock size={20} className="shrink-0" />
          <span>The competition is frozen. All judging is locked — you can still view entries, but scores cannot be submitted or changed.</span>
        </div>
      )}
      {!frozen && !roundOpen && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-xl p-4 flex items-center gap-3 text-sm font-medium">
          <AlertTriangle size={20} className="shrink-0" />
          <span>Round {round} is not currently open for scoring. You can browse entries, but the admin needs to open this round before you can submit scores.</span>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Welcome, {fullName}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Round {round} {frozen ? '· Competition frozen' : roundOpen ? '· Open for scoring' : '· Currently closed'}
          </p>
        </div>
        <button
          onClick={onContinueReviewing}
          disabled={frozen || !roundOpen || pending === 0}
          className="px-5 py-2.5 rounded-lg font-semibold bg-primary text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending === 0 ? 'All entries reviewed' : 'Continue Reviewing'}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-gray-800">{totalEntries}</p>
          <p className="text-xs text-gray-500 mt-1">Total Entries</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{reviewed}</p>
          <p className="text-xs text-gray-500 mt-1">Reviewed</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{pending}</p>
          <p className="text-xs text-gray-500 mt-1">Pending</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{completionPct}%</p>
          <p className="text-xs text-gray-500 mt-1">Completion</p>
        </div>
      </div>

      <div className="w-full h-2 bg-gray-100 rounded-full mt-5 overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${completionPct}%` }}
        />
      </div>
      </div>
    </div>
  );
};

export default JudgeProgress;