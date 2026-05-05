import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPublicReviews } from '../utils/api';
import ReviewCard from '../components/ReviewCard';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const Reviews = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 6;

  const { data, isLoading, error } = useQuery({
    queryKey: ['publicReviews', currentPage, limit],
    queryFn: () => getPublicReviews({ page: currentPage, limit }),
  });

  const reviews = data?.data?.data || [];
  const totalPages = data?.data?.pagination?.totalPages || 1;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-red-500 w-24 h-24 mx-auto mb-8 p-6 bg-red-50 rounded-3xl">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Oops!</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
            Unable to load reviews at the moment. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-white/80 px-6 py-3 rounded-full shadow-lg mb-6">
            <Star className="w-6 h-6 text-yellow-400 mr-2 fill-current" />
            <span className="text-lg font-semibold text-gray-800">
              Real Stories from Real People
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-900 bg-clip-text text-transparent mb-6 leading-tight">
            What Our Community Says
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join thousands who have experienced transformation through Swadhyay
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-2xl mb-4"></div>
                <div className="h-6 bg-gray-200 rounded-full w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* Reviews Grid */}
        {!isLoading && reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && reviews.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 opacity-30">💬</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              No reviews yet
            </h3>
            <p className="text-gray-600 text-lg">
              Approved reviews will appear here once available.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 max-w-md mx-auto">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-3 rounded-2xl bg-white/80 hover:bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-12 h-12 rounded-xl font-semibold transition-all ${
                    page === currentPage
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'bg-white/80 hover:bg-white shadow-lg border border-gray-200 hover:shadow-xl'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-3 rounded-2xl bg-white/80 hover:bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-24">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Have Your Own Story?
          </h3>
          <a
            href="/submit-review"
            className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-2xl text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Share Your Review
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Reviews;