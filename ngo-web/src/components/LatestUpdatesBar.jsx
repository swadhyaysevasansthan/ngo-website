// LatestUpdatesBar.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Volume2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { pastEvents } from '../data/eventsData';

const LatestUpdatesBar = () => {
  const recentItems = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);

    const withinWeek = pastEvents.filter((story) => {
      const d = new Date(story.date);
      return d >= weekAgo && d <= now;
    });

    const base =
      withinWeek.length > 0
        ? withinWeek
        : [...pastEvents]
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .slice(0, 3);

    return base.map((s) => ({
      id: s.id,
      text: `${s.school} (${s.location}) hosted an environmental quiz with ${s.participants}.`,
      link: '/school-stories',
    }));
  }, []);

  const [current, setCurrent] = useState(0);
  const [fadeKey, setFadeKey] = useState(0); // just to retrigger animation

  useEffect(() => {
    if (recentItems.length <= 1) return;

    const timer = setInterval(() => {
      setCurrent((prev) =>
        prev === recentItems.length - 1 ? 0 : prev + 1
      );
      setFadeKey((k) => k + 1);
    }, 5000);

    return () => clearInterval(timer);
  }, [recentItems.length]);

  if (recentItems.length === 0) return null;

  const item = recentItems[current];

  return (
    <div className="bg-primary-600 text-white text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center gap-3">
        <div className="flex items-center gap-1 text-xs sm:text-sm font-semibold uppercase tracking-wide">
          <Volume2 size={16} className="hidden sm:block" />
          <span>Latest Update</span>
        </div>

        <span className="h-5 w-px bg-white/40 mx-1 sm:mx-2" />

        <div className="flex-1 overflow-hidden">
          <Link
            key={fadeKey}
            to={item.link}
            className="block whitespace-nowrap text-xs sm:text-sm animate-updateFade"
          >
            {item.text}
          </Link>
        </div>

       
      </div>
    </div>
  );
};

export default LatestUpdatesBar;
