import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { eventPassAPI } from '../../utils/api';
import Card from '../Card';
import Button from '../Button';
import { generateScannerPassword } from './eventPassHelpers';

const ScannerDevices = ({ events, defaultEventId }) => {
  const [scanners, setScanners] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newScanner, setNewScanner] = useState({
    name: '',
    deviceCode: '',
    password: '',
    eventId: defaultEventId || '',
    gate: 'Main Gate',
  });

  const loadScanners = useCallback(async () => {
    try {
      const res = await eventPassAPI.listScannerDevices();
      if (res.data.success) setScanners(res.data.scanners);
    } catch {
      toast.error('Failed to retrieve scanner devices');
    }
  }, []);

  useEffect(() => {
    loadScanners();
  }, [loadScanners]);

  const openModal = () => {
    setNewScanner({
      name: '',
      deviceCode: '',
      password: '',
      eventId: defaultEventId || '',
      gate: 'Main Gate',
    });
    setShowModal(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await eventPassAPI.createScannerDevice({
        ...newScanner,
        eventId: newScanner.eventId ? parseInt(newScanner.eventId) : null,
      });
      if (res.data.success) {
        toast.success('Scanner device created successfully!');
        setShowModal(false);
        loadScanners();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register scanner device');
    }
  };

  const handleToggleActive = async (scannerId, currentActive) => {
    try {
      const res = await eventPassAPI.toggleScannerActive(scannerId, !currentActive);
      if (res.data.success) {
        toast.success('Scanner status updated');
        loadScanners();
      }
    } catch {
      toast.error('Failed to toggle scanner status');
    }
  };

  return (
    <>
      <Card className="p-5 border border-gray-100">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h3 className="font-bold text-gray-800 text-lg">Scanner Devices</h3>
          <Button variant="primary" className="text-xs px-4 py-2 hover:scale-100" onClick={openModal}>
            ➕ Register Scanner Device
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold">
                <th className="p-3">Device Name</th>
                <th className="p-3">Device Code</th>
                <th className="p-3">Assigned Event</th>
                <th className="p-3">Assigned Gate</th>
                <th className="p-3">Status</th>
                <th className="p-3">Last Active</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {scanners.map((sc) => (
                <tr key={sc.id} className="hover:bg-gray-50/50">
                  <td className="p-3 font-semibold text-slate-800">{sc.name}</td>
                  <td className="p-3 font-mono text-xs text-gray-500">{sc.device_code}</td>
                  <td className="p-3 text-gray-600 text-xs">{sc.event_name || 'Universal (All Events)'}</td>
                  <td className="p-3 text-gray-600 text-xs">{sc.gate || 'N/A'}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        sc.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {sc.is_active ? 'ACTIVE' : 'DISABLED'}
                    </span>
                  </td>
                  <td className="p-3 text-gray-500 text-xs">
                    {sc.last_seen_at ? new Date(sc.last_seen_at).toLocaleString() : 'Never logged in'}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      className={`text-xs px-2.5 py-1.5 rounded-lg font-semibold ${
                        sc.is_active
                          ? 'bg-red-50 text-red-700 hover:bg-red-100'
                          : 'bg-green-50 text-green-700 hover:bg-green-100'
                      }`}
                      onClick={() => handleToggleActive(sc.id, sc.is_active)}
                    >
                      {sc.is_active ? '🔴 Disable' : '🟢 Enable'}
                    </button>
                  </td>
                </tr>
              ))}
              {scanners.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-gray-400 py-8">
                    No scanner devices registered.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Register Scanner Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-fade-in">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Register Scanner Device</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Scanner Operator Name *</label>
                <input
                  type="text"
                  required
                  value={newScanner.name}
                  onChange={(e) => setNewScanner({ ...newScanner, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                  placeholder="e.g. Volunteer Gate A"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Device Code (Unique Login) *</label>
                <input
                  type="text"
                  required
                  value={newScanner.deviceCode}
                  onChange={(e) =>
                    setNewScanner({ ...newScanner, deviceCode: e.target.value.toUpperCase().replace(/\s+/g, '-') })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm font-mono"
                  placeholder="e.g. GATE-A-VOLUNTEER"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Device Access Password *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newScanner.password}
                    onChange={(e) => setNewScanner({ ...newScanner, password: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm font-mono"
                    placeholder="Enter access password"
                  />
                  <button
                    type="button"
                    className="text-xs px-3 py-2 border rounded-lg hover:bg-gray-100 font-semibold text-gray-700 whitespace-nowrap"
                    onClick={() => setNewScanner((prev) => ({ ...prev, password: generateScannerPassword() }))}
                  >
                    🎲 Auto Generate
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Assigned Gate</label>
                  <input
                    type="text"
                    value={newScanner.gate}
                    onChange={(e) => setNewScanner({ ...newScanner, gate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                    placeholder="e.g. North Gate"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Assign to Event</label>
                  <select
                    value={newScanner.eventId}
                    onChange={(e) => setNewScanner({ ...newScanner, eventId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                  >
                    <option value="">Universal Scanner (All Events)</option>
                    {events.map((evt) => (
                      <option key={evt.id} value={evt.id}>
                        {evt.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  className="text-xs px-4 py-2 border rounded-lg hover:bg-gray-50 font-semibold text-gray-600"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <Button type="submit" variant="primary" className="text-xs py-2 px-5 hover:scale-100">
                  Register Device
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ScannerDevices;
