import React, { useEffect, useState } from 'react';
import { Users, Eye, EyeOff } from 'lucide-react';
import CountUp from 'react-countup';
import { visitorAPI } from '../utils/api';

const VisitorCounter = () => {
  const [visitorCount, setVisitorCount] = useState(null);

  // Session only
  const [expanded, setExpanded] = useState(() => {
    return (
      sessionStorage.getItem(
        'visitorCounterVisible'
      ) !== 'false'
    );
  });

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const loadCount = async () => {
      try {
        const response =
          await visitorAPI.getCount();

        if (response?.data?.success) {
          const count =
            response.data.totalVisitors;

          setVisitorCount(count);

          const alreadyAnimated =
            localStorage.getItem(
              'visitorCounterAnimated'
            );

          if (!alreadyAnimated) {
            setAnimate(true);

            localStorage.setItem(
              'visitorCounterAnimated',
              'true'
            );
          }
        }
      } catch (error) {
        console.error(
          'Failed to load visitor count:',
          error
        );
      }
    };

    loadCount();
  }, []);

  const toggleCounter = () => {
    const newState = !expanded;

    setExpanded(newState);

    sessionStorage.setItem(
      'visitorCounterVisible',
      newState
    );
  };

  return (
    <div className="fixed bottom-5 right-5 z-[9999]">
      {expanded ? (
        <div
          className="
            bg-white
            shadow-lg
            border
            border-gray-200
            rounded-xl
            px-4
            py-3
            flex
            items-center
            gap-3
            transition-all
            duration-300
          "
        >
          <Users
            size={22}
            className="text-green-600"
          />

          <div>
            <div className="text-lg font-bold text-gray-900">
              {visitorCount !== null ? (
                animate ? (
                  <CountUp
                    start={Math.floor(
                      visitorCount * 0.8
                    )}
                    end={visitorCount}
                    duration={1.5}
                    separator=","
                  />
                ) : (
                  visitorCount.toLocaleString()
                )
              ) : (
                '...'
              )}
            </div>

            <div className="text-xs text-gray-500">
              Total Visitors
            </div>
          </div>

          <button
            onClick={toggleCounter}
            className="
              text-gray-500
              hover:text-gray-700
              transition-colors
            "
            title="Hide Visitor Counter"
          >
            <EyeOff size={18} />
          </button>
        </div>
      ) : (
        <button
          onClick={toggleCounter}
          className="
            bg-white
            shadow-lg
            border
            border-gray-200
            rounded-full
            p-3
            hover:scale-105
            transition-all
            duration-300
          "
          title="Show Visitor Counter"
        >
          <Eye
            size={20}
            className="text-gray-700"
          />
        </button>
      )}
    </div>
  );
};

export default VisitorCounter;