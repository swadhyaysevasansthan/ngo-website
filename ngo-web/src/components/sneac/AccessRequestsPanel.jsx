import React, { useState, useMemo } from 'react';
import Card from '../Card1';
import { STATUS_COLORS } from './sneacHelpers';

// 🔥 SNEAC — Access Requests tab. Search/filter state is local since nothing
// outside this panel needs it.
const AccessRequestsPanel = ({
  requests,
  actionLoading,
  onApprove,
  onReject,
  onResendLink,
}) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredRequests = useMemo(() => {
    const q = search.toLowerCase();
    return requests.filter((r) => {
      const matchStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchSearch =
        !q ||
        r.school_name.toLowerCase().includes(q) ||
        r.school_email.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [requests, statusFilter, search]);

  return (
    <Card>
      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by school, email or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">School</th>
              <th className="px-4 py-3 text-left">Emails</th>
              <th className="px-4 py-3 text-left">Contact Numbers</th>
              <th className="px-4 py-3 text-left">Principal</th>
              <th className="px-4 py-3 text-left">City / State</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((req) => (
              <tr key={req.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-semibold">{req.school_name}</div>
                  <div className="text-xs text-gray-500 mt-1">{req.board_of_education}</div>
                </td>
                <td className="px-4 py-3 text-xs">
                  <div>{req.school_email}</div>
                  {req.school_email_2 && (
                    <div className="text-gray-500 mt-1">{req.school_email_2}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-xs">
                  <div>📞 {req.landline_number}</div>
                  <div className="mt-1">📱 {req.mobile_number}</div>
                </td>
                <td className="px-4 py-3 text-xs">
                  <div className="font-semibold">{req.principal_name}</div>
                  {req.principal_phone && (
                    <div className="text-gray-500 mt-1">{req.principal_phone}</div>
                  )}
                </td>
                <td className="px-4 py-3">
                  {req.city}, {req.state}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[req.status]}`}
                  >
                    {req.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-2">
                    {req.status === 'pending' && (
                      <>
                        <button
                          disabled={actionLoading === req.id}
                          onClick={() => onApprove(req.id)}
                          className="px-3 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-semibold hover:bg-green-200"
                        >
                          ✅ Approve
                        </button>
                        <button
                          disabled={actionLoading === req.id}
                          onClick={() => onReject(req)}
                          className="px-3 py-1 rounded-lg bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200"
                        >
                          ❌ Reject
                        </button>
                      </>
                    )}
                    {req.status === 'approved' && (
                      <button
                        disabled={actionLoading === req.id}
                        onClick={() => onResendLink(req.id)}
                        className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200"
                      >
                        🔗 Resend Link
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default AccessRequestsPanel;