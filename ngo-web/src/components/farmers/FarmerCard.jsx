import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FarmerCard = ({ farmer }) => {
  return (
    <Link
      to={`/innovative-farmers/${farmer.slug}`}
      className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block"
    >
      <div className="relative h-64 overflow-hidden">

          <img
            src={farmer.profile_image ||'/images/team/user.png'}
            alt={farmer.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
      

        {farmer.is_featured && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
            ⭐ Featured
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900">
          {farmer.name}
        </h3>

        {farmer.designation && (
          <p className="text-primary-700 font-medium mt-1">
            {farmer.designation}
          </p>
        )}

        {farmer.location && (
          <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
            <MapPin size={16} />
            {farmer.location}
          </div>
        )}

        {farmer.short_bio && (
          <p className="text-gray-600 mt-4 line-clamp-3">
            {farmer.short_bio}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mt-4">
          {(farmer.categories || [])
            .slice(0, 3)
            .map((category) => (
              <span
                key={category}
                className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs"
              >
                {category}
              </span>
            ))}
        </div>

        <div className="flex items-center gap-2 text-primary-700 font-semibold mt-5">
          View Profile
          <ArrowRight size={18} />
        </div>
      </div>
    </Link>
  );
};

export default FarmerCard;