import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { schoolRegistrationAPI } from '../utils/api';
import Card from '../components/Card1';
import Button from '../components/Button1';

const SchoolRegistrationHome = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [school, setSchool] = useState(null);
  const [registrations, setRegistrations] = useState({ painting: null, quiz: null });
  const [tokenExpiresAt, setTokenExpiresAt] = useState(null);

  useEffect(() => {
    if (!token) {
      setError('No registration token found in the URL. Please use the link sent to your school email.');
      setLoading(false);
      return;
    }
    validateToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const validateToken = async () => {
    try {
      const res = await schoolRegistrationAPI.validateToken(token);
      const { school, tokenExpiresAt, registrations } = res.data.data;
      setSchool(school);
      setTokenExpiresAt(tokenExpiresAt);
      setRegistrations(registrations);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'This registration link is invalid or has expired. Please contact us to request a new one.'
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Validating your registration link...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-slate-50 flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full text-center">
          <div className="text-7xl mb-6">🔗</div>
          <h1 className="text-2xl font-extrabold text-gray-800 mb-3">Invalid or Expired Link</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800 text-left">
            <p className="font-semibold mb-1">Need help?</p>
            <p>Email: swadhyaysevafoundation@gmail.com</p>
            <p>WhatsApp: +91 9599224323 | +91 9837042298</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-50">
      <div className="py-12 px-4">
        <div className="container-custom max-w-3xl mx-auto">

          {/* Header */}
          <div className="text-center mb-8 animate-slide-down">
            <h1 className="text-3xl md:text-4xl font-extrabold text-forest mb-2">
              School Registration Portal
            </h1>
            <p className="text-gray-600 text-base">
              Swadhyay National Environment Awareness Competitions 2026–27
            </p>
          </div>

          {/* School Info */}
          <Card className="mb-6 border border-emerald-100 animate-slide-up">
            <div className="flex items-start gap-4">
              <div className="text-4xl">✅</div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Verified School</p>
                <h2 className="text-xl font-bold text-gray-900">{school.schoolName}</h2>
                <p className="text-sm text-gray-600 mt-1">{school.schoolAddress}, {school.city}, {school.state}</p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                  <span>📧 {school.schoolEmail}</span>
                  <span>👤 {school.principalName}</span>
                  <span>📋 {school.boardOfEducation}</span>
                </div>
                <p className="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-1.5 inline-block">
                  🕒 This link expires on <strong>{formatDate(tokenExpiresAt)}</strong>
                </p>
              </div>
            </div>
          </Card>

          {/* Competition Cards */}
          <div className="grid md:grid-cols-2 gap-5 animate-slide-up">
            {/* Painting */}
            <div className={`rounded-2xl border-2 p-6 transition-all ${
              registrations.painting
                ? 'border-green-300 bg-green-50'
                : 'border-gray-200 bg-white hover:border-primary/50 hover:shadow-md'
            }`}>
              <div className="text-4xl mb-3">🎨</div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">National Environmental Painting Competition</h3>
              <p className="text-sm text-gray-600 mb-1">Classes 3rd to 8th</p>
              <p className="text-sm text-gray-600 mb-4">Maximum 300 students per school</p>

              {registrations.painting ? (
                <div className="bg-green-100 rounded-xl p-3 text-sm text-green-800">
                  <p className="font-semibold">✓ Registered</p>
                  <p className="text-xs mt-1">
                    {registrations.painting.total_participants} participants ·
                    Submitted {formatDate(registrations.painting.submitted_at)}
                  </p>
                  {registrations.painting.allotted_date && (
                    <p className="text-xs mt-1 font-semibold">
                      📅 Date allotted: {formatDate(registrations.painting.allotted_date)}
                    </p>
                  )}
                </div>
              ) : (
                <Button
                  fullWidth
                  onClick={() => navigate(`/school-registration/painting?token=${token}`)}
                >
                  Register for Painting
                </Button>
              )}
            </div>

            {/* Quiz */}
            <div className={`rounded-2xl border-2 p-6 transition-all ${
              registrations.quiz
                ? 'border-green-300 bg-green-50'
                : 'border-gray-200 bg-white hover:border-primary/50 hover:shadow-md'
            }`}>
              <div className="text-4xl mb-3">🧠</div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">National Environment Quiz Competition</h3>
              <p className="text-sm text-gray-600 mb-1">Classes 6th to 8th</p>
              <p className="text-sm text-gray-600 mb-4">Maximum 50 students per school</p>

              {registrations.quiz ? (
                <div className="bg-green-100 rounded-xl p-3 text-sm text-green-800">
                  <p className="font-semibold">✓ Registered</p>
                  <p className="text-xs mt-1">
                    {registrations.quiz.total_participants} participants ·
                    Submitted {formatDate(registrations.quiz.submitted_at)}
                  </p>
                  {registrations.quiz.allotted_date && (
                    <p className="text-xs mt-1 font-semibold">
                      📅 Date allotted: {formatDate(registrations.quiz.allotted_date)}
                    </p>
                  )}
                </div>
              ) : (
                <Button
                  fullWidth
                  onClick={() => navigate(`/school-registration/quiz?token=${token}`)}
                >
                  Register for Quiz
                </Button>
              )}
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Need help? Contact us at swadhyaysevafoundation@gmail.com or WhatsApp +91 9599224323</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolRegistrationHome;