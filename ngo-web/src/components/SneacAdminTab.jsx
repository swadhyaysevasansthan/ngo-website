import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  schoolAccessAPI,
  schoolRegistrationAPI,
} from '../utils/api';

import Card from './Card1';

const STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

const SneacAdminTab = () => {
  const [subTab, setSubTab] =
    useState('requests');

  const [requests, setRequests] =
    useState([]);

  const [paintingRegs, setPaintingRegs] =
    useState([]);

  const [quizRegs, setQuizRegs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [statusFilter, setStatusFilter] =
    useState('all');

  const [search, setSearch] =
    useState('');

  const [actionLoading, setActionLoading] =
    useState(null);

  const [rejectModal, setRejectModal] =
    useState(null);

  const [rejectionReason, setRejectionReason] =
    useState('');

  const [dateModal, setDateModal] =
    useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  // ─────────────────────────────────────────────
  // FETCH DATA
  // ─────────────────────────────────────────────

  const fetchAll = async () => {
    setLoading(true);

    try {
      const [
        reqRes,
        paintRes,
        quizRes,
      ] = await Promise.all([
        schoolAccessAPI.listRequests(),

        schoolRegistrationAPI.listRegistrations(
          'painting'
        ),

        schoolRegistrationAPI.listRegistrations(
          'quiz'
        ),
      ]);

      setRequests(
        reqRes.data.data || []
      );

      setPaintingRegs(
        paintRes.data.data || []
      );

      setQuizRegs(
        quizRes.data.data || []
      );

    } catch (err) {

      toast.error(
        'Failed to load SNEAC data'
      );

    } finally {

      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // ACCESS REQUEST ACTIONS
  // ─────────────────────────────────────────────

  const handleApprove = async (id) => {

    if (
      !window.confirm(
        'Approve this request and send registration link?'
      )
    ) {
      return;
    }

    setActionLoading(id);

    try {

      await schoolAccessAPI.approveRequest(
        id
      );

      toast.success(
        'Request approved and link sent.'
      );

      fetchAll();

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
          'Failed to approve request.'
      );

    } finally {

      setActionLoading(null);
    }
  };

  const handleRejectConfirm = async () => {

    if (!rejectModal) return;

    setActionLoading(rejectModal.id);

    try {

      await schoolAccessAPI.rejectRequest(
        rejectModal.id,
        rejectionReason
      );

      toast.success(
        'Request rejected.'
      );

      setRejectModal(null);

      setRejectionReason('');

      fetchAll();

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
          'Failed to reject request.'
      );

    } finally {

      setActionLoading(null);
    }
  };

  const handleResendLink = async (id) => {

    if (
      !window.confirm(
        'Invalidate old link and send a new one?'
      )
    ) {
      return;
    }

    setActionLoading(id);

    try {

      await schoolAccessAPI.resendLink(
        id
      );

      toast.success(
        'New link generated and sent.'
      );

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
          'Failed to resend link.'
      );

    } finally {

      setActionLoading(null);
    }
  };

  // ─────────────────────────────────────────────
  // DATE MODAL
  // ─────────────────────────────────────────────

  const openDateModal = (reg) => {

    if (
      reg.competition_type ===
      'painting'
    ) {

    setDateModal({
      id: reg.id,

      schoolName:
        reg.school_name,

      competitionType:
        reg.competition_type,

      categories:
        typeof reg.competition_categories ===
        'string'
          ? JSON.parse(
              reg.competition_categories
            )
          : reg.competition_categories || [],

      primaryDates:
        typeof reg.primary_preferred_dates ===
        'string'
          ? JSON.parse(
              reg.primary_preferred_dates
            )
          : reg.primary_preferred_dates ||
            [],

      secondaryDates:
        typeof reg.secondary_preferred_dates ===
        'string'
          ? JSON.parse(
              reg.secondary_preferred_dates
            )
          : reg.secondary_preferred_dates ||
            [],

      primaryAllottedDate:
        reg.primary_allotted_date ||
        '',

      secondaryAllottedDate:
        reg.secondary_allotted_date ||
        '',
    });

    } else {

      const dates =
        typeof reg.preferred_dates ===
        'string'
          ? JSON.parse(
              reg.preferred_dates
            )
          : reg.preferred_dates ||
            [];

      setDateModal({
        id: reg.id,

        schoolName:
          reg.school_name,

        competitionType:
          reg.competition_type,

        dates,

        allottedDate:
          reg.allotted_date || '',
      });
    }
  };

  const closeDateModal = () => {
      setDateModal(null);
    };

    // ─────────────────────────────────────────────
    // SAVE DATES
    // ─────────────────────────────────────────────

    const handleAllotDate = async () => {

      if (!dateModal) return;

      setActionLoading(dateModal.id);

      try {

        // 🎨 PAINTING
        if (
          dateModal.competitionType ===
          'painting'
        ) {

          const payload = {

            primaryAllottedDate:
              dateModal.primaryAllottedDate || null,

            secondaryAllottedDate:
              dateModal.secondaryAllottedDate || null,
          };

          await schoolRegistrationAPI.allotPaintingDates(
            dateModal.id,
            payload
          );

          toast.success(
            'Painting dates allotted successfully.'
          );

        }

        // 🧠 QUIZ
        else {

          await schoolRegistrationAPI.allotQuizDate(
            dateModal.id,
            dateModal.allottedDate
          );

          toast.success(
            'Quiz date allotted successfully.'
          );
        }

        closeDateModal();

        fetchAll();

      } catch (err) {

        console.error(err);

        toast.error(
          err.response?.data?.message ||
          'Failed to allot date.'
        );

      } finally {

        setActionLoading(null);
      }
    };

  // ─────────────────────────────────────────────
  // SEND CONFIRMATION
  // ─────────────────────────────────────────────

  const handleSendConfirmation = async (
    id,
    schoolName,
    isResend
  ) => {

    const confirmMsg = isResend
      ? `A confirmation was already sent. Send again with updated date to ${schoolName}?`
      : `Send confirmation email to ${schoolName}?`;

    if (!window.confirm(confirmMsg)) {
      return;
    }

    setActionLoading(id);

    try {

      const res =
        await schoolRegistrationAPI.sendConfirmation(
          id
        );

      toast.success(
        res.data.message ||
          'Confirmation sent.'
      );

      fetchAll();

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
          'Failed to send confirmation.'
      );

    } finally {

      setActionLoading(null);
    }
  };

  // ─────────────────────────────────────────────
  // FILTERS
  // ─────────────────────────────────────────────

  const filteredRequests =
    requests.filter((r) => {

      const matchStatus =
        statusFilter === 'all' ||
        r.status === statusFilter;

      const q =
        search.toLowerCase();

      const matchSearch =
        !q ||
        r.school_name
          .toLowerCase()
          .includes(q) ||
        r.school_email
          .toLowerCase()
          .includes(q) ||
        r.city
          .toLowerCase()
          .includes(q);

      return (
        matchStatus &&
        matchSearch
      );
    });

  const pendingCount =
    requests.filter(
      (r) => r.status === 'pending'
    ).length;

  // ─────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────

  const formatDate = (d) =>
    new Date(d).toLocaleDateString(
      'en-IN',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }
    );

  const parseDates = (raw) =>
    typeof raw === 'string'
      ? JSON.parse(raw)
      : raw;

  // ─────────────────────────────────────────────
  // LOADER
  // ─────────────────────────────────────────────

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
          {
            id: 'requests',
            label:
              '📋 Access Requests',
            badge: pendingCount,
          },

          {
            id: 'painting',
            label: `🎨 Painting Registrations (${paintingRegs.length})`,
          },

          {
            id: 'quiz',
            label: `🧠 Quiz Registrations (${quizRegs.length})`,
          },
        ].map((t) => (

          <button
            key={t.id}
            onClick={() =>
              setSubTab(t.id)
            }
            className={`px-5 py-2.5 font-semibold rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
              subTab === t.id
                ? 'bg-primary text-white shadow'
                : 'bg-gray-100 hover:bg-gray-200'
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

      {/* ACCESS REQUESTS */}
      {subTab === 'requests' && (
        <Card>

          {/* FILTERS */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">

            <input
              type="text"
              placeholder="Search by school, email or city..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            >

              <option value="all">
                All Status
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="approved">
                Approved
              </option>

              <option value="rejected">
                Rejected
              </option>

            </select>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-gray-50">

                <tr>

                  <th className="px-4 py-3 text-left">
                    School
                  </th>

                  <th className="px-4 py-3 text-left">
                    Emails
                  </th>

                  <th className="px-4 py-3 text-left">
                    Contact Numbers
                  </th>

                  <th className="px-4 py-3 text-left">
                    Principal
                  </th>

                  <th className="px-4 py-3 text-left">
                    City / State
                  </th>

                  <th className="px-4 py-3 text-left">
                    Status
                  </th>

                  <th className="px-4 py-3 text-left">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredRequests.map(
                  (req) => (

                    <tr
                      key={req.id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="px-4 py-3">

                        <div className="font-semibold">
                          {
                            req.school_name
                          }
                        </div>

                        <div className="text-xs text-gray-500 mt-1">
                          {
                            req.board_of_education
                          }
                        </div>

                      </td>

                      <td className="px-4 py-3 text-xs">

                        <div>
                          {
                            req.school_email
                          }
                        </div>

                        {req.school_email_2 && (
                          <div className="text-gray-500 mt-1">
                            {
                              req.school_email_2
                            }
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3 text-xs">

                        <div>
                          📞{' '}
                          {
                            req.landline_number
                          }
                        </div>

                        <div className="mt-1">
                          📱{' '}
                          {
                            req.mobile_number
                          }
                        </div>

                      </td>

                      <td className="px-4 py-3 text-xs">

                        <div className="font-semibold">
                          {
                            req.principal_name
                          }
                        </div>

                        {req.principal_phone && (
                          <div className="text-gray-500 mt-1">
                            {
                              req.principal_phone
                            }
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3">

                        {req.city},{' '}
                        {req.state}

                      </td>

                      <td className="px-4 py-3">

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            STATUS_COLORS[
                              req.status
                            ]
                          }`}
                        >

                          {req.status}

                        </span>

                      </td>

                      <td className="px-4 py-3">

                        <div className="flex flex-col gap-2">

                          {req.status ===
                            'pending' && (
                            <>  
                              <button
                                disabled={
                                  actionLoading ===
                                  req.id
                                }
                                onClick={() =>
                                  handleApprove(
                                    req.id
                                  )
                                }
                                className="px-3 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-semibold hover:bg-green-200"
                              >
                                ✅ Approve
                              </button>

                              <button
                                disabled={
                                  actionLoading ===
                                  req.id
                                }
                                onClick={() =>
                                  setRejectModal(
                                    req
                                  )
                                }
                                className="px-3 py-1 rounded-lg bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200"
                              >
                                ❌ Reject
                              </button>
                            </>
                          )}

                          {req.status ===
                            'approved' && (
                            <button
                              disabled={
                                actionLoading ===
                                req.id
                              }
                              onClick={() =>
                                handleResendLink(
                                  req.id
                                )
                              }
                              className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200"
                            >
                              🔗 Resend Link
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* REGISTRATIONS */}
      {(subTab === 'painting' ||
        subTab === 'quiz') && (
        <Card>

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-gray-50">

                <tr>

                  <th className="px-4 py-3 text-left">
                    School
                  </th>

                  <th className="px-4 py-3 text-left">
                    Teachers
                  </th>

                  <th className="px-4 py-3 text-left">
                    City / State
                  </th>

                  <th className="px-4 py-3 text-left">
                    Total Students
                  </th>

                  {subTab === 'quiz' && (
                    <th className="px-4 py-3 text-left">
                      Computers
                    </th>
                  )}

                  {subTab === 'painting' ? (
                    <>
                      <th className="px-4 py-3 text-left">
                        Primary Dates
                      </th>

                      <th className="px-4 py-3 text-left">
                        Secondary Dates
                      </th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-3 text-left">
                        Preferred Dates
                      </th>

                      <th className="px-4 py-3 text-left">
                        Allotted Date
                      </th>
                    </>
                  )}

                  <th className="px-4 py-3 text-left">
                    Confirmation
                  </th>

                  <th className="px-4 py-3 text-left">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {(subTab === 'painting'
                  ? paintingRegs
                  : quizRegs
                ).map((reg) => (

                  <tr
                    key={reg.id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="px-4 py-3">
                      <p className="font-semibold">
                        {
                          reg.school_name
                        }
                      </p>

                      <p className="text-xs text-gray-500">
                        {
                          reg.school_email
                        }
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <div className="space-y-2 min-w-[240px]">

                        {reg.teachers?.map(
                          (
                            teacher,
                            index
                          ) => (

                            <div
                              key={
                                teacher.id ||
                                index
                              }
                              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
                            >

                              <div className="font-semibold text-sm">
                                {
                                  teacher.teacher_name
                                }
                              </div>

                              <div className="text-xs text-gray-500">
                                {
                                  teacher.teacher_email
                                }
                              </div>

                              <div className="text-xs text-gray-500">
                                {
                                  teacher.teacher_phone
                                }
                              </div>

                              {teacher.designation && (
                                <div className="text-xs text-gray-600 mt-1">
                                  {
                                    teacher.designation
                                  }
                                </div>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      {reg.city},{' '}
                      {reg.state}
                    </td>

                    <td className="px-4 py-3 text-center font-semibold">
                      {
                        reg.total_participants
                      }
                    </td>

                    {subTab === 'quiz' && (
                      <td className="px-4 py-3 text-center">
                        {
                          reg.available_computers
                        }
                      </td>
                    )}

                    {subTab === 'painting' ? (
                      <>
                        {/* PRIMARY COLUMN */}
                        <td className="px-4 py-3 text-xs">

                          {(
                            typeof reg.competition_categories ===
                            'string'
                              ? JSON.parse(
                                  reg.competition_categories
                                )
                              : reg.competition_categories || []
                          ).includes('primary') ? (
                            <div>

                              <div className="font-semibold text-gray-700 mb-1">
                                Preferred
                              </div>

                              {(parseDates(
                                reg.primary_preferred_dates
                              ) || []).map((d, i) => (
                                <div key={i}>
                                  {formatDate(d)}
                                </div>
                              ))}

                              <div className="mt-2 font-semibold text-green-700">
                                Allotted
                              </div>

                              {reg.primary_allotted_date ? (
                                <div className="font-semibold text-green-700">
                                  {formatDate(
                                    reg.primary_allotted_date
                                  )}
                                </div>
                              ) : (
                                <div className="text-gray-400">
                                  Not allotted
                                </div>
                              )}

                            </div>
                          ) : (
                            <span className="text-gray-400">
                              Not Participating
                            </span>
                          )}
                        </td>

                        {/* SECONDARY COLUMN */}
                        <td className="px-4 py-3 text-xs">

                          {(
                            typeof reg.competition_categories ===
                            'string'
                              ? JSON.parse(
                                  reg.competition_categories
                                )
                              : reg.competition_categories || []
                          ).includes('secondary') ? (
                            <div>

                              <div className="font-semibold text-gray-700 mb-1">
                                Preferred
                              </div>

                              {(parseDates(
                                reg.secondary_preferred_dates
                              ) || []).map((d, i) => (
                                <div key={i}>
                                  {formatDate(d)}
                                </div>
                              ))}

                              <div className="mt-2 font-semibold text-green-700">
                                Allotted
                              </div>

                              {reg.secondary_allotted_date ? (
                                <div className="font-semibold text-green-700">
                                  {formatDate(
                                    reg.secondary_allotted_date
                                  )}
                                </div>
                              ) : (
                                <div className="text-gray-400">
                                  Not allotted
                                </div>
                              )}

                            </div>
                          ) : (
                            <span className="text-gray-400">
                              Not Participating
                            </span>
                          )}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 text-xs">

                          {parseDates(
                            reg.preferred_dates
                          ).map(
                            (d, i) => (
                              <div
                                key={i}
                              >
                                {formatDate(
                                  d
                                )}
                              </div>
                            )
                          )}

                        </td>

                        <td className="px-4 py-3">

                          {reg.allotted_date ? (
                            <span className="text-green-700 font-semibold text-xs">
                              {formatDate(
                                reg.allotted_date
                              )}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">
                              Not allotted
                            </span>
                          )}

                        </td>
                      </>
                    )}

                    <td className="px-4 py-3">

                      {reg.confirmation_sent ? (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                          ✓ Sent
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">
                          Not sent
                        </span>
                      )}

                    </td>

                    <td className="px-4 py-3">

                      <div className="flex flex-col gap-2">

                        <button
                          onClick={() =>
                            openDateModal(
                              reg
                            )
                          }
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-200"
                        >

                          📅

                          {subTab === 'painting'
  ? (
      (
        (
          typeof reg.competition_categories ===
          'string'
            ? JSON.parse(
                reg.competition_categories
              )
            : reg.competition_categories || []
        ).includes('primary')
          ? reg.primary_allotted_date
          : true
      ) &&
      (
        (
          typeof reg.competition_categories ===
          'string'
            ? JSON.parse(
                reg.competition_categories
              )
            : reg.competition_categories || []
        ).includes('secondary')
          ? reg.secondary_allotted_date
          : true
      )
    )
      ? ' Change Dates'
      : ' Allot Dates'
                            : reg.allotted_date
                              ? ' Change Date'
                              : ' Allot Date'}
                        </button>

                        {(
                          subTab === 'painting'
  ? (
      (
        (
          typeof reg.competition_categories ===
          'string'
            ? JSON.parse(
                reg.competition_categories
              )
            : reg.competition_categories || []
        ).includes('primary')
          ? reg.primary_allotted_date
          : true
      ) &&
      (
        (
          typeof reg.competition_categories ===
          'string'
            ? JSON.parse(
                reg.competition_categories
              )
            : reg.competition_categories || []
        ).includes('secondary')
          ? reg.secondary_allotted_date
          : true
      )
    )
                            : reg.allotted_date
                        ) && (
                          <button
                            disabled={
                              actionLoading ===
                              reg.id
                            }
                            onClick={() =>
                              handleSendConfirmation(
                                reg.id,
                                reg.school_name,
                                reg.confirmation_sent
                              )
                            }
                            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                              reg.confirmation_sent
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {reg.confirmation_sent
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

      {/* DATE MODAL */}
      {dateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto p-4">

          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6">

            <h3 className="text-xl font-bold text-gray-800 mb-1">
              Allot Competition Date
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              <strong>
                {
                  dateModal.schoolName
                }
              </strong>

              {' · '}

              {
                dateModal.competitionType
              }
            </p>

            {dateModal.competitionType ===
            'painting' ? (
              <div className="space-y-8">

                {/* PRIMARY */}
                <div>

                  <h4 className="font-bold text-blue-700 mb-3">
                    Primary Category
                  </h4>

                  <div className="grid gap-3">

                    {dateModal.primaryDates.map(
                      (d, i) => (

                        <label
                          key={i}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer ${
                            dateModal.primaryAllottedDate ===
                            d
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200'
                          }`}
                        >

                          <input
                            type="radio"
                            checked={
                              dateModal.primaryAllottedDate ===
                              d
                            }
                            onChange={() =>
                              setDateModal(
                                (
                                  prev
                                ) => ({
                                  ...prev,
                                  primaryAllottedDate:
                                    d,
                                })
                              )
                            }
                          />

                          <span>
                            {new Date(
                              d
                            ).toLocaleDateString(
                              'en-IN',
                              {
                                weekday:
                                  'long',
                                day: 'numeric',
                                month:
                                  'long',
                                year:
                                  'numeric',
                              }
                            )}
                          </span>

                        </label>
                      )
                    )}
                  </div>
                </div>

                {/* SECONDARY */}
                <div>

                  <h4 className="font-bold text-purple-700 mb-3">
                    Secondary Category
                  </h4>

                  <div className="grid gap-3">

                    {dateModal.secondaryDates.map(
                      (d, i) => (

                        <label
                          key={i}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer ${
                            dateModal.secondaryAllottedDate ===
                            d
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200'
                          }`}
                        >

                          <input
                            type="radio"
                            checked={
                              dateModal.secondaryAllottedDate ===
                              d
                            }
                            onChange={() =>
                              setDateModal(
                                (
                                  prev
                                ) => ({
                                  ...prev,
                                  secondaryAllottedDate:
                                    d,
                                })
                              )
                            }
                          />

                          <span>
                            {new Date(
                              d
                            ).toLocaleDateString(
                              'en-IN',
                              {
                                weekday:
                                  'long',
                                day: 'numeric',
                                month:
                                  'long',
                                year:
                                  'numeric',
                              }
                            )}
                          </span>

                        </label>
                      )
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">

                {dateModal.dates.map(
                  (d, i) => (

                    <label
                      key={i}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer ${
                        dateModal.allottedDate ===
                        d
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200'
                      }`}
                    >

                      <input
                        type="radio"
                        checked={
                          dateModal.allottedDate ===
                          d
                        }
                        onChange={() =>
                          setDateModal(
                            (
                              prev
                            ) => ({
                              ...prev,
                              allottedDate:
                                d,
                            })
                          )
                        }
                      />

                      <span>
                        {new Date(
                          d
                        ).toLocaleDateString(
                          'en-IN',
                          {
                            weekday:
                              'long',
                            day: 'numeric',
                            month:
                              'long',
                            year:
                              'numeric',
                          }
                        )}
                      </span>

                    </label>
                  )
                )}
              </div>
            )}

            <div className="flex gap-3 justify-end mt-8">

              <button
                onClick={
                  closeDateModal
                }
                className="px-5 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200"
              >
                Cancel
              </button>

              <button
                disabled={
                  actionLoading ===
                  dateModal.id
                }
                onClick={
                  handleAllotDate
                }
                className="px-5 py-2 rounded-xl bg-primary text-white font-semibold hover:opacity-90"
              >
                {actionLoading ===
                dateModal.id
                  ? 'Saving...'
                  : 'Save Dates'}
              </button>

            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">

            <h3 className="text-xl font-bold mb-4">
              Reject Access Request
            </h3>

            <textarea
              rows="4"
              placeholder="Optional rejection reason..."
              value={
                rejectionReason
              }
              onChange={(e) =>
                setRejectionReason(
                  e.target.value
                )
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <div className="flex justify-end gap-3 mt-5">

              <button
                onClick={() => {
                  setRejectModal(
                    null
                  );

                  setRejectionReason(
                    ''
                  );
                }}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={
                  handleRejectConfirm
                }
                className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
              >
                Reject
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SneacAdminTab;