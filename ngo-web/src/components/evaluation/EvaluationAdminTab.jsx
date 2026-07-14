import React, { useState } from 'react';
import JudgeManagement from './JudgeManagement';
import EvaluationSettings from './EvaluationSettings';
import EvaluationResultsGrid from './EvaluationResultsGrid';
import VerificationQueue from './VerificationQueue';
import WinnerSelection from './WinnerSelection';
import AuditLog from './AuditLog';

const SUB_TABS = [
  { id: 'judges', label: 'Judges' },
  { id: 'settings', label: 'Settings' },
  { id: 'results', label: 'Round 1 Results' },
  { id: 'verification', label: 'Verification' },
  { id: 'winners', label: 'Winners' },
  { id: 'audit', label: 'Audit Log' },
];

const EvaluationAdminTab = () => {
  const [subTab, setSubTab] = useState('judges');

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-4 mb-2">
        {SUB_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
              subTab === tab.id
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {subTab === 'judges' && <JudgeManagement />}
      {subTab === 'settings' && <EvaluationSettings />}
      {subTab === 'results' && <EvaluationResultsGrid />}
      {subTab === 'verification' && <VerificationQueue />}
      {subTab === 'winners' && <WinnerSelection />}
      {subTab === 'audit' && <AuditLog />}
    </div>
  );
};

export default EvaluationAdminTab;
