import React from 'react';

const activities = {
  past: [
    { title: 'Monsoon Plantation Drive', date: 'July 2024', description: '1500 saplings planted across schools and parks.' },
    { title: 'Clean-up and Plantation', date: 'Aug 2024', description: 'Community clean-up and tree planting near river bank.' },
  ],
  ongoing: [
    { title: 'Green Club Volunteer Program', date: 'Sep-Nov 2025', description: 'School children maintaining planted saplings.' },
  ],
  future: [
    { title: 'Neighborhood Tree Adoptions', date: 'Feb 2026', description: 'Residents to adopt and care for saplings.' },
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

const Plantation = () => (
  <div className="max-w-3xl mx-auto py-8 px-4">
    <h1 className="text-2xl font-bold mb-6">Plantation: Events & Activities</h1>
    <Section title="Past Activities & Events" items={activities.past} />
    <Section title="Ongoing Activities & Events" items={activities.ongoing} />
    <Section title="Future Activities & Events" items={activities.future} />
  </div>
);

export default Plantation;
