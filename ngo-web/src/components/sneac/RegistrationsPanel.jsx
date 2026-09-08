import React, { useMemo } from 'react';
import Card from '../Card1';
import { isFullyAllotted } from './sneacHelpers';

// 🔥 SNEAC — compact registrations list for painting/quiz.
// Groups painting submissions by school so primary & secondary show in one single consolidated row.
const RegistrationsPanel = ({ competitionType, registrations, onViewDetails, onDelete }) => {
  const isPainting = competitionType === 'painting';

  const displayList = useMemo(() => {
    if (!isPainting) return registrations;

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
      }
    }

    return Array.from(grouped.values());
  }, [registrations, isPainting]);

  return (
    <Card>
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
              <th className="px-4 py-3 text-left">Confirmation</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayList.map((reg) => {
              const fullyAllotted = isFullyAllotted(reg, competitionType);
              const teacherCount = reg.teachers?.length || 0;

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
                    {reg.confirmation_sent ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                        ✓ Sent
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">
                        Not sent
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewDetails(reg)}
                        className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-semibold hover:bg-primary/20 whitespace-nowrap"
                      >
                        View Details / Take Action
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
                  No registrations yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default RegistrationsPanel;