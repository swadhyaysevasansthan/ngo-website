// src/components/AnnouncementBanner.jsx
import React from 'react';
import { Camera, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const AnnouncementBanner = () => {
  return (
    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white overflow-hidden relative">
      <Link to="/photography-competition" className="block">
        <div className="relative h-12 flex items-center">
          {/* Continuous scrolling text - duplicated for seamless loop */}
          <div className="flex animate-scroll whitespace-nowrap">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center gap-8 px-8">
                <Camera size={20} className="flex-shrink-0" />
                <span className="font-bold text-lg">
                  📸 Swadhyay National Photography Competition 2026
                </span>
                <Award size={20} className="flex-shrink-0" />
                <span className="font-semibold">
                  Win prizes up to ₹21,000 | Registration Open: 10 Feb - 15 Apr
                </span>
                <span className="text-amber-100">✨</span>
                <span className="font-semibold">
                  Theme: Nature & Wildlife | Registration Fee: ₹100
                </span>
                <span className="text-amber-100">✨</span>
              </div>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AnnouncementBanner;
