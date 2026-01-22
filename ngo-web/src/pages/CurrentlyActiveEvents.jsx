import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

const CurrentlyActiveEvents = () => {
  useEffect(() => {
    document.title = 'Currently Active Events - Swadhyay Seva Foundation';
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-saffron-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Activity className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Currently Active Events</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Details about our ongoing quiz events and community engagements
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center flex-grow">
        <div className="bg-white rounded-lg shadow-lg p-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Active Events at the Moment</h2>
          <p className="text-lg text-gray-600 mb-6">
            We currently don't have any active quiz events running. Check back soon or explore our upcoming events to stay informed about future opportunities!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <a
              href="/quiz/upcoming-engagements"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              View Upcoming Events
            </a>
            <a
              href="/quiz/school-stories"
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              View Past Events
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CurrentlyActiveEvents;
