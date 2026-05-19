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
    primaryTeacher1Name: '',
    primaryTeacher1Email: '',
    primaryTeacher1Phone: '',
    primaryTeacher1Designation: '',
    primaryTeacher2Name: '',
    primaryTeacher2Email: '',
    primaryTeacher2Phone: '',
    primaryTeacher2Designation: '',
    secondaryTeacher1Name: '',
    secondaryTeacher1Email: '',
    secondaryTeacher1Phone: '',
    secondaryTeacher1Designation: '',
    secondaryTeacher2Name: '',
    secondaryTeacher2Email: '',
    secondaryTeacher2Phone: '',
    secondaryTeacher2Designation: '',
    class3: '',
    class4: '',
    class5: '',
    class6: '',
    class7: '',
    class8: '',
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
  }, [token]);

  const getNum = (v) => parseInt(v, 10) || 0;

  const primaryCategoryTotal =
    getNum(formData.class3) + getNum(formData.class4) + getNum(formData.class5);

  const secondaryCategoryTotal =
    getNum(formData.class6) + getNum(formData.class7) + getNum(formData.class8);

  const totalParticipants = primaryCategoryTotal + secondaryCategoryTotal;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};

    const teacherFields = [
      'primaryTeacher1Name',
      'primaryTeacher1Email',
      'primaryTeacher1Phone',
      'primaryTeacher1Designation',
      'primaryTeacher2Name',
      'primaryTeacher2Email',
      'primaryTeacher2Phone',
      'primaryTeacher2Designation',
      'secondaryTeacher1Name',
      'secondaryTeacher1Email',
      'secondaryTeacher1Phone',
      'secondaryTeacher1Designation',
      'secondaryTeacher2Name',
      'secondaryTeacher2Email',
      'secondaryTeacher2Phone',
      'secondaryTeacher2Designation',
    ];

    teacherFields.forEach((field) => {
      if (!formData[field].trim()) {
        e[field] = 'This field is required';
      }
    });

    const emailFields = [
      'primaryTeacher1Email',
      'primaryTeacher2Email',
      'secondaryTeacher1Email',
      'secondaryTeacher2Email',
    ];
    emailFields.forEach((field) => {
      if (formData[field].trim() && !/\S+@\S+\.\S+/.test(formData[field])) {
        e[field] = 'Invalid email';
      }
    });

    const phoneFields = [
      'primaryTeacher1Phone',
      'primaryTeacher2Phone',
      'secondaryTeacher1Phone',
      'secondaryTeacher2Phone',
    ];
    phoneFields.forEach((field) => {
      if (formData[field].trim() && !/^[6-9]\d{9}$/.test(formData[field])) {
        e[field] = 'Invalid 10-digit number';
      }
    });

    const classes = ['class3', 'class4', 'class5', 'class6', 'class7', 'class8'];
    classes.forEach((field) => {
      const val = formData[field];
      if (val === '') {
        e[field] = 'Required';
        return;
      }
      if (getNum(val) < 0) e[field] = 'Cannot be negative';
    });

    if (primaryCategoryTotal === 0) e.class3 = 'Please enter at least 1 participant in primary category';
    if (secondaryCategoryTotal === 0) e.class6 = 'Please enter at least 1 participant in secondary category';

    if (primaryCategoryTotal > 150) e.class3 = 'Primary category total cannot exceed 150';
    if (secondaryCategoryTotal > 150) e.class6 = 'Secondary category total cannot exceed 150';
    if (totalParticipants > 300) e.class3 = 'Total cannot exceed 300 participants';

    ['preferredDate1', 'preferredDate2', 'preferredDate3', 'preferredDate4'].forEach((key, i) => {
      if (!formData[key]) e[key] = `Preferred date ${i + 1} is required`;
    });

    const dates = [
      formData.preferredDate1,
      formData.preferredDate2,
      formData.preferredDate3,
      formData.preferredDate4,
    ];
    if (new Set(dates.filter(Boolean)).size !== dates.filter(Boolean).length) {
      e.preferredDate1 = 'All 4 preferred dates must be different';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      await schoolRegistrationAPI.submitPainting(token, {
        primaryTeacher1Name: formData.primaryTeacher1Name,
        primaryTeacher1Email: formData.primaryTeacher1Email,
        primaryTeacher1Phone: formData.primaryTeacher1Phone,
        primaryTeacher1Designation: formData.primaryTeacher1Designation,
        primaryTeacher2Name: formData.primaryTeacher2Name,
        primaryTeacher2Email: formData.primaryTeacher2Email,
        primaryTeacher2Phone: formData.primaryTeacher2Phone,
        primaryTeacher2Designation: formData.primaryTeacher2Designation,
        secondaryTeacher1Name: formData.secondaryTeacher1Name,
        secondaryTeacher1Email: formData.secondaryTeacher1Email,
        secondaryTeacher1Phone: formData.secondaryTeacher1Phone,
        secondaryTeacher1Designation: formData.secondaryTeacher1Designation,
        secondaryTeacher2Name: formData.secondaryTeacher2Name,
        secondaryTeacher2Email: formData.secondaryTeacher2Email,
        secondaryTeacher2Phone: formData.secondaryTeacher2Phone,
        secondaryTeacher2Designation: formData.secondaryTeacher2Designation,
        classCounts: {
          3: getNum(formData.class3),
          4: getNum(formData.class4),
          5: getNum(formData.class5),
          6: getNum(formData.class6),
          7: getNum(formData.class7),
          8: getNum(formData.class8),
        },
        primaryCategoryTotal,
        secondaryCategoryTotal,
        totalParticipants,
        preferredDates: [
          formData.preferredDate1,
          formData.preferredDate2,
          formData.preferredDate3,
          formData.preferredDate4,
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
            A confirmation email has been sent to <strong>{school?.schoolEmail}</strong> and the supervising teachers.
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
            <p className="text-gray-600">
              {school?.schoolName} · Classes 3rd–8th
            </p>
          </div>

          <div className="max-w-5xl mx-auto animate-slide-up">
            <Card className="shadow-lg border border-slate-100">
              <form onSubmit={handleSubmit} className="space-y-10">

                <div className="bg-amber-50 rounded-xl p-5 border border-amber-100 text-sm text-gray-700">
                  <ul className="space-y-1">
                    <li>✓ Open to students of Classes 3rd to 8th.</li>
                    <li>✓ Primary Category: Classes 3rd–5th, max 150 students.</li>
                    <li>✓ Secondary Category: Classes 6th–8th, max 150 students.</li>
                    <li>✓ Maximum <strong>300 students</strong> per school.</li>
                    <li>✓ Two supervising teachers required for each category.</li>
                    <li>✓ Provide 4 preferred dates — one will be confirmed based on availability.</li>
                  </ul>
                </div>

                <section>
                  <h2 className="text-lg md:text-xl font-bold text-forest mb-1">
                    SECTION 1 · Primary Category Supervising Teachers
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Classes 3rd to 5th. Two supervising teachers are required.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <Input label="Teacher 1 Full Name" name="primaryTeacher1Name" value={formData.primaryTeacher1Name} onChange={handleChange} error={errors.primaryTeacher1Name} required />
                    <Input label="Teacher 1 Email Address" name="primaryTeacher1Email" type="email" value={formData.primaryTeacher1Email} onChange={handleChange} error={errors.primaryTeacher1Email} required />
                    <Input label="Teacher 1 Mobile Number" name="primaryTeacher1Phone" value={formData.primaryTeacher1Phone} onChange={handleChange} error={errors.primaryTeacher1Phone} maxLength="10" required />
                    <Input label="Teacher 1 Designation" name="primaryTeacher1Designation" value={formData.primaryTeacher1Designation} onChange={handleChange} error={errors.primaryTeacher1Designation} required />

                    <Input label="Teacher 2 Full Name" name="primaryTeacher2Name" value={formData.primaryTeacher2Name} onChange={handleChange} error={errors.primaryTeacher2Name} required />
                    <Input label="Teacher 2 Email Address" name="primaryTeacher2Email" type="email" value={formData.primaryTeacher2Email} onChange={handleChange} error={errors.primaryTeacher2Email} required />
                    <Input label="Teacher 2 Mobile Number" name="primaryTeacher2Phone" value={formData.primaryTeacher2Phone} onChange={handleChange} error={errors.primaryTeacher2Phone} maxLength="10" required />
                    <Input label="Teacher 2 Designation" name="primaryTeacher2Designation" value={formData.primaryTeacher2Designation} onChange={handleChange} error={errors.primaryTeacher2Designation} required />
                  </div>
                </section>

                <section>
                  <h2 className="text-lg md:text-xl font-bold text-forest mb-1">
                    SECTION 2 · Secondary Category Supervising Teachers
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Classes 6th to 8th. Two supervising teachers are required.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <Input label="Teacher 1 Full Name" name="secondaryTeacher1Name" value={formData.secondaryTeacher1Name} onChange={handleChange} error={errors.secondaryTeacher1Name} required />
                    <Input label="Teacher 1 Email Address" name="secondaryTeacher1Email" type="email" value={formData.secondaryTeacher1Email} onChange={handleChange} error={errors.secondaryTeacher1Email} required />
                    <Input label="Teacher 1 Mobile Number" name="secondaryTeacher1Phone" value={formData.secondaryTeacher1Phone} onChange={handleChange} error={errors.secondaryTeacher1Phone} maxLength="10" required />
                    <Input label="Teacher 1 Designation" name="secondaryTeacher1Designation" value={formData.secondaryTeacher1Designation} onChange={handleChange} error={errors.secondaryTeacher1Designation} required />

                    <Input label="Teacher 2 Full Name" name="secondaryTeacher2Name" value={formData.secondaryTeacher2Name} onChange={handleChange} error={errors.secondaryTeacher2Name} required />
                    <Input label="Teacher 2 Email Address" name="secondaryTeacher2Email" type="email" value={formData.secondaryTeacher2Email} onChange={handleChange} error={errors.secondaryTeacher2Email} required />
                    <Input label="Teacher 2 Mobile Number" name="secondaryTeacher2Phone" value={formData.secondaryTeacher2Phone} onChange={handleChange} error={errors.secondaryTeacher2Phone} maxLength="10" required />
                    <Input label="Teacher 2 Designation" name="secondaryTeacher2Designation" value={formData.secondaryTeacher2Designation} onChange={handleChange} error={errors.secondaryTeacher2Designation} required />
                  </div>
                </section>

                <section>
                  <h2 className="text-lg md:text-xl font-bold text-forest mb-1">
                    SECTION 3 · Student Counts
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Enter student counts for Classes 3rd to 8th. Primary category max is 150, secondary category max is 150, and total max is 300.
                  </p>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">Primary Category (Classes 3rd–5th)</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <Input label="Class 3 – No. of Students" name="class3" type="number" value={formData.class3} onChange={handleChange} placeholder="0" error={errors.class3} min="0" />
                        <Input label="Class 4 – No. of Students" name="class4" type="number" value={formData.class4} onChange={handleChange} placeholder="0" error={errors.class4} min="0" />
                        <Input label="Class 5 – No. of Students" name="class5" type="number" value={formData.class5} onChange={handleChange} placeholder="0" error={errors.class5} min="0" />
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">Secondary Category (Classes 6th–8th)</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <Input label="Class 6 – No. of Students" name="class6" type="number" value={formData.class6} onChange={handleChange} placeholder="0" error={errors.class6} min="0" />
                        <Input label="Class 7 – No. of Students" name="class7" type="number" value={formData.class7} onChange={handleChange} placeholder="0" error={errors.class7} min="0" />
                        <Input label="Class 8 – No. of Students" name="class8" type="number" value={formData.class8} onChange={handleChange} placeholder="0" error={errors.class8} min="0" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                      primaryCategoryTotal > 150 ? 'bg-red-100 text-red-700' : primaryCategoryTotal > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      Primary Total: {primaryCategoryTotal}
                    </div>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                      secondaryCategoryTotal > 150 ? 'bg-red-100 text-red-700' : secondaryCategoryTotal > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      Secondary Total: {secondaryCategoryTotal}
                    </div>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                      totalParticipants > 300 ? 'bg-red-100 text-red-700' : totalParticipants > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      Grand Total: {totalParticipants}
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-lg md:text-xl font-bold text-forest mb-1">
                    SECTION 4 · Preferred Dates
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Provide 4 different preferred dates between 1 May 2026 and 28 February 2027.
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