import React, { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getPublicReviews } from '../utils/api';
import ReviewCard from './ReviewCard';
import SectionHeader from './SectionHeader';

const TestimonialCarousel = () => {
  const scrollRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(0);

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

  const totalSteps = Math.max(0, featuredReviews.length - 3);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    const stepWidth = 380;

    const nextStep =
      direction === 'next'
        ? Math.min(currentStep + 1, totalSteps)
        : Math.max(currentStep - 1, 0);

    setCurrentStep(nextStep);

    container.scrollTo({
      left: nextStep * stepWidth,
      behavior: 'smooth',
    });
  };

  const thumbWidthPercent =
    totalSteps > 0 ? 100 / (totalSteps + 1) : 100;

  const barLeftPercent =
    totalSteps > 0 ? (currentStep / totalSteps) * (100 - thumbWidthPercent) : 0;

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

        <div className="relative mt-12">
          {/* Arrows */}
          <button
            onClick={() => scroll('prev')}
            disabled={currentStep === 0}
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-md border border-gray-200 hover:bg-gray-50 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Previous reviews"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => scroll('next')}
            disabled={currentStep === totalSteps}
            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-md border border-gray-200 hover:bg-gray-50 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Next reviews"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Carousel */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 hide-native-scrollbar"
          >
            {featuredReviews.map((review) => (
              <div
                key={review.id}
                className="snap-start min-w-[280px] sm:min-w-[320px] lg:min-w-[360px] max-w-[360px] flex-shrink-0"
              >
                <ReviewCard review={review} />
              </div>
            ))}
          </div>

          {/* Scroll Bar / Progress Bar */}
          <div className="mx-auto mt-4 h-[4px] w-40 rounded-full bg-blue-200/60 relative overflow-hidden">
            <div
              className="absolute inset-y-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-orange-400 transition-all duration-300"
              style={{
                width: `${thumbWidthPercent}%`,
                left: `${barLeftPercent}%`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;