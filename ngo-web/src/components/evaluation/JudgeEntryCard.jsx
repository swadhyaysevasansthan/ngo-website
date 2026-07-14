import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

const JudgeEntryCard = ({ entry, onEvaluate }) => {
  const evaluated = entry.status === 'evaluated';

  return (
    <button
      onClick={() => onEvaluate(entry.entryId)}
      className={`text-left bg-white rounded-xl border-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-4 flex items-center justify-between ${
        evaluated ? 'border-green-200' : 'border-gray-100'
      }`}
    >
      <div>
        <p className="font-bold text-gray-800">Entry #{entry.entryNumber}</p>
        <p className="text-sm text-gray-500 mt-0.5">
          {evaluated ? `Your score: ${entry.myScore}` : 'Not yet reviewed'}
        </p>
      </div>
      {evaluated ? (
        <CheckCircle2 className="text-green-500 shrink-0" size={22} />
      ) : (
        <Circle className="text-gray-300 shrink-0" size={22} />
      )}
    </button>
  );
};

export default JudgeEntryCard;
