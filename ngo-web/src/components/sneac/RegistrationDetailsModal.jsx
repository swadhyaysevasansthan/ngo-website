import React from 'react';
import { formatDate, parseMaybeJSON, getCategories, isFullyAllotted } from './sneacHelpers';

// 🔥 SNEAC — full detail view + actions for a single registration.
// This is where "Allot/Change Dates" and "Send/Resend Confirmation" live,
// keeping the table row itself lightweight.
const RegistrationDetailsModal = ({
  registration,
  competitionType,
  actionLoading,
  onClose,
  onOpenDateModal,
  onSendConfirmation,
}) => {
  if (!registration) return null;
  const reg = registration;
  const isPainting = competitionType === 'painting';
  const categories = isPainting ? getCategories(reg) : [];
  const fullyAllotted = isFullyAllotted(reg, competitionType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-xl font-bold text-gray-800">{reg.school_name}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ✕
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-6">{reg.school_email}</p>

        {/* SCHOOL SUMMARY */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 text-sm">
          <div>
            <div className="text-xs text-gray-500">City / State</div>
            <div className="font-semibold">
              {reg.city}, {reg.state}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Total Students</div>
            <div className="font-semibold">{reg.total_participants}</div>
          </div>
          {!isPainting && (
            <div>
              <div className="text-xs text-gray-500">Computers</div>
              <div className="font-semibold">{reg.available_computers}</div>
            </div>
          )}
        </div>

        {/* TEACHERS */}
        <div className="mb-6">
          <h4 className="font-bold text-gray-700 mb-2 text-sm">Teachers</h4>
          <div className="grid sm:grid-cols-2 gap-2">
            {reg.teachers?.map((teacher, index) => (
              <div
                key={teacher.id || index}
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
              >
                <div className="font-semibold text-sm">{teacher.teacher_name}</div>
                <div className="text-xs text-gray-500">{teacher.teacher_email}</div>
                <div className="text-xs text-gray-500">{teacher.teacher_phone}</div>
                {teacher.designation && (
                  <div className="text-xs text-gray-600 mt-1">{teacher.designation}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* DATES */}
        <div className="mb-6">
          <h4 className="font-bold text-gray-700 mb-2 text-sm">Dates</h4>
          {isPainting ? (
            <div className="grid sm:grid-cols-2 gap-4">
              <DateBlock
                label="Primary Category"
                participating={categories.includes('primary')}
                preferredDates={parseMaybeJSON(reg.primary_preferred_dates)}
                allottedDate={reg.primary_allotted_date}
              />
              <DateBlock
                label="Secondary Category"
                participating={categories.includes('secondary')}
                preferredDates={parseMaybeJSON(reg.secondary_preferred_dates)}
                allottedDate={reg.secondary_allotted_date}
              />
            </div>
          ) : (
            <DateBlock
              label="Preferred Dates"
              participating
              preferredDates={parseMaybeJSON(reg.preferred_dates)}
              allottedDate={reg.allotted_date}
            />
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-3 justify-end pt-4 border-t">
          <button
            onClick={() => onOpenDateModal(reg)}
            className="px-4 py-2 rounded-xl bg-blue-100 text-blue-700 font-semibold text-sm hover:bg-blue-200"
          >
            📅 {fullyAllotted ? 'Change Dates' : 'Allot Dates'}
          </button>
          {fullyAllotted && (
            <button
              disabled={actionLoading === reg.id}
              onClick={() => onSendConfirmation(reg.id, reg.school_name, reg.confirmation_sent)}
              className={`px-4 py-2 rounded-xl font-semibold text-sm ${
                reg.confirmation_sent
                  ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              📧 {reg.confirmation_sent ? 'Resend Confirmation' : 'Send Confirmation'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const DateBlock = ({ label, participating, preferredDates, allottedDate }) => (
  <div>
    <div className="font-semibold text-gray-700 mb-1 text-sm">{label}</div>
    {!participating ? (
      <span className="text-gray-400 text-xs">Not Participating</span>
    ) : (
      <>
        <div className="text-xs text-gray-500 mb-1">Preferred</div>
        {(preferredDates || []).map((d, i) => (
          <div key={i} className="text-xs">
            {formatDate(d)}
          </div>
        ))}
        <div className="text-xs font-semibold text-green-700 mt-2">Allotted</div>
        {allottedDate ? (
          <div className="text-xs font-semibold text-green-700">{formatDate(allottedDate)}</div>
        ) : (
          <div className="text-xs text-gray-400">Not allotted</div>
        )}
      </>
    )}
  </div>
);

export default RegistrationDetailsModal;