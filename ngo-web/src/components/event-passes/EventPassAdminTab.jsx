import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { eventPassAPI } from '../../utils/api';
import AttendanceDashboard from './AttendanceDashboard';
import PassList from './PassList';
import BulkImport from './BulkImport';
import EventsManager from './EventsManager';
import ScannerDevices from './ScannerDevices';
import Button from '../Button';

const SUB_TABS = [
  { id: 'stats', label: '📊 Dashboard & Logs' },
  { id: 'passes', label: '👥 Passes Directory' },
  { id: 'import', label: '📥 Bulk Import' },
  { id: 'events', label: '📅 All Events' },
  { id: 'scanners', label: '📱 Scanner Devices' },
];

const EventPassAdminTab = () => {
  const [activeSubTab, setActiveSubTab] = useState('stats');
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');

  const loadEvents = useCallback(async () => {
    try {
      const res = await eventPassAPI.listEvents();
      if (res.data.success) {
        setEvents(res.data.events);
        if (res.data.events.length > 0 && !selectedEventId) {
          const activeOrFirst =
            res.data.events.find((e) => e.status === 'active') || res.data.events[0];
          setSelectedEventId(activeOrFirst.id.toString());
        }
      }
    } catch {
      toast.error('Failed to load events list');
    }
  }, [selectedEventId]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const currentEvent = events.find((e) => e.id.toString() === selectedEventId);

  return (
    <div className="space-y-6">
      {/* Event Selector & Quick Actions Ribbon */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="font-bold text-gray-700 whitespace-nowrap text-sm">Select Event:</label>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border rounded-xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 border-gray-200"
          >
            <option value="">-- Choose Event --</option>
            {events.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.name} [{evt.status.toUpperCase()}]
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 w-full md:w-auto justify-end">
          <Button
            variant="outline"
            className="text-xs px-4 py-2 hover:scale-100"
            onClick={() => setActiveSubTab('events')}
          >
            ➕ New Event
          </Button>
          {selectedEventId && (
            <Button
              variant="secondary"
              className="text-xs px-4 py-2 hover:scale-100"
              onClick={() => setActiveSubTab('events')}
            >
              ✏️ Manage Events
            </Button>
          )}
        </div>
      </div>

      {/* Sub-navigation */}
      <div className="flex border-b border-gray-200 gap-1 overflow-x-auto pb-px">
        {SUB_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-5 py-3 font-semibold text-sm transition-all border-b-2 whitespace-nowrap ${
              activeSubTab === tab.id
                ? 'text-primary border-primary bg-primary/5 rounded-t-xl'
                : 'text-gray-500 border-transparent hover:text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sub-tab content */}
      {activeSubTab === 'stats' && (
        <AttendanceDashboard selectedEventId={selectedEventId} />
      )}

      {activeSubTab === 'passes' && (
        <PassList
          selectedEventId={selectedEventId}
          events={events}
        />
      )}

      {activeSubTab === 'import' && (
        <BulkImport
          selectedEventId={selectedEventId}
          onImportComplete={() => setActiveSubTab('passes')}
        />
      )}

      {activeSubTab === 'events' && (
        <EventsManager
          events={events}
          onEventsUpdated={loadEvents}
        />
      )}

      {activeSubTab === 'scanners' && (
        <ScannerDevices
          events={events}
          defaultEventId={selectedEventId}
        />
      )}
    </div>
  );
};

export default EventPassAdminTab;
