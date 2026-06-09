import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPublicReviews } from '../utils/api';
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Trusted by Our Community"
            subtitle="Real stories from real people who've experienced transformation"
          />

          <div className="flex gap-6 overflow-hidden mt-12">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="min-w-[280px] sm:min-w-[320px] lg:min-w-[360px] h-64 rounded-3xl bg-gray-100 animate-pulse"
              />
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Trusted by Our Community"
          subtitle="Real stories from real people who've experienced transformation"
        />

        <div className="relative mt-12 overflow-hidden w-full">
          {/* Continuous Marquee */}
          <div className="flex w-fit animate-[marquee_30s_linear_infinite] hover:[animation-play-state:paused] gap-6">
            {[...featuredReviews, ...featuredReviews].map((review, idx) => (
              <div
                key={`${review.id}-${idx}`}
                className="min-w-[280px] sm:min-w-[320px] lg:min-w-[360px] max-w-[360px] flex-shrink-0"
              >
                <ReviewCard review={review} truncate={true} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;