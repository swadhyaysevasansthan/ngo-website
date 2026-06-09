import React from 'react';
import { Camera, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AnnouncementBanner = () => {
  return (
    <div className="bg-gradient-to-r from-emerald-800 via-green-700 to-emerald-800 text-white overflow-hidden border-b border-white/10">
      <Link to="/photography-competition" className="block">

        <div className="h-12 flex items-center">

          <div className="flex animate-scroll whitespace-nowrap">

            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-8 px-10"
              >
                <Camera size={18} />

                <span className="font-semibold tracking-wide">
                  SWADHYAY NATIONAL PHOTOGRAPHY COMPETITION 2026
                </span>

                <span className="opacity-70">•</span>

                <Award size={18} />

                <span>
                  ₹42,000 Prize Pool
                </span>

                <span className="opacity-70">•</span>

                <span>
                  Registration Open Until 30 June 2026
                </span>

                <span className="opacity-70">•</span>

                <span className="font-medium">
                  Ages 17–23
                </span>

                <ArrowRight size={16} />

                <span className="font-semibold">
                  View Competition Details
                </span>
              </div>
            ))}

          </div>

        </div>

      </Link>
    </div>
  );
};

export default AnnouncementBanner;