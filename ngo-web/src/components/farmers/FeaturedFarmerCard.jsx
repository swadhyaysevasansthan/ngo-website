import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const FeaturedFarmerCard = ({ farmer }) => {
  return (
    <Link
      to={`/innovative-farmers/${farmer.slug}`}
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-4 flex gap-4"
    >
      <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-xl">

          <img
            src={farmer.profile_image ||'/images/team/user.png'}
            alt={farmer.name}
            className="w-full h-full object-cover"
          />
      

      </div>

      <div className="flex-1 min-w-0">

        <div className="flex items-center gap-2 mb-1">

          <h3 className="font-bold text-lg truncate">
            {farmer.name}
          </h3>

          <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">
            Featured
          </span>

        </div>

        <p className="text-primary text-sm font-medium truncate">
          {farmer.designation}
        </p>

        <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
          <MapPin size={14} />
          {farmer.location}
        </div>

        <div className="flex flex-wrap gap-1 mt-2">

          {(farmer.categories || [])
            .slice(0, 2)
            .map((category) => (
              <span
                key={category}
                className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs"
              >
                {category}
              </span>
            ))}

        </div>

        <div className="mt-3 text-primary font-medium text-sm">
          View Profile →
        </div>

      </div>
    </Link>
  );
};

export default FeaturedFarmerCard;