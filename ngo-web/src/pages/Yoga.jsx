import React from 'react';

const activities = {
  past: [
    { title: 'International Yoga Day', date: 'Jun 2024', description: 'Mass yoga session with 300+ participants.' },
    { title: 'Pranayama Basics Workshop', date: 'Apr 2024', description: 'Breathwork for stress relief, held at Sewa Hall.' },
  ],
  ongoing: [
    { title: 'Morning Yoga Classes', date: 'Daily', description: 'Open, guided classes every morning at foundation grounds.' },
  ],
  future: [
    { title: 'Yoga for Youth Camp', date: 'Jan 2026', description: 'Upcoming camp with national yoga experts.' },
  ],
};

const Section = ({ title, items }) => (
  <div className="mb-8">
    <h2 className="text-lg font-bold mb-2">{title}</h2>
    <ul className="space-y-2">
      {items.map((item, idx) => (
        <li key={idx} className="border rounded p-2 shadow">
          <div className="font-medium">{item.title}</div>
          <div className="text-xs text-gray-500">{item.date}</div>
          <div className="text-sm">{item.description}</div>
        </li>
      ))}
    </ul>
  </div>
);

const Yoga = () => (
  <div className="max-w-3xl mx-auto py-8 px-4">
    <h1 className="text-2xl font-bold mb-6">Yoga: Events & Activities</h1>
    <Section title="Past Activities & Events" items={activities.past} />
    <Section title="Ongoing Activities & Events" items={activities.ongoing} />
    <Section title="Future Activities & Events" items={activities.future} />
  </div>
);

export default Yoga;
