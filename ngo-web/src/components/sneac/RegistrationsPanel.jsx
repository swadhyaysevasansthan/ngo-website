import React, { useState, useMemo, useEffect } from 'react';
import Card from '../Card1';
import { isFullyAllotted, downloadExcel, parseMaybeJSON } from './sneacHelpers';
import Pagination from './Pagination';

// 🔥 SNEAC — compact registrations list for painting/quiz.
// Groups painting submissions by school so primary & secondary show in one single consolidated row.
const RegistrationsPanel = ({ competitionType, registrations, onViewDetails, onDelete, onToggleConcluded, actionLoading }) => {
  const isPainting = competitionType === 'painting';
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset page when filter/search/competitionType changes
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, competitionType]);

  const displayList = useMemo(() => {
    let list = registrations;

    if (isPainting) {
      // Group painting registrations by request_id (school)
      const grouped = new Map();

      for (const reg of registrations) {
        const key = reg.request_id || reg.school_name;
        if (!grouped.has(key)) {
          grouped.set(key, {
            ...reg,
            subRegistrations: [reg],
            total_participants: Number(reg.total_participants || 0),
            teachers: [...(reg.teachers || [])],
          });
        } else {
          const existing = grouped.get(key);
          existing.subRegistrations.push(reg);
          existing.total_participants += Number(reg.total_participants || 0);

          // Merge teachers deduplicating by teacher_name/email
          const existingTeacherNames = new Set(existing.teachers.map((t) => t.teacher_name?.toLowerCase()));
          for (const t of reg.teachers || []) {
            if (!existingTeacherNames.has(t.teacher_name?.toLowerCase())) {
              existing.teachers.push(t);
              existingTeacherNames.add(t.teacher_name?.toLowerCase());
            }
          }

          // Merge categories and dates
          const cats1 = existing.competition_categories || [];
          const cats2 = reg.competition_categories || [];
          existing.competition_categories = Array.from(new Set([...cats1, ...cats2]));

          if (reg.primary_allotted_date) existing.primary_allotted_date = reg.primary_allotted_date;
          if (reg.secondary_allotted_date) existing.secondary_allotted_date = reg.secondary_allotted_date;
          if (reg.primary_preferred_dates) existing.primary_preferred_dates = reg.primary_preferred_dates;
          if (reg.secondary_preferred_dates) existing.secondary_preferred_dates = reg.secondary_preferred_dates;

          existing.confirmation_sent = existing.confirmation_sent || reg.confirmation_sent;
          existing.is_concluded = existing.is_concluded || reg.is_concluded;
        }
      }
      list = Array.from(grouped.values());
    }

    // Apply Search and Status Filter
    const q = search.toLowerCase();
    return list.filter((r) => {
      const matchSearch =
        !q ||
        r.school_name.toLowerCase().includes(q) ||
        r.school_email.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q);

      let matchStatus = true;
      if (statusFilter === 'allotted') {
        matchStatus = isFullyAllotted(r, competitionType);
      } else if (statusFilter === 'pending') {
        matchStatus = !isFullyAllotted(r, competitionType);
      } else if (statusFilter === 'concluded') {
        matchStatus = Boolean(r.is_concluded);
      }

      return matchSearch && matchStatus;
    });
  }, [registrations, isPainting, competitionType, search, statusFilter]);

  const paginatedList = useMemo(() => {
    const start = (page - 1) * pageSize;
    return displayList.slice(start, start + pageSize);
  }, [displayList, page, pageSize]);

  const handleDownloadExcel = () => {
    let headers = [];
    let rows = [];

    if (isPainting) {
      headers = [
        'School Name',
        'School Email',
        'City',
        'State',
        'Board',
        'Total Participants',
        'Primary Total',
        'Secondary Total',
        'Class 3',
        'Class 4',
        'Class 5',
        'Class 6',
        'Class 7',
        'Class 8',
        'Teachers',
        'Primary Preferred Dates',
        'Primary Allotted Date',
        'Secondary Preferred Dates',
        'Secondary Allotted Date',
        'Confirmation Sent',
        'Competition Concluded',
        'Submitted At',
      ];

      rows = displayList.map((r) => {
        const counts = parseMaybeJSON(r.class_counts) || {};
        const teachersStr = (r.teachers || []).map((t) => `${t.teacher_name} (${t.teacher_email || ''}, ${t.teacher_phone || ''})`).join('; ');
        const primaryPref = (parseMaybeJSON(r.primary_preferred_dates) || []).join(', ');
        const secondaryPref = (parseMaybeJSON(r.secondary_preferred_dates) || []).join(', ');

        return [
          r.school_name,
          r.school_email,
          r.city,
          r.state,
          r.board_of_education,
          r.total_participants,
          r.primary_category_total || 0,
          r.secondary_category_total || 0,
          counts['3'] || 0,
          counts['4'] || 0,
          counts['5'] || 0,
          counts['6'] || 0,
          counts['7'] || 0,
          counts['8'] || 0,
          teachersStr,
          primaryPref,
          r.primary_allotted_date || '',
          secondaryPref,
          r.secondary_allotted_date || '',
          r.confirmation_sent ? 'Yes' : 'No',
          r.is_concluded ? 'Yes' : 'No',
          r.submitted_at || '',
        ];
      });
    } else {
      headers = [
        'School Name',
        'School Email',
        'City',
        'State',
        'Board',
        'Total Participants',
        'Available Computers',
        'Class 6',
        'Class 7',
        'Class 8',
        'Teachers',
        'Preferred Dates',
        'Allotted Date',
        'Confirmation Sent',
        'Competition Concluded',
        'Submitted At',
      ];

      rows = displayList.map((r) => {
        const counts = parseMaybeJSON(r.class_counts) || {};
        const teachersStr = (r.teachers || []).map((t) => `${t.teacher_name} (${t.teacher_email || ''}, ${t.teacher_phone || ''})`).join('; ');
        const prefDates = (parseMaybeJSON(r.preferred_dates) || []).join(', ');

        return [
          r.school_name,
          r.school_email,
          r.city,
          r.state,
          r.board_of_education,
          r.total_participants,
          r.available_computers || 0,
          counts['6'] || 0,
          counts['7'] || 0,
          counts['8'] || 0,
          teachersStr,
          prefDates,
          r.allotted_date || '',
          r.confirmation_sent ? 'Yes' : 'No',
          r.is_concluded ? 'Yes' : 'No',
          r.submitted_at || '',
        ];
      });
    }

    const filename = `SNEAC_${isPainting ? 'Painting' : 'Quiz'}_Registrations.xls`;
    downloadExcel(filename, headers, rows);
  };

  return (
    <Card>
      {/* HEADER & DOWNLOAD */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <h3 className="text-base font-bold text-gray-800">
          {isPainting ? 'Painting Registrations' : 'Quiz Registrations'} ({displayList.length} Schools)
        </h3>
        <button
          onClick={handleDownloadExcel}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition flex items-center gap-2 shadow-sm"
        >
          📊 Download Excel ({displayList.length})
        </button>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by school, email or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Status</option>
          <option value="pending">Date Allotment Pending</option>
          <option value="allotted">Date Allotted</option>
          <option value="concluded">Concluded</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">School</th>
              <th className="px-4 py-3 text-left">Teachers</th>
              <th className="px-4 py-3 text-left">City / State</th>
              <th className="px-4 py-3 text-center">Students</th>
              {!isPainting && <th className="px-4 py-3 text-center">Computers</th>}
              <th className="px-4 py-3 text-left">Dates</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedList.map((reg) => {
              const fullyAllotted = isFullyAllotted(reg, competitionType);
              const teacherCount = reg.teachers?.length || 0;
              const isConcluded = reg.is_concluded;

              return (
                <tr key={reg.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-semibold">{reg.school_name}</p>
                    <p className="text-xs text-gray-500">{reg.school_email}</p>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {teacherCount > 0 ? (
                      <>
                        {reg.teachers[0].teacher_name}
                        {teacherCount > 1 && (
                          <span className="text-gray-500"> +{teacherCount - 1} more</span>
                        )}
                      </>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {reg.city}, {reg.state}
                  </td>
                  <td className="px-4 py-3 text-center font-semibold">
                    {reg.total_participants}
                  </td>
                  {!isPainting && (
                    <td className="px-4 py-3 text-center">{reg.available_computers}</td>
                  )}
                  <td className="px-4 py-3">
                    {fullyAllotted ? (
                      <span className="text-green-700 font-semibold text-xs">✓ Allotted</span>
                    ) : (
                      <span className="text-amber-600 font-semibold text-xs">Pending</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isConcluded ? (
                      <span className="bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                        🏆 Concluded
                      </span>
                    ) : reg.confirmation_sent ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                        ✓ Date Confirmed
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">
                        Registered
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewDetails(reg)}
                        className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-semibold hover:bg-primary/20 whitespace-nowrap"
                      >
                        View Details
                      </button>
                      <button
                        disabled={actionLoading === reg.id}
                        onClick={() => {
                          if (reg.subRegistrations && reg.subRegistrations.length > 0) {
                            reg.subRegistrations.forEach((sub) => onToggleConcluded && onToggleConcluded(sub.id, reg.is_concluded));
                          } else {
                            onToggleConcluded && onToggleConcluded(reg.id, reg.is_concluded);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border transition-all ${
                          isConcluded
                            ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        {isConcluded ? '↩ Re-open' : '🏆 Mark Concluded'}
                      </button>
                      <button
                        onClick={() => {
                          if (reg.subRegistrations && reg.subRegistrations.length > 0) {
                            reg.subRegistrations.forEach((sub) => onDelete && onDelete(sub.id, reg.school_name));
                          } else {
                            onDelete && onDelete(reg.id, reg.school_name);
                          }
                        }}
                        className="px-2.5 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 border border-red-200"
                        title="Delete Registration"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {displayList.length === 0 && (
              <tr>
                <td
                  colSpan={isPainting ? 7 : 8}
                  className="px-4 py-10 text-center text-gray-400"
                >
                  No registrations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <Pagination
        page={page}
        pageSize={pageSize}
        total={displayList.length}
        onPage={setPage}
        onPageSize={setPageSize}
      />
    </Card>
  );
};

export default RegistrationsPanel;