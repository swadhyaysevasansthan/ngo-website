import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { schoolAccessAPI, schoolRegistrationAPI } from '../utils/api';
import Card from './Card1';

const STATUS_COLORS = {
  pending:  'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

const SneacAdminTab = () => {
  const [subTab, setSubTab] = useState('requests');
  const [requests, setRequests]       = useState([]);
  const [paintingRegs, setPaintingRegs] = useState([]);
  const [quizRegs, setQuizRegs]         = useState([]);
  const [loading, setLoading]           = useState(true);

  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch]             = useState('');

  const [actionLoading, setActionLoading]     = useState(null);
  const [rejectModal, setRejectModal]         = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Date modal state
  const [dateModal, setDateModal]         = useState(null);
  const [dateModalDates, setDateModalDates] = useState([]); // the 4 preferred dates
  const [allottedDate, setAllottedDate]   = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [reqRes, paintRes, quizRes] = await Promise.all([
        schoolAccessAPI.listRequests(),
        schoolRegistrationAPI.listRegistrations('painting'),
        schoolRegistrationAPI.listRegistrations('quiz'),
      ]);
      setRequests(reqRes.data.data || []);
      setPaintingRegs(paintRes.data.data || []);
      setQuizRegs(quizRes.data.data || []);
    } catch (err) {
      toast.error('Failed to load SNEAC data');
    } finally {
      setLoading(false);
    }
  };

  // ── Access Request Actions ──────────────────────────────

  const handleApprove = async (id) => {
    if (!window.confirm('Approve this request and send registration link?')) return;
    setActionLoading(id);
    try {
      await schoolAccessAPI.approveRequest(id);
      toast.success('Request approved and link sent.');
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve request.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectModal) return;
    setActionLoading(rejectModal.id);
    try {
      await schoolAccessAPI.rejectRequest(rejectModal.id, rejectionReason);
      toast.success('Request rejected.');
      setRejectModal(null);
      setRejectionReason('');
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject request.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleResendLink = async (id) => {
    if (!window.confirm('Invalidate old link and send a new one?')) return;
    setActionLoading(id);
    try {
      await schoolAccessAPI.resendLink(id);
      toast.success('New link generated and sent.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend link.');
    } finally {
      setActionLoading(null);
    }
  };

  // ── Registration Actions ────────────────────────────────

  const openDateModal = (reg) => {
    const dates = typeof reg.preferred_dates === 'string'
      ? JSON.parse(reg.preferred_dates)
      : reg.preferred_dates;
    setDateModalDates(dates);
    // Pre-select currently allotted date if it matches one of the 4 options
    setAllottedDate(dates.includes(reg.allotted_date) ? reg.allotted_date : '');
    setDateModal({
      id: reg.id,
      schoolName: reg.school_name,
      competitionType: reg.competition_type,
      currentDate: reg.allotted_date,
    });
  };

  const closeDateModal = () => {
    setDateModal(null);
    setAllottedDate('');
    setDateModalDates([]);
  };

  const handleAllotDate = async () => {
    if (!dateModal || !allottedDate) return;
    setActionLoading(dateModal.id);
    try {
      await schoolRegistrationAPI.allotDate(dateModal.id, allottedDate);
      toast.success('Date allotted successfully.');
      closeDateModal();
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to allot date.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendConfirmation = async (id, schoolName, isResend) => {
    const confirmMsg = isResend
      ? `A confirmation was already sent. Send again with the updated date to ${schoolName}?`
      : `Send date confirmation email to ${schoolName}?`;
    if (!window.confirm(confirmMsg)) return;

    setActionLoading(id);
    try {
      const res = await schoolRegistrationAPI.sendConfirmation(id);
      toast.success(res.data.message || 'Confirmation sent.');
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send confirmation.');
    } finally {
      setActionLoading(null);
    }
  };

  // ── Filtered requests ───────────────────────────────────

  const filteredRequests = requests.filter((r) => {
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      r.school_name.toLowerCase().includes(q) ||
      r.school_email.toLowerCase().includes(q) ||
      r.city.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  // ── Helpers ─────────────────────────────────────────────

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });

  const parseDates = (raw) =>
    typeof raw === 'string' ? JSON.parse(raw) : raw;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">

      {/* Sub-tab bar */}
      <div className="flex gap-3 mb-6 border-b pb-3 overflow-x-auto">
        {[
          { id: 'requests', label: '📋 Access Requests', badge: pendingCount },
          { id: 'painting', label: `🎨 Painting Registrations (${paintingRegs.length})` },
          { id: 'quiz',     label: `🧠 Quiz Registrations (${quizRegs.length})` },
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
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{t.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── ACCESS REQUESTS ── */}
      {subTab === 'requests' && (
        <>
          <div className="flex flex-wrap gap-3 mb-5">
            <input
              type="text"
              placeholder="Search school name, email, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-48 px-4 py-2 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-primary"
            />
            {['all', 'pending', 'approved', 'rejected'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                  statusFilter === s ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {s} ({s === 'all' ? requests.length : requests.filter(r => r.status === s).length})
              </button>
            ))}
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">School</th>
                    <th className="px-4 py-3 text-left">Principal</th>
                    <th className="px-4 py-3 text-left">City / State</th>
                    <th className="px-4 py-3 text-left">Board</th>
                    <th className="px-4 py-3 text-left">Eco Club</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Submitted</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                        No requests found.
                      </td>
                    </tr>
                  )}
                  {filteredRequests.map((r) => (
                    <tr key={r.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-semibold">{r.school_name}</p>
                        <p className="text-xs text-gray-500">{r.school_email}</p>
                        <p className="text-xs text-gray-500">{r.school_email_2}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p>{r.principal_name}</p>
                        <p className="text-xs text-gray-500">{r.principal_phone}</p>
                        <p className="text-xs text-gray-500">{r.principal_email}</p>
                      </td>
                      <td className="px-4 py-3">{r.city}, {r.state}</td>
                      <td className="px-4 py-3 text-xs">{r.board_of_education}</td>
                      <td className="px-4 py-3 text-xs">{r.has_eco_club ? '✓ Yes' : 'No'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[r.status]}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(r.created_at).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1.5">
                          {r.status === 'pending' && (
                            <>
                              <button
                                disabled={actionLoading === r.id}
                                onClick={() => handleApprove(r.id)}
                                className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-200 disabled:opacity-50"
                              >
                                {actionLoading === r.id ? '...' : '✓ Approve'}
                              </button>
                              <button
                                disabled={actionLoading === r.id}
                                onClick={() => setRejectModal({ id: r.id, schoolName: r.school_name })}
                                className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-200 disabled:opacity-50"
                              >
                                ✗ Reject
                              </button>
                            </>
                          )}
                          {r.status === 'approved' && (
                            <button
                              disabled={actionLoading === r.id}
                              onClick={() => handleResendLink(r.id)}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-200 disabled:opacity-50"
                            >
                              {actionLoading === r.id ? '...' : '🔗 Resend Link'}
                            </button>
                          )}
                          {r.rejection_reason && (
                            <p className="text-xs text-gray-400 max-w-32 truncate" title={r.rejection_reason}>
                              Reason: {r.rejection_reason}
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* ── REGISTRATIONS TABLE (painting / quiz) ── */}
      {(subTab === 'painting' || subTab === 'quiz') && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">School</th>
                  <th className="px-4 py-3 text-left">Teachers</th>
                  <th className="px-4 py-3 text-left">City / State</th>
                  <th className="px-4 py-3 text-left">Total Students</th>
                  {subTab === 'quiz' && <th className="px-4 py-3 text-left">Computers</th>}
                  <th className="px-4 py-3 text-left">Preferred Dates</th>
                  <th className="px-4 py-3 text-left">Allotted Date</th>
                  <th className="px-4 py-3 text-left">Confirmation</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(subTab === 'painting' ? paintingRegs : quizRegs).length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                      No registrations yet.
                    </td>
                  </tr>
                )}
                {(subTab === 'painting' ? paintingRegs : quizRegs).map((reg) => (
                  <tr key={reg.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-semibold">{reg.school_name}</p>
                      <p className="text-xs text-gray-500">{reg.school_email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-2 min-w-[240px]">
                        {reg.teachers?.length > 0 ? (
                          reg.teachers.map((teacher, index) => (
                            <div
                              key={teacher.id || index}
                              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
                            >
                              <div className="font-semibold text-sm text-gray-800">
                                {teacher.teacher_name}
                              </div>

                              <div className="text-xs text-gray-500 mt-1">
                                {teacher.teacher_email}
                              </div>

                              <div className="text-xs text-gray-500">
                                {teacher.teacher_phone}
                              </div>

                              {teacher.designation && (
                                <div className="text-xs text-gray-600 mt-1">
                                  {teacher.designation}
                                </div>
                              )}

                              <div className="mt-1 flex gap-2 flex-wrap">
                                {teacher.category && (
                                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-semibold uppercase">
                                    {teacher.category}
                                  </span>
                                )}

                                {teacher.role && (
                                  <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-semibold uppercase">
                                    {teacher.role}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">
                            No teacher data
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">{reg.city}, {reg.state}</td>
                    <td className="px-4 py-3 text-center font-semibold">{reg.total_participants}</td>
                    {subTab === 'quiz' && (
                      <td className="px-4 py-3 text-center">{reg.available_computers}</td>
                    )}
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {parseDates(reg.preferred_dates).map((d, i) => (
                        <div key={i}>{formatDate(d)}</div>
                      ))}
                    </td>
                    <td className="px-4 py-3">
                      {reg.allotted_date ? (
                        <span className="text-green-700 font-semibold text-xs">
                          {formatDate(reg.allotted_date)}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">Not allotted</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {reg.confirmation_sent ? (
                        <div>
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs block">
                            ✓ Sent
                          </span>
                          {reg.confirmation_sent_at && (
                            <span className="text-xs text-gray-400 mt-0.5 block">
                              {formatDate(reg.confirmation_sent_at)}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">
                          Not sent
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1.5">
                        {/* Allot / Change Date */}
                        <button
                          disabled={actionLoading === reg.id}
                          onClick={() => openDateModal(reg)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-200 disabled:opacity-50"
                        >
                          📅 {reg.allotted_date ? 'Change Date' : 'Allot Date'}
                        </button>

                        {/* Send / Resend Confirmation — only shown once date is allotted */}
                        {reg.allotted_date && (
                          <button
                            disabled={actionLoading === reg.id}
                            onClick={() =>
                              handleSendConfirmation(reg.id, reg.school_name, reg.confirmation_sent)
                            }
                            className={`px-3 py-1 rounded-lg text-xs font-semibold disabled:opacity-50 ${
                              reg.confirmation_sent
                                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {actionLoading === reg.id
                              ? '...'
                              : reg.confirmation_sent
                                ? '📧 Resend Confirmation'
                                : '📧 Send Confirmation'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ── REJECT MODAL ── */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-1">Reject Request</h3>
            <p className="text-sm text-gray-600 mb-4">
              Rejecting access for <strong>{rejectModal.schoolName}</strong>. An email will be sent to the school.
            </p>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Reason <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Incomplete information provided..."
              rows="3"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-primary resize-none mb-4"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setRejectModal(null); setRejectionReason(''); }}
                className="px-5 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                disabled={actionLoading === rejectModal.id}
                onClick={handleRejectConfirm}
                className="px-5 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 disabled:opacity-50"
              >
                {actionLoading === rejectModal.id ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ALLOT DATE MODAL ── */}
      {dateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-1">Allot Competition Date</h3>
            <p className="text-sm text-gray-600 mb-4">
              <strong>{dateModal.schoolName}</strong> · {dateModal.competitionType}
            </p>

            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select one of the school's preferred dates
            </label>

            <div className="flex flex-col gap-2 mb-5">
              {dateModalDates.map((d, i) => {
                const formatted = new Date(d).toLocaleDateString('en-IN', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                });
                const isCurrentlyAllotted = dateModal.currentDate &&
                  new Date(d).toDateString() === new Date(dateModal.currentDate).toDateString();

                return (
                  <label
                    key={i}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                      allottedDate === d
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="allottedDate"
                      value={d}
                      checked={allottedDate === d}
                      onChange={() => setAllottedDate(d)}
                      className="text-primary focus:ring-primary"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-800">{formatted}</span>
                      <div className="flex gap-2 mt-0.5">
                        <span className="text-xs text-gray-400">Option {i + 1}</span>
                        {isCurrentlyAllotted && (
                          <span className="text-xs text-green-600 font-semibold">● Currently allotted</span>
                        )}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={closeDateModal}
                className="px-5 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                disabled={!allottedDate || actionLoading === dateModal.id}
                onClick={handleAllotDate}
                className="px-5 py-2 rounded-xl bg-primary text-white font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {actionLoading === dateModal.id ? 'Saving...' : 'Allot Date'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SneacAdminTab;