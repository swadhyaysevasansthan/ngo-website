import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import {
  schoolAccessAPI,
  schoolRegistrationAPI,
} from '../../utils/api';

// 🔥 SNEAC — all data fetching + mutation logic for the admin panel lives here.
// Keeping this out of the components means every panel/modal just gets
// simple props + callbacks, and there's a single source of truth for state.
export default function useSneacAdmin() {
  const [requests, setRequests] = useState([]);
  const [paintingRegs, setPaintingRegs] = useState([]);
  const [quizRegs, setQuizRegs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchAll = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ── ACCESS REQUEST ACTIONS ──────────────────────────────
  const approveRequest = async (id) => {
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

  const rejectRequest = async (id, rejectionReason) => {
    setActionLoading(id);
    try {
      await schoolAccessAPI.rejectRequest(id, rejectionReason);
      toast.success('Request rejected.');
      fetchAll();
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject request.');
      return false;
    } finally {
      setActionLoading(null);
    }
  };

  const resendLink = async (id) => {
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

  // ── REGISTRATION ACTIONS ────────────────────────────────
  const allotPaintingDates = async (id, payload) => {
    setActionLoading(id);
    try {
      await schoolRegistrationAPI.allotPaintingDates(id, payload);
      toast.success('Painting dates allotted successfully.');
      await fetchAll();
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to allot date.');
      return false;
    } finally {
      setActionLoading(null);
    }
  };

  const allotQuizDate = async (id, allottedDate) => {
    setActionLoading(id);
    try {
      await schoolRegistrationAPI.allotQuizDate(id, allottedDate);
      toast.success('Quiz date allotted successfully.');
      await fetchAll();
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to allot date.');
      return false;
    } finally {
      setActionLoading(null);
    }
  };

  const sendConfirmation = async (id, schoolName, isResend) => {
    const confirmMsg = isResend
      ? `A confirmation was already sent. Send again with updated date to ${schoolName}?`
      : `Send confirmation email to ${schoolName}?`;
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

  return {
    // data
    requests,
    paintingRegs,
    quizRegs,
    loading,
    actionLoading,
    // actions
    fetchAll,
    approveRequest,
    rejectRequest,
    resendLink,
    allotPaintingDates,
    allotQuizDate,
    sendConfirmation,
  };
}