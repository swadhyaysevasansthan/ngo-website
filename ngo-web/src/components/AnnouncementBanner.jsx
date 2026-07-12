import React, { useEffect, useState } from 'react';
import {
  Leaf,
  Tv,
  ArrowRight,
  PlayCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const announcements = [
  {
    id: 1,
    title: 'Swadhyay National Environment Awareness Competitions (SNEAC 2026-27) 2nd Edition',
    subtitle: 'Registration Open • No Registration Fee',
    link: '/upcoming-engagements',
    internal: true,
    icon: Leaf,
    cta: 'View Competition Details',
  },
  {
    id: 2,
    title: 'Dr. Manish Goel Represented Swadhyay Seva Foundation on DD Kisan',
    subtitle: 'Environment Day Special • Paryavaran Samvaad 2026',
    link: 'https://youtu.be/akQDzUbk0OA',
    internal: false,
    icon: Tv,
    cta: 'Click to Watch on YouTube',
  },
];

const AnnouncementBanner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % announcements.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const announcement = announcements[current];
  const Icon = announcement.icon;

  const content = (
    <div className="relative flex items-center justify-center min-h-[56px] px-4 py-2">

      <div
        key={announcement.id}
        className="flex items-center gap-4 text-center animate-fade-in"
      >
        <Icon size={18} className="flex-shrink-0" />

        <div className="flex flex-col items-center">
          <span className="font-semibold text-sm md:text-base leading-tight">
            {announcement.title}
          </span>

          <span className="text-xs md:text-sm text-white/80 leading-tight">
            {announcement.subtitle}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 font-medium text-white">
          <span>{announcement.cta}</span>

          {announcement.internal ? (
            <ArrowRight size={16} />
          ) : (
            <PlayCircle size={16} />
          )}
        </div>
      </div>

      {/* Dots */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex gap-2">
        {announcements.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              current === index
                ? 'bg-white'
                : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-r from-emerald-800 via-green-700 to-emerald-800 text-white border-b border-white/10">

      {announcement.internal ? (
        <Link
          to={announcement.link}
          className="block hover:bg-white/5 transition-colors"
        >
          {content}
        </Link>
      ) : (
        <a
          href={announcement.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:bg-white/5 transition-colors"
        >
          {content}
        </a>
      )}

    </div>
  );
};

export default AnnouncementBanner;