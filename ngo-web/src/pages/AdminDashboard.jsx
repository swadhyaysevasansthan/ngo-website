import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { adminAPI } from '../utils/api';
import Card from '../components/Card1';
import Button from '../components/Button1';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, participants, email
  const [emailForm, setEmailForm] = useState({
    subject: '',
    message: '',
    recipients: 'all',
  });

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
      const [statsRes, participantsRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getParticipants(),
      ]);

      setStats(statsRes.data.data);
      setParticipants(participantsRes.data.data);
    } catch (error) {
      toast.error('Failed to load data');
      if (error.response?.status === 401) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminUsername');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const handleSendBulkEmail = async (e) => {
    e.preventDefault();

    if (!emailForm.subject || !emailForm.message) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!window.confirm(`Send email to ${emailForm.recipients} participants?`)) {
      return;
    }

    try {
      const response = await adminAPI.sendBulkEmail(emailForm);
      toast.success(response.data.message);
      setEmailForm({ subject: '', message: '', recipients: 'all' });
    } catch (error) {
      toast.error(error.message || 'Failed to send emails');
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
                🌿 SNPC 2026 Admin Panel
              </h1>
              <p className="text-sm text-gray-600">Welcome, {adminUsername}</p>
            </div>
            <Button variant="danger" size="small" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="container-custom">
          <div className="flex gap-4 overflow-x-auto">
            {[
              { id: 'dashboard', label: '📊 Dashboard' },
              { id: 'participants', label: '👥 Participants' },
              { id: 'email', label: '✉️ Send Email' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-semibold transition-all border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-primary border-primary'
                    : 'text-gray-600 border-transparent hover:text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-8">
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && stats && (
          <div className="animate-fade-in">
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
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Phone</th>
                      <th className="px-4 py-3 text-left">Category</th>
                      <th className="px-4 py-3 text-left">College</th>
                      <th className="px-4 py-3 text-left">City</th>
                      <th className="px-4 py-3 text-left">State</th>
                      <th className="px-4 py-3 text-left">Paid?</th>
                      <th className="px-4 py-3 text-left">Submitted?</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((p) => (
                      <tr key={p.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs">
                          {p.participant_id}
                        </td>
                        <td className="px-4 py-3">{p.full_name}</td>
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

                <Button type="submit" fullWidth size="large">
                  Send Email
                </Button>
              </form>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
