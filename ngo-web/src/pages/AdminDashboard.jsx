import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { adminAPI } from '../utils/api';
import Card from '../components/Card1';
import Button from '../components/Button1';
import AdminReviewCard from '../components/AdminReviewCard';
import SneacAdminTab from '../components/sneac/SneacAdminTab';
import useSneacAdmin from '../components/sneac/useSneacAdmin';
import FarmersAdminTab from '../components/admin/FarmersAdminTab';
import EvaluationAdminTab from '../components/evaluation/EvaluationAdminTab';

// 🔥 7 days is the window used for "recent registrations" across both
// competitions, kept in one place so SNPC and SNEAC stay consistent.
const isWithinLastNDays = (dateValue, days = 7) => {
  if (!dateValue) return false;
  const date = new Date(dateValue);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return date >= cutoff;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, participants, email
  const [dashboardCompetition, setDashboardCompetition] = useState('sneac'); // snpc, sneac
  const [emailForm, setEmailForm] = useState({
    recipients: 'pending',
    templateType: 'submission-reminder',
    subject: '',
    message: '',
  });
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsTab, setReviewsTab] = useState('pending'); // pending, approved
  const pendingReviewsCount = reviews.filter(r => r.status === 'pending').length;
  

  const adminUsername = localStorage.getItem('adminUsername');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, participantsRes, pendingRes, approvedRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getParticipants(),
        adminAPI.getAdminReviews('pending'),
        adminAPI.getAdminReviews('approved'),
      ]);

      setStats(statsRes.data.data);
      setParticipants(participantsRes.data.data);

      const pending = pendingRes.data.data || [];
      const approved = approvedRes.data.data || [];

      // merge lists; if you want newest first, you can sort after merge
      const merged = [...pending, ...approved];

      setReviews(merged);
    } catch (error) {
      toast.error('Failed to load data');
      if (error.response?.status === 401) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔥 SNEAC — reuses the same hook that powers the SNEAC Schools tab, so the
  // dashboard card numbers always match what's shown there. This fetches on
  // mount regardless of which dropdown option is selected (same pattern as
  // the SNPC stats above), so switching the dropdown is instant.
  const {
    requests: sneacRequests,
    paintingRegs,
    quizRegs,
    loading: sneacLoading,
  } = useSneacAdmin();

  const sneacStats = useMemo(() => {
    const approved = sneacRequests.filter((r) => r.status === 'approved');
    const pending = sneacRequests.filter((r) => r.status === 'pending');
    const rejected = sneacRequests.filter((r) => r.status === 'rejected');
    const recentRequests = sneacRequests.filter((r) =>
      isWithinLastNDays(r.created_at)
    );

    const paintingParticipants = paintingRegs.reduce(
      (sum, r) => sum + (r.total_participants || 0),
      0
    );
    const quizParticipants = quizRegs.reduce(
      (sum, r) => sum + (r.total_participants || 0),
      0
    );

    const paintingDatesAllotted = paintingRegs.filter(
      (r) => r.primary_allotted_date || r.secondary_allotted_date
    ).length;
    const quizDatesAllotted = quizRegs.filter((r) => r.allotted_date).length;

    return {
      totalSchools: sneacRequests.length,
      approvedCount: approved.length,
      pendingCount: pending.length,
      rejectedCount: rejected.length,
      recentCount: recentRequests.length,
      paintingParticipants,
      quizParticipants,
      paintingDatesAllotted,
      quizDatesAllotted,
    };
  }, [sneacRequests, paintingRegs, quizRegs]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminUsername');
    toast.success('Logged out successfully');
    navigate("/admin/login", { replace: true });
  };

  const handleSendBulkEmail = async (e) => {
    e.preventDefault();

    if (
      emailForm.templateType === 'custom' &&
      (!emailForm.subject || !emailForm.message)
    ) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!window.confirm(`Send "${emailForm.templateType}" email to ${emailForm.recipients} participants?`)) {
      return;
    }

    try {
      const response = await adminAPI.sendBulkEmail(emailForm);
      toast.success(response.data.message);
      setEmailForm({
        recipients: 'pending',
        templateType: 'submission-reminder',
        subject: '',
        message: '',
      });
    } catch (error) {
      toast.error(error.message || 'Failed to send emails');
    }
  };

  const handlePreview = async () => {
    try {
      const res = await adminAPI.getEmailPreview(
        emailForm.templateType
      );

      setPreviewHtml(res.data.html);
      setShowPreview(true);
    } catch (error) {
      toast.error('Failed to load preview');
      console.error(error);
    }
  };

  const downloadCSV = (data, filename) => {
    if (!data.length) {
      toast.error('No data to download');
      return;
    }

    const header = Object.keys(data[0]);
    const csv = [
      header.join(','),
      ...data.map((row) => header.map((key) => String(row[key] ?? '')).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleToggleSubmitted = async (participant) => {
    const newValue = !participant.has_submitted;

    // optimistic update
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === participant.id ? { ...p, has_submitted: newValue } : p
      )
    );

    try {
      await adminAPI.updateSubmissionStatus(
        participant.participant_id,
        newValue
      );
      toast.success(
        `Marked ${participant.full_name} as ${
          newValue ? 'Submitted' : 'Pending'
        }`
      );
    } catch (error) {
      // revert on error
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === participant.id ? { ...p, has_submitted: participant.has_submitted } : p
        )
      );
      toast.error('Failed to update submission status');
      console.error('Update status error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const totalParticipants = participants.length;
  const natureParticipants = participants.filter(
    (p) => p.category === 'nature'
  );
  const wildlifeParticipants = participants.filter(
    (p) => p.category === 'wildlife'
  );
  const submittedParticipants = participants.filter((p) => p.has_submitted);
  const pendingParticipants = participants.filter((p) => !p.has_submitted);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container-custom py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-forest">
                🌿 Swadhyay Seva Foundation Admin Panel
              </h1>
              <p className="text-sm text-gray-600">Welcome, {adminUsername}</p>
            </div>
            <Button variant="danger" size="small" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs - UPDATED */}
      <div className="bg-white border-b">
        <div className="container-custom">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[
              { id: 'dashboard', label: '📊 Dashboard' },
              { id: 'participants', label: '👥 Participants' },
              { id: 'reviews', label: '💬 Reviews', badge: pendingReviewsCount },
              { id: 'sneac', label: '🏫 SNEAC Schools' },
              { id: 'farmers', label: '👨‍🌾 Farmers' },
              { id: 'evaluation', label: '🏆 Evaluation' },
              { id: 'email', label: '✉️ Send Email' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-semibold transition-all border-b-2 whitespace-nowrap flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'text-primary border-primary'
                    : 'text-gray-600 border-transparent hover:text-primary'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && tab.badge > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-8">
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in">
            {/* Competition Selector */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {dashboardCompetition === 'snpc'
                  ? '🌿 SNPC 2026 Stats'
                  : '🏫 SNEAC Stats'}
              </h2>
              <select
                value={dashboardCompetition}
                onChange={(e) => setDashboardCompetition(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none bg-white"
              >
                <option value="snpc">🌿 SNPC 2026</option>
                <option value="sneac">🏫 SNEAC</option>
              </select>
            </div>

            {/* SNPC STATS */}
            {dashboardCompetition === 'snpc' && stats && (
              <>
                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                  <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <div className="text-4xl mb-2">👥</div>
                    <div className="text-3xl font-bold">
                      {stats.totalRegistrations}
                    </div>
                    <div className="text-blue-100">Total Registrations</div>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <div className="text-4xl mb-2">✅</div>
                    <div className="text-3xl font-bold">
                      {stats.totalSubmissions}
                    </div>
                    <div className="text-green-100">Marked as Submitted</div>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                    <div className="text-4xl mb-2">⏳</div>
                    <div className="text-3xl font-bold">
                      {stats.pendingSubmissions}
                    </div>
                    <div className="text-orange-100">Pending Submissions</div>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <div className="text-4xl mb-2">📈</div>
                    <div className="text-3xl font-bold">
                      {stats.recentRegistrations}
                    </div>
                    <div className="text-purple-100">Last 7 Days (Regs)</div>
                  </Card>
                </div>

                {/* Category Breakdown */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <h3 className="text-xl font-bold mb-4">
                      📋 Registrations by Category
                    </h3>
                    <div className="space-y-3">
                      {stats.categoryBreakdown.map((cat) => (
                        <div
                          key={cat.category}
                          className="flex justify-between items-center"
                        >
                          <span className="font-semibold">{cat.category}</span>
                          <span className="bg-primary/10 text-primary px-4 py-1 rounded-full">
                            {cat.count} registrations
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card>
                    <h3 className="text-xl font-bold mb-4">
                      ✅ Marked Submissions by Category
                    </h3>
                    <div className="space-y-3">
                      {stats.submissionsByCategory.map((cat) => (
                        <div
                          key={cat.category}
                          className="flex justify-between items-center"
                        >
                          <span className="font-semibold">{cat.category}</span>
                          <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full">
                            {cat.count} submitted
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </>
            )}

            {/* SNEAC STATS */}
            {dashboardCompetition === 'sneac' && (
              <>
                {sneacLoading ? (
                  <div className="flex items-center justify-center py-24">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <>
                    {/* Stats Cards */}
                    <div className="grid md:grid-cols-5 gap-6 mb-8">
                      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <div className="text-4xl mb-2">🏫</div>
                        <div className="text-3xl font-bold">
                          {sneacStats.totalSchools}
                        </div>
                        <div className="text-blue-100">Total Schools</div>
                      </Card>

                      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <div className="text-4xl mb-2">✅</div>
                        <div className="text-3xl font-bold">
                          {sneacStats.approvedCount}
                        </div>
                        <div className="text-green-100">Approved</div>
                      </Card>

                      <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                        <div className="text-4xl mb-2">⏳</div>
                        <div className="text-3xl font-bold">
                          {sneacStats.pendingCount}
                        </div>
                        <div className="text-orange-100">Needs Approval</div>
                      </Card>

                      <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
                        <div className="text-4xl mb-2">❌</div>
                        <div className="text-3xl font-bold">
                          {sneacStats.rejectedCount}
                        </div>
                        <div className="text-red-100">Rejected</div>
                      </Card>

                      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                        <div className="text-4xl mb-2">📈</div>
                        <div className="text-3xl font-bold">
                          {sneacStats.recentCount}
                        </div>
                        <div className="text-purple-100">Last 7 Days</div>
                      </Card>
                    </div>

                    {/* Registrations by Competition Type */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card>
                        <h3 className="text-xl font-bold mb-4">
                          📋 Registrations by Competition
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">🎨 Painting</span>
                            <span className="bg-primary/10 text-primary px-4 py-1 rounded-full">
                              {paintingRegs.length} schools ·{' '}
                              {sneacStats.paintingParticipants} participants
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">🧠 Quiz</span>
                            <span className="bg-primary/10 text-primary px-4 py-1 rounded-full">
                              {quizRegs.length} schools ·{' '}
                              {sneacStats.quizParticipants} participants
                            </span>
                          </div>
                        </div>
                      </Card>

                      <Card>
                        <h3 className="text-xl font-bold mb-4">
                          📅 Competition Dates Allotted
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">🎨 Painting</span>
                            <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full">
                              {sneacStats.paintingDatesAllotted} / {paintingRegs.length} allotted
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">🧠 Quiz</span>
                            <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full">
                              {sneacStats.quizDatesAllotted} / {quizRegs.length} allotted
                            </span>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}

        {/* PARTICIPANTS TAB */}
        {activeTab === 'participants' && (
          <div className="animate-fade-in">
            <Card>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold">
                  👥 All Participants ({totalParticipants})
                </h2>
                <div className="flex flex-wrap gap-3">
                  <Button
                    size="small"
                    onClick={() =>
                      downloadCSV(
                        participants,
                        'snpc2026_participants_all.csv'
                      )
                    }
                  >
                    📥 All CSV
                  </Button>
                  <Button
                    size="small"
                    variant="outline"
                    onClick={() =>
                      downloadCSV(
                        natureParticipants,
                        'snpc2026_participants_nature.csv'
                      )
                    }
                  >
                    🌲 Nature CSV
                  </Button>
                  <Button
                    size="small"
                    variant="outline"
                    onClick={() =>
                      downloadCSV(
                        wildlifeParticipants,
                        'snpc2026_participants_wildlife.csv'
                      )
                    }
                  >
                    🦁 Wildlife CSV
                  </Button>
                  <Button
                    size="small"
                    variant="outline"
                    onClick={() =>
                      downloadCSV(
                        submittedParticipants,
                        'snpc2026_participants_submitted.csv'
                      )
                    }
                  >
                    ✅ Submitted CSV
                  </Button>
                  <Button
                    size="small"
                    variant="outline"
                    onClick={() =>
                      downloadCSV(
                        pendingParticipants,
                        'snpc2026_participants_pending.csv'
                      )
                    }
                  >
                    ⏳ Pending CSV
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left">Participant ID</th>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Submitted?</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Phone</th>
                      <th className="px-4 py-3 text-left">Category</th>
                      <th className="px-4 py-3 text-left">College</th>
                      <th className="px-4 py-3 text-left">City</th>
                      <th className="px-4 py-3 text-left">State</th>
                      <th className="px-4 py-3 text-left">Paid?</th>
                      
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((p) => (
                      <tr key={p.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs">
                          {p.participant_id}
                        </td>
                        <td className="px-4 py-3">{p.full_name}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleToggleSubmitted(p)}
                            className={`px-3 py-1 rounded-full text-xs ${
                              p.has_submitted
                                ? 'bg-green-100 text-green-700'
                                : 'bg-orange-100 text-orange-700'
                            }`}
                          >
                            {p.has_submitted ? '✓ Submitted' : '⏳ Pending'}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-xs">
                          <button
                            onClick={() =>
                              navigator.clipboard.writeText(p.participant_id)
                            }
                            className="text-primary hover:underline"
                          >
                            Copy ID
                          </button>
                        </td>
                        <td className="px-4 py-3">{p.email}</td>
                        <td className="px-4 py-3">{p.phone}</td>
                        <td className="px-4 py-3">{p.category}</td>
                        <td className="px-4 py-3">{p.college_name}</td>
                        <td className="px-4 py-3">{p.city}</td>
                        <td className="px-4 py-3">{p.state}</td>
                        <td className="px-4 py-3">
                          {p.payment_status ? (
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                              Paid
                            </span>
                          ) : (
                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">
                              Unpaid
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* EMAIL TAB */}
        {activeTab === 'email' && (
          <div className="animate-fade-in max-w-3xl mx-auto">
            <Card>
              <h2 className="text-2xl font-bold mb-6">✉️ Send Bulk Email</h2>

              <form onSubmit={handleSendBulkEmail}>
                <div className="mb-5">
                  <label className="block mb-2 font-semibold text-gray-700">
                    Recipients
                  </label>
                  <select
                    value={emailForm.recipients}
                    onChange={(e) =>
                      setEmailForm({
                        ...emailForm,
                        recipients: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none"
                  >
                    <option value="all">
                      All Participants ({participants.length})
                    </option>
                    <option value="submitted">
                      Only Submitted ({submittedParticipants.length})
                    </option>
                    <option value="pending">
                      Only Pending ({pendingParticipants.length})
                    </option>
                  </select>
                </div>

                <div className="mb-5">
                  <label className="block mb-2 font-semibold text-gray-700">
                    Email Template
                  </label>

                  <select
                    value={emailForm.templateType}
                    onChange={(e) =>
                      setEmailForm({
                        ...emailForm,
                        templateType: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none"
                  >
                    <option value="submission-reminder">
                      📸 Submission Reminder
                    </option>

                    <option value="custom">
                      ✍️ Custom Email
                    </option>
                  </select>
                </div>
                {emailForm.templateType === 'custom' && (
                    <>
                <div className="mb-5">
                  <label className="block mb-2 font-semibold text-gray-700">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={emailForm.subject}
                    onChange={(e) =>
                      setEmailForm({ ...emailForm, subject: e.target.value })
                    }
                    placeholder="Email subject"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none"
                  />
                </div>

                <div className="mb-5">
                  <label className="block mb-2 font-semibold text-gray-700">
                    Message
                  </label>
                  <textarea
                    value={emailForm.message}
                    onChange={(e) =>
                      setEmailForm({ ...emailForm, message: e.target.value })
                    }
                    placeholder="Email message (use {name} and {participantId} for personalization)"
                    rows="8"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none resize-vertical"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Use{' '}
                    <code className="bg-gray-100 px-2 py-1 rounded">
                      {'{name}'}
                    </code>{' '}
                    and{' '}
                    <code className="bg-gray-100 px-2 py-1 rounded">
                      {'{participantId}'}
                    </code>{' '}
                    for personalization.
                  </p>
                </div>
                </>
                )}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePreview}
                  >
                    👁 Preview
                  </Button>

                  <Button
                    type="submit"
                    fullWidth
                    size="large"
                  >
                    Send Email
                  </Button>
                </div>
              </form>
            </Card>
            {showPreview && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white w-full max-w-5xl h-[85vh] rounded-lg overflow-hidden shadow-2xl">
                  <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="font-bold text-lg">
                      Email Preview
                    </h3>

                    <button
                      onClick={() => setShowPreview(false)}
                      className="text-xl font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  <iframe
                    title="email-preview"
                    srcDoc={previewHtml}
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}
          </div>
        )}
        {/* REVIEWS TAB - NEW */}
        {activeTab === 'reviews' && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">💬 Review Moderation</h2>
              <div className="flex space-x-3">
                <button
                  onClick={() => setReviewsTab('pending')}
                  className={`px-6 py-2 font-semibold rounded-xl transition-all ${
                    reviewsTab === 'pending'
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  ⏳ Pending ({reviews.filter(r => r.status === 'pending').length})
                </button>
                <button
                  onClick={() => setReviewsTab('approved')}
                  className={`px-6 py-2 font-semibold rounded-xl transition-all ${
                    reviewsTab === 'approved'
                      ? 'bg-green-500 text-white shadow-lg'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  ✅ Approved ({reviews.filter(r => r.status === 'approved').length})
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {reviews
                .filter(review => review.status === reviewsTab)
                .map((review) => (
                  <AdminReviewCard 
                    key={review.id} 
                    review={review}
                    onRefresh={() => fetchData()}
                  />
                ))}
            </div>

            {reviews.filter(r => r.status === reviewsTab).length === 0 && (
              <Card className="text-center py-16">
                <div className="text-6xl mb-4 opacity-25">💬</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">
                  {reviewsTab === 'pending' ? 'No pending reviews' : 'No approved reviews'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {reviewsTab === 'pending' 
                    ? 'Reviews will appear here when users submit them.'
                    : 'Approved reviews will appear here.'
                  }
                </p>
              </Card>
            )}
          </div>
        )}
        {/* SNEAC SCHOOLS TAB */}
        {activeTab === 'sneac' && (
          <SneacAdminTab />
        )}

          {/* FARMERS TAB */}
        {activeTab === 'farmers' && (
          <FarmersAdminTab />
        )}

        {/* EVALUATION TAB */}
        {activeTab === 'evaluation' && (
          <EvaluationAdminTab />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;