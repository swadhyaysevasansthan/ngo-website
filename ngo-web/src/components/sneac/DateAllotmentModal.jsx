import React from 'react';
import { formatDateLong } from './sneacHelpers';

// 🔥 SNEAC — date picker modal for allotting/changing painting or quiz dates.
// `dateModal` shape is built by buildDateModalState() in sneacHelpers-adjacent
// logic inside the parent (see SneacAdminTab openDateModal).
const DateAllotmentModal = ({ dateModal, setDateModal, onSave, onClose, actionLoading }) => {
  if (!dateModal) return null;
  const isPainting = dateModal.competitionType === 'painting';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-1">Allot Competition Date</h3>
        <p className="text-sm text-gray-600 mb-6">
          <strong>{dateModal.schoolName}</strong>
          {' · '}
          {dateModal.competitionType}
        </p>

        {isPainting ? (
          <div className="space-y-8">
            <DateOptionGroup
              title="Primary Category"
              titleClassName="text-blue-700"
              dates={dateModal.primaryDates}
              selected={dateModal.primaryAllottedDate}
              onSelect={(d) =>
                setDateModal((prev) => ({ ...prev, primaryAllottedDate: d }))
              }
            />
            <DateOptionGroup
              title="Secondary Category"
              titleClassName="text-purple-700"
              dates={dateModal.secondaryDates}
              selected={dateModal.secondaryAllottedDate}
              onSelect={(d) =>
                setDateModal((prev) => ({ ...prev, secondaryAllottedDate: d }))
              }
            />
          </div>
        ) : (
          <DateOptionGroup
            dates={dateModal.dates}
            selected={dateModal.allottedDate}
            onSelect={(d) => setDateModal((prev) => ({ ...prev, allottedDate: d }))}
          />
        )}

        <div className="flex gap-3 justify-end mt-8">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            disabled={actionLoading === dateModal.id}
            onClick={onSave}
            className="px-5 py-2 rounded-xl bg-primary text-white font-semibold hover:opacity-90"
          >
            {actionLoading === dateModal.id ? 'Saving...' : 'Save Dates'}
          </button>
        </div>
      </div>
    </div>
  );
};

const DateOptionGroup = ({ title, titleClassName, dates, selected, onSelect }) => (
  <div>
    {title && <h4 className={`font-bold mb-3 ${titleClassName}`}>{title}</h4>}
    <div className="grid gap-3">
      {dates.map((d, i) => (
        <label
          key={i}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer ${
            selected === d ? 'border-primary bg-primary/5' : 'border-gray-200'
          }`}
        >
          <input type="radio" checked={selected === d} onChange={() => onSelect(d)} />
          <span>{formatDateLong(d)}</span>
        </label>
      ))}
    </div>
  </div>
);

export default DateAllotmentModal;