import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import JudgeDashboard from '../components/evaluation/JudgeDashboard';

const JudgeDashboardPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('judgeToken');
    localStorage.removeItem('judgeName');
    navigate('/judge/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-800">🏆 Judge Portal</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1.5"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
      <JudgeDashboard />
    </div>
  );
};

export default JudgeDashboardPage;
