import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPublicReviews } from '../utils/api';
import ReviewCard from '../components/ReviewCard';
import SectionHeader from '../components/SectionHeader';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Reviews = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 6;

  useEffect(() => {
    document.title = 'Community Reviews';
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ['publicReviews', currentPage, limit],
    queryFn: () => getPublicReviews({ page: currentPage, limit }),
  });

  const reviews = data?.data?.data || [];
  const totalPages = data?.data?.pagination?.totalPages || 1;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-r from-primary-600 to-saffron-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Community Reviews</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Feedback shared online by participants, volunteers, and well-wishers
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Unable to load reviews
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-saffron-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Community Reviews
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Read reflections and feedback shared online by participants,
              volunteers, and well-wishers connected with our work
            </p>
          </motion.div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeader
          title="Voices from Our Community"
          subtitle="Explore experiences and encouraging words shared by people who have engaged with Swadhyay initiatives"
        />

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mt-12">
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
        <div className="flex flex-wrap justify-center gap-8 mb-16 max-w-6xl mx-auto mt-12">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.34rem)] max-w-sm"
            >
              <ReviewCard review={review} />
            </div>
          ))}
        </div>

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
              className="p-3 rounded-xl bg-white hover:bg-gray-50 shadow border border-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-11 h-11 rounded-xl font-semibold transition-all ${
                    page === currentPage
                      ? 'bg-primary-600 text-white'
                      : 'bg-white hover:bg-gray-50 shadow border border-gray-200 text-gray-800'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-3 rounded-xl bg-white hover:bg-gray-50 shadow border border-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </section>

      <section className="pb-10">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Have a Story to Share?
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            We'd be grateful to hear about your experience.
          </p>
          <a
            href="/submit-review"
            className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors"
          >
            Share Your Experience
            <ArrowRight size={20} />
          </a>
        </div>
      </section>
    </div>
  );
};

export default Reviews;