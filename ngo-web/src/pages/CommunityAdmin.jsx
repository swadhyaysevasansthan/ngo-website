import React, { useState } from 'react';
import CommunityAdminTab from '../components/CommunityAdminTab';

const ADMIN_USER = 'swadhyayadmin';
const ADMIN_PASS = 'ssf@communities2026';

const CommunityAdmin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('community_admin_auth') === 'true');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      sessionStorage.setItem('community_admin_auth', 'true');
      setIsLoggedIn(true);
      setError('');
    } else { setError('Invalid credentials'); }
  };

  if (!isLoggedIn) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">🌿 Communities Admin</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Username</label><input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-3 border rounded-lg" placeholder="Username" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border rounded-lg" placeholder="Password" /></div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700">Login</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b"><div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between"><h1 className="text-xl font-bold text-gray-800">🌿 Communities Management</h1><button onClick={() => { sessionStorage.removeItem('community_admin_auth'); setIsLoggedIn(false); }} className="text-sm text-red-600 hover:text-red-700 font-medium">Logout</button></div></div>
      <div className="max-w-7xl mx-auto px-4 py-8"><CommunityAdminTab /></div>
    </div>
  );
};

export default CommunityAdmin;
