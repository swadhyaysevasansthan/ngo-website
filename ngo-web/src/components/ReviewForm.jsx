import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import ReCAPTCHA from 'react-google-recaptcha';
import { submitReview } from '../utils/api';
import { Loader2, CheckCircle } from 'lucide-react';

const ReviewForm = () => {
  const [captchaToken, setCaptchaToken] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    designation: '',
    review_text: '',
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const mutation = useMutation({
    mutationFn: submitReview,
    onSuccess: () => {
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', designation: '', review_text: '' });
      setCaptchaToken('');
      setTimeout(() => setStatus('idle'), 3000);
    },
    onError: (error) => {
      setStatus('error');
      setErrors(error.errors || [{ msg: error.message || 'Something went wrong' }]);
    },
  });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (formData.review_text.trim().length < 20) newErrors.review_text = 'Review must be at least 20 characters';
    if (formData.review_text.trim().length > 500) newErrors.review_text = 'Review must be less than 500 characters';
    if (!captchaToken) newErrors.captcha = 'Please complete reCAPTCHA';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    mutation.mutate({
      ...formData,
      recaptchaToken: captchaToken,
    });
  };

  if (status === 'success') {
    return (
      <div className="text-center p-12 bg-green-50 rounded-3xl border border-green-200">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-800 mb-2">Thank you!</h3>
        <p className="text-gray-600">Your review has been submitted and will appear after admin approval.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
            errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
          }`}
          placeholder="John Doe"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
            errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
          }`}
          placeholder="john@example.com"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone (optional)</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="+91 98765 43210"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Organization/Designation (optional)</label>
          <input
            type="text"
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Software Developer at Swadhyay"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Your Review *</label>
        <textarea
          rows="5"
          value={formData.review_text}
          onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-vertical ${
            errors.review_text ? 'border-red-300 bg-red-50' : 'border-gray-200'
          }`}
          placeholder="Share your experience with Swadhyay..."
        />
        {errors.review_text && <p className="mt-1 text-sm text-red-600">{errors.review_text}</p>}
        <p className="text-xs text-gray-500 mt-1">
          {formData.review_text.length}/500 characters (minimum 20)
        </p>
      </div>

      <div className="pt-2">
        <ReCAPTCHA
          sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
          onChange={(token) => setCaptchaToken(token || '')}
          onExpired={() => setCaptchaToken('')}
        />
        {errors.captcha && <p className="mt-2 text-sm text-red-600">{errors.captcha}</p>}
      </div>

      <button
        type="submit"
        disabled={mutation.isPending || status === 'success'}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
      >
        {mutation.isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Submitting...</span>
          </>
        ) : (
          <span>Submit Review</span>
        )}
      </button>

      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-800 font-medium">Submission failed:</p>
          <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
            {Array.isArray(errors)
              ? errors.map((err, i) => <li key={i}>{err.msg}</li>)
              : <li>{errors.message || 'Unknown error'}</li>}
          </ul>
        </div>
      )}
    </form>
  );
};

export default ReviewForm;