import React from 'react';
import Card from '../Card1';
import { isFullyAllotted } from './sneacHelpers';

// 🔥 SNEAC — compact registrations list for painting/quiz.
// Only the essentials show in the row; everything else (teacher contacts,
// full date breakdown, actions) lives behind "View Details".
const RegistrationsPanel = ({ competitionType, registrations, onViewDetails }) => {
  const isPainting = competitionType === 'painting';

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
              <th className="px-4 py-3 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((reg) => {
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
                    <button
                      onClick={() => onViewDetails(reg)}
                      className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-semibold hover:bg-primary/20 whitespace-nowrap"
                    >
                      View Details / Take Action
                    </button>
                  </td>
                </tr>
              );
            })}
            {registrations.length === 0 && (
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