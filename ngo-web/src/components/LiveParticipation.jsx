import { useEffect, useState } from 'react';
import { participantAPI } from '../utils/api';
import { Users, MapPinned, Trophy } from 'lucide-react';

export default function LiveParticipation({ compact = false }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await participantAPI.getLiveStats();
      setStats(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!stats) return null;

  // Compact version for trust strip
  if (compact) {
    return (
      <div className="text-center text-sm md:text-base font-medium text-emerald-800">
        🌍 Participants from <strong>{stats.totalStates} states</strong>
        {' • '}
        📸 <strong>{stats.totalPhotographers}+</strong> registrations
        {' • '}
        🏆 <strong>₹42,000</strong> prize pool
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-cyan-50 p-6 shadow-xl">

      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-emerald-100 blur-3xl opacity-50" />

      <div className="flex items-center gap-2 mb-4">
        <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
        <span className="font-semibold text-emerald-700">
          LIVE PARTICIPATION
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        <div>
          <div className="flex items-center gap-2 text-gray-700 mb-2">
            <Users size={18} />
            <span>Registered Photographers</span>
          </div>

          <div className="text-4xl font-bold text-gray-900">
            {stats.totalPhotographers}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-gray-700 mb-2">
            <MapPinned size={18} />
            <span>States Represented</span>
          </div>

          <div className="text-4xl font-bold text-emerald-600">
            {stats.totalStates}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3">
          <Trophy size={18} />
          <span className="font-semibold">
            Top Participating States
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {stats.topStates.map((state) => (
            <div
              key={state.state}
              className="px-4 py-2 rounded-full bg-white border border-emerald-200 shadow-sm"
            >
              {state.state} ({state.count})
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}