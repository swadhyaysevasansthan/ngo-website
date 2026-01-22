import React from 'react';
import { FaSeedling, FaHistory, FaSpinner, FaCalendarAlt } from 'react-icons/fa';

const activities = {
  past: [
    {
      title: 'Farmer Awareness Seminar',
      date: 'Feb 2024',
      description: 'Workshop on indigenous seeds and low-cost organic inputs.'
    },
    {
      title: 'Compost Making Training',
      date: 'Jan 2024',
      description: 'Hands-on event on creating compost with farm waste.'
    }
  ],
  ongoing: [
    {
      title: 'Soil Health Monitoring',
      date: 'Sep-Nov 2025',
      description: 'Regular testing and awareness in partner villages.'
    }
  ],
  future: [
    {
      title: 'Natural Pest Management Camp',
      date: 'Dec 2025',
      description: 'Upcoming demonstration session at local farm.'
    }
  ]
};

const Section = ({ title, icon, color, items }) => (
  <section className="mb-10">
    <div className="flex items-center mb-4">
      <span className={`mr-2 text-xl`} style={{ color }}>{icon}</span>
      <h2 className="text-xl font-bold tracking-wide" style={{ color }}>
        {title}
      </h2>
    </div>
    <div className="grid gap-5 md:grid-cols-2">
      {items.length === 0 && (
        <div className="italic text-gray-500 text-sm">No events listed.</div>
      )}
      {items.map((item, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl shadow-md border-l-4"
          style={{ borderColor: color }}
        >
          <div className="p-5">
            <div className="flex items-center mb-2">
              <FaCalendarAlt className="text-gray-400 mr-2" />
              <span className="text-xs text-gray-500 font-medium">{item.date}</span>
            </div>
            <div className="font-semibold text-lg text-[#5B8C51]">{item.title}</div>
            <div className="text-sm text-gray-700 mt-1">{item.description}</div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const NaturalFarming = () => (
  <main className="max-w-4xl mx-auto py-10 px-4">
    <div className="mb-10 text-center">
      <FaSeedling className="mx-auto text-[#5B8C51]" size={48} />
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#5B8C51] mt-4 mb-2">
        Natural Farming Events & Activities
      </h1>
      <p className="text-gray-600 text-md max-w-xl mx-auto">
        Discover our ongoing journey towards greener, more sustainable farming practices.
        Stay updated with past, ongoing, and upcoming programs!
      </p>
    </div>
    <Section
      title="Past Activities & Events"
      icon={<FaHistory />}
      color="#BDB76B"
      items={activities.past}
    />
    <Section
      title="Ongoing Activities & Events"
      icon={<FaSpinner />}
      color="#5B8C51"
      items={activities.ongoing}
    />
    <Section
      title="Future Activities & Events"
      icon={<FaCalendarAlt />}
      color="#90EE90"
      items={activities.future}
    />
  </main>
);

export default NaturalFarming;
