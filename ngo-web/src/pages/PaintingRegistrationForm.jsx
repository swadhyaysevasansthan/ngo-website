import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { schoolRegistrationAPI } from '../utils/api';
import Input from '../components/Input';
import Button from '../components/Button1';
import Card from '../components/Card1';

const INDIAN_DATES = { min: '2026-05-01', max: '2027-02-28' };

const PaintingRegistrationForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(false);
  const [tokenLoading, setTokenLoading] = useState(true);
  const [tokenError, setTokenError] = useState(null);
  const [school, setSchool] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    primaryTeacherName: '',
    primaryTeacherEmail: '',
    primaryTeacherPhone: '',
    altTeacherName: '',
    altTeacherEmail: '',
    altTeacherPhone: '',
    class3: '',
    class4: '',
    class5: '',
    preferredDate1: '',
    preferredDate2: '',
    preferredDate3: '',
    preferredDate4: '',
  });

  useEffect(() => {
    if (!token) {
      setTokenError('Missing token. Please use the link sent to your school email.');
      setTokenLoading(false);
      return;
    }
    schoolRegistrationAPI.validateToken(token)
      .then((res) => {
        const { school, registrations } = res.data.data;
        if (registrations.painting) {
          setTokenError('Your school has already registered for the painting competition.');
          return;
        }
        setSchool(school);
      })
      .catch((err) => {
        setTokenError(err.response?.data?.message || 'Invalid or expired registration link.');
      })
      .finally(() => setTokenLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const totalParticipants =
    (parseInt(formData.class3) || 0) +
    (parseInt(formData.class4) || 0) +
    (parseInt(formData.class5) || 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!formData.primaryTeacherName.trim()) e.primaryTeacherName = 'Primary teacher name is required';
    if (!formData.primaryTeacherEmail.trim()) e.primaryTeacherEmail = 'Primary teacher email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.primaryTeacherEmail)) e.primaryTeacherEmail = 'Invalid email';
    if (!formData.primaryTeacherPhone.trim()) e.primaryTeacherPhone = 'Primary teacher phone is required';
    else if (!/^[6-9]\d{9}$/.test(formData.primaryTeacherPhone)) e.primaryTeacherPhone = 'Invalid 10-digit number';

    if (formData.altTeacherEmail && !/\S+@\S+\.\S+/.test(formData.altTeacherEmail))
      e.altTeacherEmail = 'Invalid email';
    if (formData.altTeacherPhone && !/^[6-9]\d{9}$/.test(formData.altTeacherPhone))
      e.altTeacherPhone = 'Invalid 10-digit number';

    const c3 = parseInt(formData.class3) || 0;
    const c4 = parseInt(formData.class4) || 0;
    const c5 = parseInt(formData.class5) || 0;
    if (c3 < 0) e.class3 = 'Cannot be negative';
    if (c4 < 0) e.class4 = 'Cannot be negative';
    if (c5 < 0) e.class5 = 'Cannot be negative';
    if (c3 + c4 + c5 === 0) e.class3 = 'Please enter at least 1 participant';
    if (c3 + c4 + c5 > 200) e.class3 = 'Total cannot exceed 200 participants';

    ['preferredDate1','preferredDate2','preferredDate3','preferredDate4'].forEach((key, i) => {
      if (!formData[key]) e[key] = `Preferred date ${i + 1} is required`;
    });

    const dates = [formData.preferredDate1, formData.preferredDate2, formData.preferredDate3, formData.preferredDate4];
    if (new Set(dates.filter(Boolean)).size !== dates.filter(Boolean).length) {
      e.preferredDate1 = 'All 4 preferred dates must be different';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) { toast.error('Please fix the errors in the form'); return; }

    setLoading(true);
    try {
      await schoolRegistrationAPI.submitPainting(token, {
        primaryTeacherName: formData.primaryTeacherName,
        primaryTeacherEmail: formData.primaryTeacherEmail,
        primaryTeacherPhone: formData.primaryTeacherPhone,
        altTeacherName: formData.altTeacherName || null,
        altTeacherEmail: formData.altTeacherEmail || null,
        altTeacherPhone: formData.altTeacherPhone || null,
        classCounts: {
          3: parseInt(formData.class3) || 0,
          4: parseInt(formData.class4) || 0,
          5: parseInt(formData.class5) || 0,
        },
        totalParticipants,
        preferredDates: [
          formData.preferredDate1, formData.preferredDate2,
          formData.preferredDate3, formData.preferredDate4,
        ],
      });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (tokenLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (tokenError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Cannot Continue</h2>
          <p className="text-gray-600 mb-6">{tokenError}</p>
          <Button onClick={() => navigate(`/school-registration?token=${token}`)}>
            Back to Registration Home
          </Button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full text-center animate-slide-down">
          <div className="text-7xl mb-6">🎨</div>
          <h1 className="text-3xl font-extrabold text-forest mb-3">Painting Registration Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            Your school's painting competition registration has been submitted successfully.
            A confirmation email has been sent to <strong>{school?.schoolEmail}</strong> and your primary teacher.
          </p>
          <Button onClick={() => navigate(`/school-registration?token=${token}`)}>
            Back to Registration Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-50">
      <div className="py-12 px-4">
        <div className="container-custom">
          <div className="text-center mb-8 animate-slide-down">
            <h1 className="text-3xl md:text-4xl font-extrabold text-forest mb-2">
              🎨 Painting Competition Registration
            </h1>
            <p className="text-gray-600">{school?.schoolName} · Classes 3rd–5th</p>
          </div>

          <div className="max-w-4xl mx-auto animate-slide-up">
            <Card className="shadow-lg border border-slate-100">
              <form onSubmit={handleSubmit} className="space-y-10">

                {/* Info */}
                <div className="bg-amber-50 rounded-xl p-5 border border-amber-100 text-sm text-gray-700">
                  <ul className="space-y-1">
                    <li>✓ Open to students of Classes 3rd, 4th, and 5th.</li>
                    <li>✓ Maximum <strong>200 students</strong> per school.</li>
                    <li>✓ The competition will be conducted at your school on the allotted date.</li>
                    <li>✓ Provide 4 preferred dates — we will confirm one based on availability.</li>
                  </ul>
                </div>

                {/* SECTION 1 — Teachers */}
                <section>
                  <h2 className="text-lg md:text-xl font-bold text-forest mb-1">
                    SECTION 1 · Supervising Teachers
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Primary teacher will be the main contact. Alternate teacher is optional but recommended.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <p className="text-sm font-semibold text-gray-700 mb-3">Primary Teacher</p>
                    </div>
                    <Input label="Full Name" name="primaryTeacherName" value={formData.primaryTeacherName}
                      onChange={handleChange} placeholder="Full name" error={errors.primaryTeacherName} required />
                    <Input label="Email Address" name="primaryTeacherEmail" type="email"
                      value={formData.primaryTeacherEmail} onChange={handleChange}
                      placeholder="teacher@school.com" error={errors.primaryTeacherEmail} required />
                    <Input label="Mobile Number" name="primaryTeacherPhone" value={formData.primaryTeacherPhone}
                      onChange={handleChange} placeholder="10-digit number" error={errors.primaryTeacherPhone}
                      maxLength="10" required />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div className="md:col-span-2">
                      <p className="text-sm font-semibold text-gray-700 mb-3">
                        Alternate Teacher <span className="text-gray-400 font-normal">(optional)</span>
                      </p>
                    </div>
                    <Input label="Full Name" name="altTeacherName" value={formData.altTeacherName}
                      onChange={handleChange} placeholder="Full name" error={errors.altTeacherName} />
                    <Input label="Email Address" name="altTeacherEmail" type="email"
                      value={formData.altTeacherEmail} onChange={handleChange}
                      placeholder="teacher@school.com" error={errors.altTeacherEmail} />
                    <Input label="Mobile Number" name="altTeacherPhone" value={formData.altTeacherPhone}
                      onChange={handleChange} placeholder="10-digit number" error={errors.altTeacherPhone}
                      maxLength="10" />
                  </div>
                </section>

                {/* SECTION 2 — Participants */}
                <section>
                  <h2 className="text-lg md:text-xl font-bold text-forest mb-1">
                    SECTION 2 · Student Counts
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Enter the number of students participating from each class. Total cannot exceed 200.
                  </p>

                  <div className="grid md:grid-cols-3 gap-4">
                    <Input label="Class 3 – No. of Students" name="class3" type="number"
                      value={formData.class3} onChange={handleChange} placeholder="0"
                      error={errors.class3} min="0" max="200" />
                    <Input label="Class 4 – No. of Students" name="class4" type="number"
                      value={formData.class4} onChange={handleChange} placeholder="0"
                      error={errors.class4} min="0" max="200" />
                    <Input label="Class 5 – No. of Students" name="class5" type="number"
                      value={formData.class5} onChange={handleChange} placeholder="0"
                      error={errors.class5} min="0" max="200" />
                  </div>

                  <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                    totalParticipants > 200
                      ? 'bg-red-100 text-red-700'
                      : totalParticipants > 0
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-500'
                  }`}>
                    Total Participants: {totalParticipants}
                    {totalParticipants > 200 && ' — exceeds limit of 200'}
                  </div>
                </section>

                {/* SECTION 3 — Preferred Dates */}
                <section>
                  <h2 className="text-lg md:text-xl font-bold text-forest mb-1">
                    SECTION 3 · Preferred Dates
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Provide 4 different preferred dates between 1 May 2026 and 28 February 2027.
                    We will confirm one based on availability.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((n) => (
                      <Input
                        key={n}
                        label={`Preferred Date ${n}`}
                        name={`preferredDate${n}`}
                        type="date"
                        value={formData[`preferredDate${n}`]}
                        onChange={handleChange}
                        error={errors[`preferredDate${n}`]}
                        min={INDIAN_DATES.min}
                        max={INDIAN_DATES.max}
                        required
                      />
                    ))}
                  </div>
                </section>

                {/* Submit */}
                <div className="pt-2 border-t border-slate-100">
                  <Button type="submit" fullWidth size="large" loading={loading} disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Painting Registration'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaintingRegistrationForm;