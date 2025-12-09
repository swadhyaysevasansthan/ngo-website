import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, ArrowRight, MapPin } from 'lucide-react';

const updates = [
  {
    id: 1,
    title: 'Environmental Quiz at Mayoor School',
    date: 'December 5, 2025',
    location: 'Noida, Uttar Pradesh',
    summary:
      'Engaging environmental awareness quiz with 42 students, focusing on sustainability and everyday eco-friendly actions.',
    link: '/school-stories', // or a specific story route
    tag: 'School Story',
  },
  {
    id: 2,
    title: 'Upcoming Yoga & Wellness Camp',
    date: 'December 20, 2025',
    location: 'Rohini, Delhi',
    summary:
      'A community yoga and naturopathy camp promoting holistic wellness and lifestyle awareness for residents.',
    link: '/quiz/upcoming-engagements',
    tag: 'Upcoming Engagement',
  },
  {
    id: 3,
    title: 'Har Ghar Moringa Plantation Drive',
    date: 'January 5, 2026',
    location: 'Multiple Housing Societies, Delhi',
    summary:
      'Continuing our mission to plant Moringa trees and raise awareness about their nutritional and medicinal benefits.',
    link: '/plantation',
    tag: 'Plantation',
  },
];

const LatestUpdates = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Latest Updates</h2>
            <p className="mt-2 text-gray-600">
              Stay connected with our recent activities, school stories, and upcoming engagements.
            </p>
          </div>
          <Link
            to="/school-stories"
            className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700"
          >
            View all stories
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {updates.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col hover:shadow-md hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center rounded-full bg-primary-50 text-primary-700 text-xs font-semibold px-3 py-1">
                  {item.tag}
                </span>
                <div className="flex items-center text-xs text-gray-500 gap-1">
                  <CalendarDays size={14} />
                  <span>{item.date}</span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                {item.title}
              </h3>

              <div className="flex items-center text-xs text-gray-500 gap-1 mb-3">
                <MapPin size={14} />
                <span>{item.location}</span>
              </div>

              <p className="text-sm text-gray-600 flex-grow mb-4 line-clamp-3">
                {item.summary}
              </p>

              <Link
                to={item.link}
                className="inline-flex items-center gap-1 text-primary-600 text-sm font-semibold hover:text-primary-700 mt-auto"
              >
                Read more
                <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestUpdates;
