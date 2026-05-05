import { useQuery } from '@tanstack/react-query';
import { getPublicReviews } from '../utils/api';
import { ChevronRight } from 'lucide-react';
import ReviewCard from './ReviewCard';

const TestimonialCarousel = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['featuredReviews'],
    queryFn: () => getPublicReviews({ limit: 10, featured: true }),
  });

  const reviews =
    data?.data?.data ||
    data?.data?.items ||
    data?.data ||
    [];

  const featuredReviews = Array.isArray(reviews) ? reviews.slice(0, 6) : [];

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Trusted by Our Community
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from real people who&apos;ve experienced transformation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 rounded-3xl bg-white/70 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || featuredReviews.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-r from-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent mb-4">
            Trusted by Our Community
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real stories from real people who&apos;ve experienced transformation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        <div className="text-center mt-16">
          <a
            href="/submit-review"
            className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-2xl text-lg shadow-xl hover:shadow-2xl transition-all"
          >
            Share Your Story
            <ChevronRight className="w-5 h-5 ml-2" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;