import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import ReviewForm from '../components/ReviewForm';
import SectionHeader from '../components/SectionHeader';

const SubmitReview = () => {
  useEffect(() => {
    document.title = 'Share Your Experience';
  }, []);

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
              Share Your Experience
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              If Swadhyay’s work has touched your life, we would be grateful to
              hear your story in your own words.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeader
          title="Your voice matters"
          subtitle="Your experience can encourage others, strengthen trust, and help more
            people understand the impact of our initiatives."
        />

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-8 lg:p-12">
            <ReviewForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default SubmitReview;