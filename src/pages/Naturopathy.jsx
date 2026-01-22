import React from 'react';

const activities = {
  past: [
    { title: 'Naturopathy Health Camp', date: 'Mar 2024', description: 'Free checkups and wellness consultations.' },
    { title: 'Detox Diet Webinar', date: 'May 2024', description: 'Online session on healthy eating habits.' },
  ],
  ongoing: [
    { title: 'Yoga-Naturopathy Integration Sessions', date: 'Oct-Nov 2025', description: 'Weekly sessions at Swadhyay Hall.' },
  ],
  future: [
    { title: 'Winter Wellness Workshop', date: 'Jan 2026', description: 'Hands-on cold & cough home remedy clinic.' },
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

const Naturopathy = () => (
  <div className="max-w-3xl mx-auto py-8 px-4">
    <h1 className="text-2xl font-bold mb-6">Naturopathy: Events & Activities</h1>
    <Section title="Past Activities & Events" items={activities.past} />
    <Section title="Ongoing Activities & Events" items={activities.ongoing} />
    <Section title="Future Activities & Events" items={activities.future} />
  </div>
);

export default Naturopathy;
