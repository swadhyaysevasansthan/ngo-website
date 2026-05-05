import { useQuery } from '@tanstack/react-query';
import { getPublicReviews } from '../utils/api';
import { ChevronRight } from 'lucide-react';
import ReviewCard from './ReviewCard';
import SectionHeader from './SectionHeader';

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
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeader
          title="Trusted by Our Community"
          subtitle="Real stories from real people who&apos;ve experienced transformation"
        />

        <div className="flex flex-wrap justify-center gap-8">
          {featuredReviews.map((review) => (
            <div
              key={review.id}
              className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.34rem)] max-w-sm"
            >
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;