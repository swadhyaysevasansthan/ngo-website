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
// EvaluationAdminTab and EventPassAdminTab removed from main dashboard nav
// to reduce DB load. Evaluation backend routes remain intact for the
// public PhotographyGallery page which calls /api/public/evaluation.
import QuizAdminTab from '../components/admin/QuizAdminTab';

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
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardCompetition, setDashboardCompetition] = useState('sneac');
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
      const [statsRes, pendingRes, approvedRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getAdminReviews('pending'),
        adminAPI.getAdminReviews('approved'),
      ]);

      setStats(statsRes.data.data);

      const pending = pendingRes.data.data || [];
      const approved = approvedRes.data.data || [];
      setReviews([...pending, ...approved]);
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

    const paintingConcluded = paintingRegs.filter((r) => r.is_concluded);
    const quizConcluded = quizRegs.filter((r) => r.is_concluded);
    const paintingRulesAgreed = paintingRegs.filter((r) => r.rules_agreed).length;

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
      paintingConcludedCount: paintingConcluded.length,
      quizConcludedCount: quizConcluded.length,
      paintingConcludedSchools: paintingConcluded.map((r) => r.school_name),
      quizConcludedSchools: quizConcluded.map((r) => r.school_name),
      paintingRulesAgreed,
    };
  }, [sneacRequests, paintingRegs, quizRegs]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminUsername');
    toast.success('Logged out successfully');
    navigate("/admin/login", { replace: true });
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
              <p className="text-sm text-gray-600">Welcome, Admin</p>
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
              { id: 'reviews', label: '💬 Reviews', badge: pendingReviewsCount },
              { id: 'quiz-settings', label: '🧠 Quiz Settings' },
              { id: 'sneac', label: '🏫 SNEAC Schools' },
              { id: 'farmers', label: '👨‍🌾 Farmers' },
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
                            <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-xs font-semibold">
                              {paintingRegs.length} schools ·{' '}
                              {sneacStats.paintingParticipants} participants ·{' '}
                              {sneacStats.paintingRulesAgreed} agreed
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

                    {/* Concluded Competitions */}
                    <Card>
                      <h3 className="text-xl font-bold mb-4">
                        🏆 Competitions Concluded
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-semibold">🎨 Painting</span>
                            <span className="bg-purple-100 text-purple-800 px-4 py-1 rounded-full font-bold">
                              {sneacStats.paintingConcludedCount} / {paintingRegs.length} schools
                            </span>
                          </div>
                          {sneacStats.paintingConcludedSchools.length > 0 ? (
                            <ul className="space-y-1">
                              {sneacStats.paintingConcludedSchools.map((name) => (
                                <li key={name} className="text-sm text-gray-700 flex items-center gap-2">
                                  <span className="text-purple-500">✓</span> {name}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-400">No schools concluded yet.</p>
                          )}
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-semibold">🧠 Quiz</span>
                            <span className="bg-purple-100 text-purple-800 px-4 py-1 rounded-full font-bold">
                              {sneacStats.quizConcludedCount} / {quizRegs.length} schools
                            </span>
                          </div>
                          {sneacStats.quizConcludedSchools.length > 0 ? (
                            <ul className="space-y-1">
                              {sneacStats.quizConcludedSchools.map((name) => (
                                <li key={name} className="text-sm text-gray-700 flex items-center gap-2">
                                  <span className="text-purple-500">✓</span> {name}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-400">No schools concluded yet.</p>
                          )}
                        </div>
                      </div>
                    </Card>
                  </>
                )}
              </>
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

        {/* QUIZ SETTINGS TAB */}
        {activeTab === 'quiz-settings' && (
          <QuizAdminTab />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;