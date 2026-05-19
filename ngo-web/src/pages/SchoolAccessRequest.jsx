import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { schoolAccessAPI } from '../utils/api';
import Input from '../components/Input';
import Button from '../components/Button1';
import Card from '../components/Card1';

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa',
  'Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala',
  'Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland',
  'Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura',
  'Uttar Pradesh','Uttarakhand','West Bengal','Andaman and Nicobar Islands',
  'Chandigarh','Dadra and Nagar Haveli and Daman and Diu','Delhi',
  'Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry','Other',
];

const BOARDS = [
  'CBSE','ICSE / ISC','State Board','IB (International Baccalaureate)',
  'IGCSE (Cambridge)','NIOS','Other',
];

const SchoolAccessRequest = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    schoolName: '',
    schoolEmail1: '',
    schoolEmail2: '',
    schoolAddress: '',
    city: '',
    state: '',
    boardOfEducation: '',
    hasEcoClub: '',
    principalName: '',
    principalPhone: '',
    principalEmail: '',
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};

    if (!formData.schoolName.trim()) e.schoolName = 'School name is required';

    if (!formData.schoolEmail1.trim()) e.schoolEmail1 = 'Primary email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.schoolEmail1)) e.schoolEmail1 = 'Invalid email address';

    if (!formData.schoolEmail2.trim()) e.schoolEmail2 = 'Primary email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.schoolEmail2)) e.schoolEmail2 = 'Invalid email address';

    if (!formData.schoolAddress.trim()) e.schoolAddress = 'School address is required';
    if (!formData.city.trim()) e.city = 'City is required';
    if (!formData.state) e.state = 'State is required';
    if (!formData.boardOfEducation) e.boardOfEducation = 'Board of education is required';
    if (formData.hasEcoClub === '') e.hasEcoClub = 'Please select an option';

    if (!formData.principalName.trim()) e.principalName = 'Principal name is required';
    if (formData.principalPhone.trim() && !/^[6-9]\d{9}$/.test(formData.principalPhone)) {
      e.principalPhone = 'Invalid 10-digit mobile number';
    }
    if (formData.principalEmail.trim() && !/\S+@\S+\.\S+/.test(formData.principalEmail)) {
      e.principalEmail = 'Invalid email address';
    }

    if (formData.notes.length > 1000) e.notes = 'Notes must not exceed 1000 characters';

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
      await schoolAccessAPI.submitRequest({
        ...formData,
        hasEcoClub: formData.hasEcoClub === 'true',
      });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to submit request. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-slate-50 flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full text-center animate-slide-down">
          <div className="text-7xl mb-6">📬</div>
          <h1 className="text-3xl font-extrabold text-forest mb-3">Request Submitted!</h1>
          <p className="text-gray-600 mb-6 text-base leading-relaxed">
            Your school's access request has been received. Our team will review it
            within a few working days. If approved, you will receive a private
            registration link at <strong>{formData.schoolEmail1}</strong>.
          </p>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800 text-left">
            <p className="font-semibold mb-1">What happens next?</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Our team reviews your request (usually within 2–3 working days).</li>
              <li>If approved, a unique registration link is sent to your school email(s).</li>
              <li>Use that link to register for the painting and/or quiz competitions.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-slate-50">
      <div className="py-12 px-4">
        <div className="container-custom">
          <div className="text-center mb-10 animate-slide-down">
            <h1 className="text-4xl md:text-5xl font-extrabold text-forest mb-3">
              Request School Access
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Swadhyay National Environment Awareness Competitions 2026–27
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs md:text-sm">
              <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-blue-100">
                🎨 Painting · Classes 3rd–8th
              </div>
              <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-emerald-100">
                🧠 Quiz · Classes 6th–8th
              </div>
              <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-amber-100">
                📅 Deadline: 28 Feb 2027
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto animate-slide-up">
            <Card className="shadow-lg border border-slate-100">
              <form onSubmit={handleSubmit} className="space-y-10">

                <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                  <h3 className="font-semibold text-gray-800 mb-2">Before you apply</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>✓ This form is for school coordinators only — not for individual students.</li>
                    <li>✓ Submit one request per school. Duplicate requests will be rejected.</li>
                    <li>✓ Once approved, you will receive a unique private link to complete registration.</li>
                    <li>✓ The link will be sent to the school email(s) provided below.</li>
                  </ul>
                </div>

                <section>
                  <h2 className="text-lg md:text-xl font-bold text-forest mb-1">
                    SECTION 1 · School Details
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Provide your school's official details as registered with the board.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Input
                        label="School Name"
                        name="schoolName"
                        value={formData.schoolName}
                        onChange={handleChange}
                        placeholder="Full official name of the school"
                        error={errors.schoolName}
                        required
                      />
                    </div>

                    <Input
                      label="School Email Address"
                      name="schoolEmail1"
                      type="email"
                      value={formData.schoolEmail1}
                      onChange={handleChange}
                      placeholder="school@example.com"
                      error={errors.schoolEmail1}
                      required
                    />

                    <Input
                      label="Alternate School Email Address"
                      name="schoolEmail2"
                      type="email"
                      value={formData.schoolEmail2}
                      onChange={handleChange}
                      placeholder="optional alternate email"
                      error={errors.schoolEmail2}
                      required
                    />

                    <Input
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      error={errors.city}
                      required
                    />

                    <div className="md:col-span-2">
                      <Input
                        label="School Address"
                        name="schoolAddress"
                        value={formData.schoolAddress}
                        onChange={handleChange}
                        placeholder="Street address, area, landmark"
                        error={errors.schoolAddress}
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-2 font-semibold text-gray-700 text-sm">
                        State <span className="text-red-500 ml-1">*</span>
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-all outline-none ${
                          errors.state
                            ? 'border-red-500'
                            : 'border-gray-300 focus:border-primary focus:ring-4 focus:ring-primary/10'
                        }`}
                      >
                        <option value="">Select State</option>
                        {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state}</p>}
                    </div>

                    <div>
                      <label className="block mb-2 font-semibold text-gray-700 text-sm">
                        Board of Education <span className="text-red-500 ml-1">*</span>
                      </label>
                      <select
                        name="boardOfEducation"
                        value={formData.boardOfEducation}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-all outline-none ${
                          errors.boardOfEducation
                            ? 'border-red-500'
                            : 'border-gray-300 focus:border-primary focus:ring-4 focus:ring-primary/10'
                        }`}
                      >
                        <option value="">Select Board</option>
                        {BOARDS.map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                      {errors.boardOfEducation && (
                        <p className="mt-1 text-sm text-red-500">{errors.boardOfEducation}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-5">
                    <label className="block mb-2 font-semibold text-gray-700 text-sm">
                      Does your school have an Eco Club? <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="flex gap-4 text-sm">
                      {[{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }].map((opt) => (
                        <label
                          key={opt.value}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 cursor-pointer transition-all ${
                            formData.hasEcoClub === opt.value
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-300 hover:border-primary/50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="hasEcoClub"
                            value={opt.value}
                            checked={formData.hasEcoClub === opt.value}
                            onChange={handleChange}
                            className="text-primary focus:ring-primary"
                          />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                    {errors.hasEcoClub && (
                      <p className="mt-1 text-sm text-red-500">{errors.hasEcoClub}</p>
                    )}
                  </div>
                </section>

                <section>
                  <h2 className="text-lg md:text-xl font-bold text-forest mb-1">
                    SECTION 2 · Principal Details
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Provide the principal's details. Only name and phone number are mandatory.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Principal Name"
                      name="principalName"
                      value={formData.principalName}
                      onChange={handleChange}
                      placeholder="Full name"
                      error={errors.principalName}
                      required
                    />

                    <Input
                      label="Principal Phone Number"
                      name="principalPhone"
                      value={formData.principalPhone}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      error={errors.principalPhone}
                      maxLength="10"
                    />

                    <Input
                      label="Principal Email Address"
                      name="principalEmail"
                      type="email"
                      value={formData.principalEmail}
                      onChange={handleChange}
                      placeholder="optional@example.com"
                      error={errors.principalEmail}
                    />
                  </div>
                </section>

                <section>
                  <h2 className="text-lg md:text-xl font-bold text-forest mb-1">
                    SECTION 3 · Additional Notes <span className="text-gray-400 font-normal text-sm">(optional)</span>
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Any additional information you would like to share with us.
                  </p>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="e.g. previous participation, special requirements, queries..."
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none resize-vertical"
                  />
                </section>

                <div className="pt-2 border-t border-slate-100">
                  <Button type="submit" fullWidth size="large" loading={loading} disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Access Request'}
                  </Button>
                  <p className="text-center text-xs md:text-sm text-gray-500 mt-3">
                    You will receive a confirmation email once your request is reviewed.
                  </p>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolAccessRequest;