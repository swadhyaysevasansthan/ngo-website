import React, { useState } from 'react';

import useSneacAdmin from './useSneacAdmin';
import { parseMaybeJSON } from './sneacHelpers';

import AccessRequestsPanel from './AccessRequestsPanel';
import RegistrationsPanel from './RegistrationsPanel';
import RegistrationDetailsModal from './RegistrationDetailsModal';
import DateAllotmentModal from './DateAllotmentModal';
import RejectRequestModal from './RejectRequestModal';

// 🔥 SNEAC Admin Panel — orchestrator only.
// All data/mutations live in useSneacAdmin(); all heavy rendering lives in
// the panel/modal components. This file just wires them together.
const SneacAdminTab = () => {
  const [subTab, setSubTab] = useState('requests');

  const {
    requests,
    paintingRegs,
    quizRegs,
    loading,
    actionLoading,
    approveRequest,
    rejectRequest,
    resendLink,
    allotPaintingDates,
    allotQuizDate,
    sendConfirmation,
  } = useSneacAdmin();

  // Registration currently open in the details modal
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  // Registration currently open in the date-allotment modal
  const [dateModal, setDateModal] = useState(null);
  // Access request currently open in the reject modal
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  // ── DATE MODAL ───────────────────────────────────────────
  const openDateModal = (reg) => {
    if (subTab === 'painting') {
      setDateModal({
        id: reg.id,
        schoolName: reg.school_name,
        competitionType: 'painting',
        primaryDates: parseMaybeJSON(reg.primary_preferred_dates),
        secondaryDates: parseMaybeJSON(reg.secondary_preferred_dates),
        primaryAllottedDate: reg.primary_allotted_date || '',
        secondaryAllottedDate: reg.secondary_allotted_date || '',
      });
    } else {
      setDateModal({
        id: reg.id,
        schoolName: reg.school_name,
        competitionType: 'quiz',
        dates: parseMaybeJSON(reg.preferred_dates),
        allottedDate: reg.allotted_date || '',
      });
    }
  };

  const handleSaveDates = async () => {
    if (!dateModal) return;
    const success =
      dateModal.competitionType === 'painting'
        ? await allotPaintingDates(dateModal.id, {
            primaryAllottedDate: dateModal.primaryAllottedDate || null,
            secondaryAllottedDate: dateModal.secondaryAllottedDate || null,
          })
        : await allotQuizDate(dateModal.id, dateModal.allottedDate);

    if (success) {
      setDateModal(null);
      setSelectedRegistration(null);
    }
  };

  // ── REJECT MODAL ─────────────────────────────────────────
  const handleRejectConfirm = async () => {
    if (!rejectTarget) return;
    const success = await rejectRequest(rejectTarget.id, rejectionReason);
    if (success) {
      setRejectTarget(null);
      setRejectionReason('');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* SUB TABS */}
      <div className="flex gap-3 mb-6 border-b pb-3 overflow-x-auto">
        {[
          { id: 'requests', label: '📋 Access Requests', badge: pendingCount },
          { id: 'painting', label: `🎨 Painting Registrations (${paintingRegs.length})` },
          { id: 'quiz', label: `🧠 Quiz Registrations (${quizRegs.length})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            className={`px-5 py-2.5 font-semibold rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
              subTab === t.id ? 'bg-primary text-white shadow' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {t.label}
            {t.badge > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {subTab === 'requests' && (
        <AccessRequestsPanel
          requests={requests}
          actionLoading={actionLoading}
          onApprove={approveRequest}
          onReject={setRejectTarget}
          onResendLink={resendLink}
        />
      )}

      {(subTab === 'painting' || subTab === 'quiz') && (
        <RegistrationsPanel
          competitionType={subTab}
          registrations={subTab === 'painting' ? paintingRegs : quizRegs}
          onViewDetails={setSelectedRegistration}
        />
      )}

      {selectedRegistration && (
        <RegistrationDetailsModal
          registration={selectedRegistration}
          competitionType={subTab}
          actionLoading={actionLoading}
          onClose={() => setSelectedRegistration(null)}
          onOpenDateModal={openDateModal}
          onSendConfirmation={sendConfirmation}
        />
      )}

      <DateAllotmentModal
        dateModal={dateModal}
        setDateModal={setDateModal}
        onSave={handleSaveDates}
        onClose={() => setDateModal(null)}
        actionLoading={actionLoading}
      />

      {rejectTarget && (
        <RejectRequestModal
          rejectionReason={rejectionReason}
          setRejectionReason={setRejectionReason}
          onConfirm={handleRejectConfirm}
          onCancel={() => {
            setRejectTarget(null);
            setRejectionReason('');
          }}
        />
      )}
    </div>
  );
};

export default SneacAdminTab;