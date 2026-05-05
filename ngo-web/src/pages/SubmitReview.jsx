import ReviewForm from '../components/ReviewForm';

const SubmitReview = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
          Share Your Story
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Help others discover the transformative power of Swadhyay through your experience.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
        <div className="p-8 lg:p-12">
          <ReviewForm />
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="mt-20 grid md:grid-cols-3 gap-8 text-center">
        <div>
          <div className="text-3xl font-bold text-indigo-600 mb-2">1000+</div>
          <div className="text-gray-600">Reviews</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
          <div className="text-gray-600">Approval Rate</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-purple-600 mb-2">24h</div>
          <div className="text-gray-600">Moderation</div>
        </div>
      </div>
    </div>
  </div>
);

export default SubmitReview;