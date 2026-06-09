import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { visitorAPI } from '../utils/api';

const VisitorCounter = () => {
  const [visitorCount, setVisitorCount] = useState(5654);

  useEffect(() => {
    const loadCount = async () => {
      try {
        const response = await visitorAPI.getCount();

        if (response?.data?.success) {
          setVisitorCount(response.data.totalVisitors);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadCount();
  }, []);

  return (
    <div
    className="
        fixed
        bottom-5
        right-5
        z-[9999]
        bg-white
        shadow-lg
        border
        border-gray-200
        rounded-xl
        px-4
        py-3
        flex
        items-center
        gap-2
    "
    >
    <Users size={20} className="text-green-600" />

    <div>
        <div className="text-lg font-semibold text-gray-900">
        {visitorCount.toLocaleString()}
        </div>

        <div className="text-xs text-gray-500">
        Total Visitors
        </div>
    </div>
    </div>
  );
};

export default VisitorCounter;