import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { eventPassAPI } from '../../utils/api';
import Card from '../Card';
import Button from '../Button';

const EventPassAdminTab = () => {
    const [activeSubTab, setActiveSubTab] = useState('stats'); // stats, passes, import, events, scanners
    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState('');
    const [loading, setLoading] = useState(false);

    // Stats State
    const [stats, setStats] = useState(null);
    const [logs, setLogs] = useState([]);

    // Passes State
    const [passes, setPasses] = useState([]);
    const [passSearch, setPassSearch] = useState('');
    const [passStatus, setPassStatus] = useState('');
    const [passLimit, setPassLimit] = useState(50);
    const [passOffset, setPassOffset] = useState(0);
    const [totalPassesCount, setTotalPassesCount] = useState(0);
    const [selectedPass, setSelectedPass] = useState(null); // for Print Preview modal
    const [showCreatePassModal, setShowCreatePassModal] = useState(false);
    const [newPass, setNewPass] = useState({
        guestName: '',
        mobile: '',
        email: '',
        category: 'General',
        notes: ''
    });

    // Bulk Import State
    const [importText, setImportText] = useState('');
    const [importPreview, setImportPreview] = useState([]);
    const [importSummary, setImportSummary] = useState(null);

    // Scanner State
    const [scanners, setScanners] = useState([]);
    const [showCreateScannerModal, setShowCreateScannerModal] = useState(false);
    const [generatedScannerPassword, setGeneratedScannerPassword] = useState('');
    const [newScanner, setNewScanner] = useState({
        name: '',
        deviceCode: '',
        password: '',
        eventId: '',
        gate: 'Main Gate'
    });

    // Events Form State
    const [showCreateEventModal, setShowCreateEventModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [eventForm, setEventForm] = useState({
        name: '',
        slug: '',
        description: '',
        eventDate: '',
        venue: ''
    });

    // ============================================================
    // INITIALIZATIONS & GLOBAL LOADERS
    // ============================================================

    const loadEvents = useCallback(async () => {
        try {
            const res = await eventPassAPI.listEvents();
            if (res.data.success) {
                setEvents(res.data.events);
                if (res.data.events.length > 0 && !selectedEventId) {
                    // Default to the first active/draft event
                    const activeOrFirst = res.data.events.find(e => e.status === 'active') || res.data.events[0];
                    setSelectedEventId(activeOrFirst.id.toString());
                }
            }
        } catch (err) {
            toast.error('Failed to load events list');
        }
    }, [selectedEventId]);

    useEffect(() => {
        loadEvents();
    }, [loadEvents]);

    // Load context-specific details when event selection changes
    const loadEventData = useCallback(async () => {
        if (!selectedEventId) return;
        setLoading(true);
        try {
            const [statsRes, logsRes] = await Promise.all([
                eventPassAPI.getAttendanceStats(selectedEventId),
                eventPassAPI.getCheckInLogs(selectedEventId, { limit: 100 })
            ]);

            if (statsRes.data.success) setStats(statsRes.data.stats);
            if (logsRes.data.success) setLogs(logsRes.data.logs);
        } catch (err) {
            toast.error('Failed to load event dashboard statistics');
        } finally {
            setLoading(false);
        }
    }, [selectedEventId]);

    useEffect(() => {
        loadEventData();
    }, [loadEventData]);

    // Load passes with search/filters
    const loadPassesList = useCallback(async () => {
        if (!selectedEventId) return;
        try {
            const res = await eventPassAPI.listPasses({
                eventId: selectedEventId,
                status: passStatus,
                search: passSearch,
                limit: passLimit,
                offset: passOffset
            });
            if (res.data.success) {
                setPasses(res.data.passes);
                setTotalPassesCount(res.data.totalCount);
            }
        } catch (err) {
            toast.error('Failed to retrieve passes list');
        }
    }, [selectedEventId, passStatus, passSearch, passLimit, passOffset]);

    useEffect(() => {
        if (activeSubTab === 'passes') {
            loadPassesList();
        }
    }, [activeSubTab, loadPassesList]);

    // Load scanners list
    const loadScanners = useCallback(async () => {
        try {
            const res = await eventPassAPI.listScannerDevices();
            if (res.data.success) setScanners(res.data.scanners);
        } catch (err) {
            toast.error('Failed to retrieve scanner devices');
        }
    }, []);

    useEffect(() => {
        if (activeSubTab === 'scanners') {
            loadScanners();
        }
    }, [activeSubTab, loadScanners]);

    // ============================================================
    // EVENT ACTIONS
    // ============================================================

    const handleSaveEvent = async (e) => {
        e.preventDefault();
        try {
            if (editingEvent) {
                const res = await eventPassAPI.updateEvent(editingEvent.id, {
                    ...eventForm,
                    status: editingEvent.status
                });
                if (res.data.success) {
                    toast.success('Event updated successfully');
                    loadEvents();
                    setShowCreateEventModal(false);
                    setEditingEvent(null);
                }
            } else {
                const res = await eventPassAPI.createEvent(eventForm);
                if (res.data.success) {
                    toast.success('Event created successfully');
                    loadEvents();
                    setShowCreateEventModal(false);
                }
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save event');
        }
    };

    const handleEditEventClick = (event) => {
        setEditingEvent(event);
        setEventForm({
            name: event.name,
            slug: event.slug,
            description: event.description || '',
            eventDate: event.event_date ? event.event_date.split('T')[0] : '',
            venue: event.venue || ''
        });
        setShowCreateEventModal(true);
    };

    const handleToggleEventStatus = async (event, newStatus) => {
        try {
            const res = await eventPassAPI.updateEvent(event.id, {
                name: event.name,
                slug: event.slug,
                description: event.description || '',
                eventDate: event.event_date ? event.event_date.split('T')[0] : '',
                venue: event.venue || '',
                status: newStatus
            });
            if (res.data.success) {
                toast.success(`Event status updated to ${newStatus}`);
                loadEvents();
            }
        } catch (err) {
            toast.error('Failed to change event status');
        }
    };

    // ============================================================
    // PASS ACTIONS
    // ============================================================

    const handleCreatePassSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await eventPassAPI.createPass({
                ...newPass,
                eventId: parseInt(selectedEventId)
            });
            if (res.data.success) {
                toast.success('Pass issued successfully');
                setShowCreatePassModal(false);
                setNewPass({ guestName: '', mobile: '', email: '', category: 'General', notes: '' });
                loadPassesList();
                loadEventData();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to issue pass');
        }
    };

    const handleCancelPass = async (passId) => {
        if (!window.confirm('Are you sure you want to cancel this entry pass?')) return;
        try {
            const res = await eventPassAPI.cancelPass(passId);
            if (res.data.success) {
                toast.success('Pass cancelled');
                loadPassesList();
                loadEventData();
                if (selectedPass && selectedPass.id === passId) {
                    setSelectedPass(res.data.pass);
                }
            }
        } catch (err) {
            toast.error('Failed to cancel pass');
        }
    };

    const handleReissuePass = async (passId) => {
        if (!window.confirm('This will invalidate the existing QR code and issue a new one. Continue?')) return;
        try {
            const res = await eventPassAPI.reissueQR(passId);
            if (res.data.success) {
                toast.success('New QR pass reissued successfully');
                loadPassesList();
                loadEventData();
                if (selectedPass && selectedPass.id === passId) {
                    // Keep print details updated
                    const updatedPass = { ...res.data.pass, event_name: selectedPass.event_name };
                    setSelectedPass(updatedPass);
                }
            }
        } catch (err) {
            toast.error('Failed to reissue QR pass');
        }
    };

    const handleManualCheckIn = async (passId) => {
        if (!window.confirm('Check in this guest manually?')) return;
        try {
            const res = await eventPassAPI.manualCheckIn({ passId, gate: 'Admin Desk' });
            if (res.data.success) {
                toast.success('Guest checked in successfully!');
                loadPassesList();
                loadEventData();
                if (selectedPass && selectedPass.id === passId) {
                    setSelectedPass(prev => ({ ...prev, status: 'CHECKED_IN' }));
                }
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed manual check-in');
        }
    };

    // Printable Pass utility
    const handlePrint = (pass) => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            toast.error('Pop-up blocked! Please allow pop-ups to print passes.');
            return;
        }
        const currentEvent = events.find(e => e.id.toString() === selectedEventId);
        const eventName = currentEvent ? currentEvent.name : 'Swadhyay Event';

        printWindow.document.write(`
      <html>
        <head>
          <title>Print Pass - ${pass.pass_number}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background-color: #fff;
            }
            .pass-card {
              border: 3px dashed #1b4d3e;
              border-radius: 16px;
              padding: 24px;
              width: 360px;
              text-align: center;
              background: #fff;
              box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            }
            .org-title {
              color: #1b4d3e;
              font-size: 15px;
              font-weight: 800;
              margin-bottom: 2px;
              letter-spacing: 1px;
            }
            .pass-label {
              color: #d97706;
              font-size: 11px;
              font-weight: 700;
              margin-bottom: 15px;
              letter-spacing: 0.5px;
            }
            .event-title {
              font-size: 18px;
              font-weight: 800;
              color: #0f172a;
              margin-bottom: 20px;
              border-bottom: 1px solid #f1f5f9;
              padding-bottom: 12px;
            }
            .qr-code {
              margin: 15px auto;
              width: 180px;
              height: 180px;
              border: 1px solid #f1f5f9;
              padding: 8px;
              border-radius: 8px;
            }
            .guest-name {
              font-size: 18px;
              font-weight: 700;
              color: #1e293b;
              margin: 12px 0 4px 0;
            }
            .pass-num {
              font-family: monospace;
              font-size: 13px;
              color: #64748b;
              background: #f8fafc;
              padding: 4px 10px;
              border-radius: 6px;
              display: inline-block;
              margin-bottom: 10px;
            }
            .cat-badge {
              font-size: 11px;
              font-weight: bold;
              color: #fff;
              background-color: #d97706;
              padding: 4px 14px;
              border-radius: 9999px;
              display: inline-block;
              margin-bottom: 15px;
              text-transform: uppercase;
            }
            .cat-VIP { background-color: #dc2626; }
            .cat-GUEST { background-color: #2563eb; }
            .cat-DELEGATE { background-color: #16a34a; }
            .note {
              font-size: 11px;
              color: #94a3b8;
              margin-top: 10px;
              border-top: 1px dashed #e2e8f0;
              padding-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="pass-card">
            <div class="org-title">SWADHYAY SEVA SANSTHAN</div>
            <div class="pass-label">OFFICIAL ENTRY PASS</div>
            <div class="event-title">${eventName}</div>
            <img class="qr-code" src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${pass.qr_token}" alt="Pass QR" />
            <div class="guest-name">${pass.guest_name}</div>
            <div class="pass-num">${pass.pass_number}</div>
            <div>
              <div class="cat-badge cat-${(pass.category || '').toUpperCase()}">${pass.category || 'General'}</div>
            </div>
            <div class="note">Please present this QR code at the entry gate.</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
        printWindow.document.close();
    };

    // ============================================================
    // BULK IMPORT ACTIONS
    // ============================================================

    const handleImportParse = () => {
        if (!importText.trim()) {
            toast.warning('Please paste spreadsheet data or CSV content first');
            return;
        }

        const lines = importText.split('\n');
        const parsed = [];
        let duplicatesCount = 0;
        let invalidCount = 0;
        const namesSet = new Set();

        lines.forEach((line, index) => {
            if (!line.trim()) return; // skip empty lines

            // Handle CSV comma splitting or TSV tab splitting (Excel copy-paste uses tabs)
            const delimiter = line.includes('\t') ? '\t' : ',';
            const parts = line.split(delimiter).map(p => p.trim().replace(/^["']|["']$/g, '')); // strip quotes

            // Skip header row if matches template
            if (index === 0 && (parts[0].toLowerCase().includes('name') || parts[0].toLowerCase().includes('guest'))) {
                return;
            }

            const guestName = parts[0] || '';
            const mobile = parts[1] || '';
            const email = parts[2] || '';
            const category = parts[3] || 'General';
            const notes = parts[4] || '';

            const isValid = guestName.length > 0;
            const isDuplicate = namesSet.has(guestName.toLowerCase() + mobile);

            if (!isValid) invalidCount++;
            if (isDuplicate && isValid) duplicatesCount++;

            if (isValid) {
                namesSet.add(guestName.toLowerCase() + mobile);
            }

            parsed.push({
                guestName,
                mobile,
                email,
                category,
                notes,
                isValid,
                isDuplicate
            });
        });

        setImportPreview(parsed);
        setImportSummary({
            total: parsed.length,
            valid: parsed.filter(p => p.isValid && !p.isDuplicate).length,
            duplicates: duplicatesCount,
            invalid: invalidCount
        });
    };

    const handleImportSubmit = async () => {
        const validGuests = importPreview.filter(p => p.isValid && !p.isDuplicate);
        if (validGuests.length === 0) {
            toast.error('No valid, non-duplicate guests to import.');
            return;
        }

        setLoading(true);
        try {
            const res = await eventPassAPI.bulkImportPasses({
                eventId: parseInt(selectedEventId),
                guests: validGuests.map(g => ({
                    guestName: g.guestName,
                    mobile: g.mobile,
                    email: g.email,
                    category: g.category,
                    notes: g.notes
                }))
            });

            if (res.data.success) {
                toast.success(`Successfully imported ${res.data.count} guest passes!`);
                setImportText('');
                setImportPreview([]);
                setImportSummary(null);
                setActiveSubTab('passes');
                loadEventData();
            }
        } catch (err) {
            toast.error('Failed to import guest passes');
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // SCANNER MANAGEMENT ACTIONS
    // ============================================================

    const handleCreateScanner = async (e) => {
        e.preventDefault();
        try {
            const res = await eventPassAPI.createScannerDevice({
                ...newScanner,
                eventId: newScanner.eventId ? parseInt(newScanner.eventId) : null
            });

            if (res.data.success) {
                toast.success('Scanner device created successfully!');
                setNewScanner({
                    name: '',
                    deviceCode: '',
                    password: '',
                    eventId: '',
                    gate: 'Main Gate'
                });
                setShowCreateScannerModal(false);
                loadScanners();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to register scanner device');
        }
    };

    const handleToggleScannerActive = async (scannerId, currentActive) => {
        try {
            const res = await eventPassAPI.toggleScannerActive(scannerId, !currentActive);
            if (res.data.success) {
                toast.success(`Scanner status toggled successfully`);
                loadScanners();
            }
        } catch (err) {
            toast.error('Failed to toggle scanner status');
        }
    };

    const handleGenerateScannerPassword = () => {
        // Generates a random readable password like passQRUtils does
        const charset = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789';
        let pass = '';
        for (let i = 0; i < 10; i++) {
            pass += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        setNewScanner(prev => ({ ...prev, password: pass }));
    };

    // Helper colors for category labels
    const getCategoryColor = (category) => {
        const cat = (category || '').toUpperCase();
        if (cat === 'VIP') return 'bg-red-100 text-red-800 border-red-200';
        if (cat === 'GUEST') return 'bg-blue-100 text-blue-800 border-blue-200';
        if (cat === 'DELEGATE') return 'bg-green-100 text-green-800 border-green-200';
        return 'bg-amber-100 text-amber-800 border-amber-200';
    };

    return (
        <div className="space-y-6">
            {/* Selector & Actions Ribbon */}
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
                        onClick={() => {
                            setEditingEvent(null);
                            setEventForm({ name: '', slug: '', description: '', eventDate: '', venue: '' });
                            setShowCreateEventModal(true);
                        }}
                    >
                        ➕ New Event
                    </Button>
                    {selectedEventId && (
                        <Button
                            variant="secondary"
                            className="text-xs px-4 py-2 hover:scale-100"
                            onClick={() => {
                                const currentEvent = events.find(e => e.id.toString() === selectedEventId);
                                if (currentEvent) handleEditEventClick(currentEvent);
                            }}
                        >
                            ✏️ Edit Event
                        </Button>
                    )}
                </div>
            </div>

            {/* Navigation Inside Module */}
            <div className="flex border-b border-gray-200 gap-1 overflow-x-auto pb-px">
                {[
                    { id: 'stats', label: '📊 Dashboard & Logs' },
                    { id: 'passes', label: '👥 Passes Directory' },
                    { id: 'import', label: '📥 Bulk Import' },
                    { id: 'events', label: '📅 All Events' },
                    { id: 'scanners', label: '📱 Scanner Devices' }
                ].map((subTab) => (
                    <button
                        key={subTab.id}
                        onClick={() => setActiveSubTab(subTab.id)}
                        className={`px-5 py-3 font-semibold text-sm transition-all border-b-2 whitespace-nowrap ${activeSubTab === subTab.id
                                ? 'text-primary border-primary bg-primary/5 rounded-t-xl'
                                : 'text-gray-500 border-transparent hover:text-primary'
                            }`}
                    >
                        {subTab.label}
                    </button>
                ))}
            </div>

            {/* ============================================================
          TAB: DASHBOARD & LOGS
          ============================================================ */}
            {activeSubTab === 'stats' && (
                <div className="space-y-6">
                    {stats ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card className="p-5 border border-gray-100 shadow-sm hover:shadow-md">
                                <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Passes</div>
                                <div className="text-3xl font-extrabold text-slate-800 mt-1">{stats.summary.total_passes}</div>
                                <div className="text-xs text-gray-400 mt-2">Allocated invites</div>
                            </Card>

                            <Card className="p-5 border border-gray-100 shadow-sm hover:shadow-md">
                                <div className="text-green-600 text-xs font-bold uppercase tracking-wider">Checked In</div>
                                <div className="text-3xl font-extrabold text-green-600 mt-1">{stats.summary.checked_in}</div>
                                <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
                                    <div
                                        className="bg-green-500 h-full rounded-full"
                                        style={{
                                            width: `${stats.summary.total_passes > 0
                                                ? Math.round((stats.summary.checked_in / stats.summary.total_passes) * 100)
                                                : 0}%`
                                        }}
                                    />
                                </div>
                            </Card>

                            <Card className="p-5 border border-gray-100 shadow-sm hover:shadow-md">
                                <div className="text-amber-600 text-xs font-bold uppercase tracking-wider">Pending Entry</div>
                                <div className="text-3xl font-extrabold text-amber-600 mt-1">{stats.summary.pending}</div>
                                <div className="text-xs text-gray-400 mt-2">
                                    {stats.summary.total_passes > 0
                                        ? Math.round((stats.summary.pending / stats.summary.total_passes) * 100)
                                        : 0}% guests remaining
                                </div>
                            </Card>

                            <Card className="p-5 border border-gray-100 shadow-sm hover:shadow-md">
                                <div className="text-rose-600 text-xs font-bold uppercase tracking-wider">Cancelled</div>
                                <div className="text-3xl font-extrabold text-rose-600 mt-1">{stats.summary.cancelled}</div>
                                <div className="text-xs text-gray-400 mt-2">Revoked access credentials</div>
                            </Card>
                        </div>
                    ) : (
                        <div className="py-12 text-center text-gray-500">No statistical summary available. Select an event.</div>
                    )}

                    {/* Breakdown grids */}
                    {stats && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="p-5 border border-gray-100">
                                <h3 className="font-bold text-gray-800 border-b pb-3 mb-4">Category Breakdown</h3>
                                <div className="space-y-3">
                                    {stats.categories.map((cat, i) => (
                                        <div key={i} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                                            <div className="font-semibold text-gray-700 flex items-center gap-2">
                                                <span className={`w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-primary-600' : i === 1 ? 'bg-saffron-500' : 'bg-slate-400'}`}></span>
                                                {cat.category}
                                            </div>
                                            <div className="text-gray-500">
                                                <span className="font-bold text-slate-800">{cat.checked_in}</span> / {cat.total_passes} checked in
                                            </div>
                                        </div>
                                    ))}
                                    {stats.categories.length === 0 && (
                                        <div className="text-center text-gray-400 py-6">No categorised guests yet.</div>
                                    )}
                                </div>
                            </Card>

                            <Card className="p-5 border border-gray-100">
                                <h3 className="font-bold text-gray-800 border-b pb-3 mb-4">Gate Breakdown</h3>
                                <div className="space-y-3">
                                    {stats.gates.map((g, i) => (
                                        <div key={i} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                                            <div className="font-semibold text-gray-700">🚪 {g.gate}</div>
                                            <div className="font-bold text-slate-800">{g.count} checks</div>
                                        </div>
                                    ))}
                                    {stats.gates.length === 0 && (
                                        <div className="text-center text-gray-400 py-6">No check-ins registered at any gate yet.</div>
                                    )}
                                </div>
                            </Card>
                        </div>
                    )}

                    {/* Audit Logs */}
                    <Card className="p-5 border border-gray-100">
                        <div className="flex justify-between items-center border-b pb-4 mb-4">
                            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                                📋 Live Scan Audit Log
                            </h3>
                            <Button
                                variant="outline"
                                className="text-xs px-3 py-1.5 hover:scale-100"
                                onClick={loadEventData}
                            >
                                🔄 Refresh Logs
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold">
                                        <th className="p-3">Time</th>
                                        <th className="p-3">Pass/Token</th>
                                        <th className="p-3">Guest Details</th>
                                        <th className="p-3">Gate/Device</th>
                                        <th className="p-3">Method</th>
                                        <th className="p-3 text-center">Result</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50/50">
                                            <td className="p-3 text-gray-500 whitespace-nowrap">
                                                {new Date(log.scanned_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                            </td>
                                            <td className="p-3">
                                                <span className="font-mono text-xs text-gray-600 block">{log.pass_number || 'INVALID_TOKEN'}</span>
                                                <span className="text-[10px] text-gray-400 block truncate max-w-[120px]" title={log.raw_token}>
                                                    {log.raw_token}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <div className="font-semibold text-slate-800">{log.guest_name || 'N/A'}</div>
                                                <span className="text-[11px] text-gray-500">{log.category || 'N/A'}</span>
                                            </td>
                                            <td className="p-3">
                                                <div className="text-gray-700">{log.gate || 'N/A'}</div>
                                                <span className="text-xs text-gray-400">{log.scanner_name || 'Admin Manual'}</span>
                                            </td>
                                            <td className="p-3 text-xs text-gray-600">
                                                {log.action === 'SCAN' ? '📸 Camera Scan' : '🖥️ Admin Desk'}
                                            </td>
                                            <td className="p-3 text-center">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${log.result === 'SUCCESS' ? 'bg-green-100 text-green-800' :
                                                        log.result === 'ALREADY_CHECKED_IN' ? 'bg-amber-100 text-amber-800' :
                                                            'bg-red-100 text-red-800'
                                                    }`}>
                                                    {log.result}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {logs.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="text-center text-gray-400 py-8">No scan logs recorded.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}

            {/* ============================================================
          TAB: PASSES DIRECTORY
          ============================================================ */}
            {activeSubTab === 'passes' && (
                <Card className="p-5 border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center mb-6">
                        <h3 className="font-bold text-gray-800 text-lg">Passes Directory ({totalPassesCount})</h3>
                        <Button variant="primary" className="text-xs px-4 py-2 hover:scale-100" onClick={() => setShowCreatePassModal(true)}>
                            ➕ Create Single Pass
                        </Button>
                    </div>

                    {/* Search/Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Search</label>
                            <input
                                type="text"
                                placeholder="Name, Phone, Pass #"
                                value={passSearch}
                                onChange={(e) => setPassSearch(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Status Filter</label>
                            <select
                                value={passStatus}
                                onChange={(e) => setPassStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                                <option value="">All Statuses</option>
                                <option value="ISSUED">Issued (Not entered)</option>
                                <option value="CHECKED_IN">Checked In</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <Button variant="outline" className="w-full text-xs py-2 hover:scale-100" onClick={loadPassesList}>
                                🔍 Apply Filters
                            </Button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold">
                                    <th className="p-3">Pass ID</th>
                                    <th className="p-3">Guest</th>
                                    <th className="p-3">Contact</th>
                                    <th className="p-3">Category</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Activity</th>
                                    <th className="p-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {passes.map((pass) => (
                                    <tr key={pass.id} className="hover:bg-gray-50/50">
                                        <td className="p-3 font-mono text-xs text-gray-700 font-bold">{pass.pass_number}</td>
                                        <td className="p-3 font-semibold text-slate-800">{pass.guest_name}</td>
                                        <td className="p-3 text-gray-500 text-xs">
                                            <div>{pass.mobile || 'N/A'}</div>
                                            <div>{pass.email || 'N/A'}</div>
                                        </td>
                                        <td className="p-3">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getCategoryColor(pass.category)}`}>
                                                {pass.category || 'General'}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${pass.status === 'ISSUED' ? 'bg-amber-100 text-amber-800' :
                                                    pass.status === 'CHECKED_IN' ? 'bg-green-100 text-green-800' :
                                                        'bg-rose-100 text-rose-800'
                                                }`}>
                                                {pass.status}
                                            </span>
                                        </td>
                                        <td className="p-3 text-xs text-gray-500">
                                            {pass.status === 'CHECKED_IN' ? (
                                                <div>
                                                    <span>🚪 {pass.gate || 'N/A'}</span>
                                                    <span className="block text-[10px] text-gray-400">
                                                        {new Date(pass.checked_in_at).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                            ) : (
                                                '-'
                                            )}
                                        </td>
                                        <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                                            <button
                                                className="text-xs px-2.5 py-1.5 rounded-lg border hover:bg-gray-50 font-medium text-slate-700"
                                                onClick={() => setSelectedPass(pass)}
                                            >
                                                🖨️ View & Print
                                            </button>
                                            {pass.status === 'ISSUED' && (
                                                <button
                                                    className="text-xs px-2.5 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 font-medium"
                                                    onClick={() => handleManualCheckIn(pass.id)}
                                                >
                                                    🚪 Manual In
                                                </button>
                                            )}
                                            {pass.status !== 'CANCELLED' && (
                                                <button
                                                    className="text-xs px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-medium"
                                                    onClick={() => handleCancelPass(pass.id)}
                                                >
                                                    🚫 Cancel
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {passes.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="text-center text-gray-400 py-8">No passes found matching this selection.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* ============================================================
          TAB: BULK IMPORT
          ============================================================ */}
            {activeSubTab === 'import' && (
                <Card className="p-5 border border-gray-100 space-y-6">
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg">Bulk Import Guest List</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Copy rows from Excel or Google Sheets (columns: <strong>Name, Mobile, Email, Category, Notes</strong>) and paste them below.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <textarea
                            rows="8"
                            value={importText}
                            onChange={(e) => setImportText(e.target.value)}
                            placeholder="Jane Doe&#9;9876543210&#9;jane@example.com&#9;VIP&#9;VIP Guest&#10;Bob Smith&#9;9999988888&#9;bob@example.com&#9;Guest&#9;Regular entry"
                            className="w-full p-4 border border-gray-200 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
                        />

                        <div className="flex gap-2">
                            <Button variant="primary" className="text-xs py-2 px-6" onClick={handleImportParse}>
                                🔍 Parse & Validate
                            </Button>
                            {importSummary && (
                                <Button variant="secondary" className="text-xs py-2 px-6" onClick={handleImportSubmit}>
                                    📥 Import {importSummary.valid} Valid Guests
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Import Summary Counters */}
                    {importSummary && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl border">
                            <div>
                                <div className="text-gray-500 text-xs font-bold uppercase">Total Parsed</div>
                                <div className="text-2xl font-bold text-slate-800 mt-1">{importSummary.total}</div>
                            </div>
                            <div>
                                <div className="text-green-600 text-xs font-bold uppercase">Valid (Ready)</div>
                                <div className="text-2xl font-bold text-green-600 mt-1">{importSummary.valid}</div>
                            </div>
                            <div>
                                <div className="text-amber-600 text-xs font-bold uppercase">Duplicate Rows</div>
                                <div className="text-2xl font-bold text-amber-600 mt-1">{importSummary.duplicates}</div>
                            </div>
                            <div>
                                <div className="text-red-600 text-xs font-bold uppercase">Invalid (Empty Name)</div>
                                <div className="text-2xl font-bold text-red-600 mt-1">{importSummary.invalid}</div>
                            </div>
                        </div>
                    )}

                    {/* Parse Preview Table */}
                    {importPreview.length > 0 && (
                        <div className="overflow-x-auto border rounded-xl">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b text-gray-500 font-bold">
                                        <th className="p-3">Guest Name</th>
                                        <th className="p-3">Mobile</th>
                                        <th className="p-3">Email</th>
                                        <th className="p-3">Category</th>
                                        <th className="p-3">Notes</th>
                                        <th className="p-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {importPreview.map((row, idx) => (
                                        <tr key={idx} className={`hover:bg-gray-50/50 ${!row.isValid ? 'bg-red-50/30' : row.isDuplicate ? 'bg-amber-50/30' : ''}`}>
                                            <td className="p-3 font-semibold text-slate-800">
                                                {row.guestName || <em className="text-red-400">Empty Guest Name</em>}
                                            </td>
                                            <td className="p-3 text-gray-600">{row.mobile}</td>
                                            <td className="p-3 text-gray-600">{row.email}</td>
                                            <td className="p-3 text-gray-600">{row.category}</td>
                                            <td className="p-3 text-gray-500 text-xs">{row.notes}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${!row.isValid ? 'bg-red-100 text-red-800' :
                                                        row.isDuplicate ? 'bg-amber-100 text-amber-800' :
                                                            'bg-green-100 text-green-800'
                                                    }`}>
                                                    {!row.isValid ? 'INVALID' : row.isDuplicate ? 'DUPLICATE' : 'OK'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            )}

            {/* ============================================================
          TAB: ALL EVENTS
          ============================================================ */}
            {activeSubTab === 'events' && (
                <Card className="p-5 border border-gray-100">
                    <div className="flex justify-between items-center border-b pb-4 mb-4">
                        <h3 className="font-bold text-gray-800 text-lg">All Physical Events</h3>
                        <Button
                            variant="primary"
                            className="text-xs px-4 py-2 hover:scale-100"
                            onClick={() => {
                                setEditingEvent(null);
                                setEventForm({ name: '', slug: '', description: '', eventDate: '', venue: '' });
                                setShowCreateEventModal(true);
                            }}
                        >
                            ➕ Create Event
                        </Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold">
                                    <th className="p-3">Event Name</th>
                                    <th className="p-3">Slug</th>
                                    <th className="p-3">Date</th>
                                    <th className="p-3">Venue</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {events.map((evt) => (
                                    <tr key={evt.id} className="hover:bg-gray-50/50">
                                        <td className="p-3 font-semibold text-slate-800">{evt.name}</td>
                                        <td className="p-3 font-mono text-xs text-gray-500">{evt.slug}</td>
                                        <td className="p-3 text-gray-600">
                                            {evt.event_date ? new Date(evt.event_date).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="p-3 text-gray-600 text-xs">{evt.venue || 'N/A'}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${evt.status === 'active' ? 'bg-green-100 text-green-800' :
                                                    evt.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {evt.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                                            <button
                                                className="text-xs px-2.5 py-1 rounded-lg border hover:bg-gray-50 text-slate-700"
                                                onClick={() => handleEditEventClick(evt)}
                                            >
                                                Edit Details
                                            </button>
                                            {evt.status === 'draft' && (
                                                <button
                                                    className="text-xs px-2.5 py-1 rounded-lg bg-green-50 hover:bg-green-100 text-green-700"
                                                    onClick={() => handleToggleEventStatus(evt, 'active')}
                                                >
                                                    Activate
                                                </button>
                                            )}
                                            {evt.status === 'active' && (
                                                <button
                                                    className="text-xs px-2.5 py-1 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700"
                                                    onClick={() => handleToggleEventStatus(evt, 'completed')}
                                                >
                                                    Mark Completed
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* ============================================================
          TAB: SCANNER DEVICES
          ============================================================ */}
            {activeSubTab === 'scanners' && (
                <Card className="p-5 border border-gray-100">
                    <div className="flex justify-between items-center border-b pb-4 mb-4">
                        <h3 className="font-bold text-gray-800 text-lg">Scanner Devices</h3>
                        <Button
                            variant="primary"
                            className="text-xs px-4 py-2 hover:scale-100"
                            onClick={() => {
                                setGeneratedScannerPassword('');
                                setNewScanner({
                                    name: '',
                                    deviceCode: '',
                                    password: '',
                                    eventId: selectedEventId,
                                    gate: 'Main Gate'
                                });
                                setShowCreateScannerModal(true);
                            }}
                        >
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
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${sc.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {sc.is_active ? 'ACTIVE' : 'DISABLED'}
                                            </span>
                                        </td>
                                        <td className="p-3 text-gray-500 text-xs">
                                            {sc.last_seen_at ? new Date(sc.last_seen_at).toLocaleString() : 'Never logged in'}
                                        </td>
                                        <td className="p-3 text-right">
                                            <button
                                                className={`text-xs px-2.5 py-1.5 rounded-lg font-semibold ${sc.is_active
                                                        ? 'bg-red-50 text-red-700 hover:bg-red-100'
                                                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                                                    }`}
                                                onClick={() => handleToggleScannerActive(sc.id, sc.is_active)}
                                            >
                                                {sc.is_active ? '🔴 Disable' : '🟢 Enable'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {scanners.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="text-center text-gray-400 py-8">No scanner devices registered.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* ============================================================
          MODAL: CREATE SINGLE PASS
          ============================================================ */}
            {showCreatePassModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fade-in border border-gray-100">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Issue Single Entry Pass</h3>
                        <form onSubmit={handleCreatePassSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 block mb-1">Guest Full Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={newPass.guestName}
                                    onChange={(e) => setNewPass({ ...newPass, guestName: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                                    placeholder="e.g. Jane Doe"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Mobile Number</label>
                                    <input
                                        type="text"
                                        value={newPass.mobile}
                                        onChange={(e) => setNewPass({ ...newPass, mobile: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                                        placeholder="e.g. +919999988888"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={newPass.email}
                                        onChange={(e) => setNewPass({ ...newPass, email: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                                        placeholder="e.g. jane@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 block mb-1">Pass Category</label>
                                <select
                                    value={newPass.category}
                                    onChange={(e) => setNewPass({ ...newPass, category: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                                >
                                    <option value="General">General</option>
                                    <option value="VIP">VIP</option>
                                    <option value="Guest">Guest</option>
                                    <option value="Delegate">Delegate</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 block mb-1">Internal Notes</label>
                                <textarea
                                    value={newPass.notes}
                                    onChange={(e) => setNewPass({ ...newPass, notes: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                                    rows="2"
                                    placeholder="e.g. Stage VIP seating"
                                />
                            </div>

                            <div className="flex gap-2 justify-end pt-2">
                                <button
                                    type="button"
                                    className="text-xs px-4 py-2 border rounded-lg hover:bg-gray-50 font-semibold text-gray-600"
                                    onClick={() => setShowCreatePassModal(false)}
                                >
                                    Cancel
                                </button>
                                <Button type="submit" variant="primary" className="text-xs py-2 px-5 hover:scale-100">
                                    Issue Pass
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ============================================================
          MODAL: VIEW & PRINT PASS (PRINT PREVIEW)
          ============================================================ */}
            {selectedPass && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-center animate-scale-up">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Pass Ticket Preview</h3>

                        {/* Cutout Pass Card */}
                        <div className="border-2 border-dashed border-primary/50 rounded-2xl p-6 bg-gradient-to-b from-white to-gray-50/50 shadow-inner">
                            <div className="text-primary font-extrabold text-sm tracking-wider">SWADHYAY SEVA SANSTHAN</div>
                            <div className="text-saffron-600 font-bold text-[10px] tracking-widest uppercase">Official Entry Pass</div>

                            <div className="font-extrabold text-slate-800 text-base mt-4 border-b border-gray-100 pb-2 truncate" title={selectedPass.event_name}>
                                {selectedPass.event_name || 'Event Pass'}
                            </div>

                            {/* QR Code */}
                            <div className="my-5 bg-white border border-gray-100 p-4 rounded-xl inline-block shadow-sm">
                                <img
                                    className="w-48 h-48 mx-auto"
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${selectedPass.qr_token}`}
                                    alt="QR Code"
                                />
                            </div>

                            <div className="font-bold text-slate-800 text-lg">{selectedPass.guest_name}</div>
                            <div className="font-mono text-xs text-gray-500 mt-1 bg-gray-100 px-3 py-1 rounded-md inline-block">
                                {selectedPass.pass_number}
                            </div>

                            <div className="mt-2">
                                <span className={`px-3 py-0.5 rounded-full text-[11px] font-bold border uppercase ${getCategoryColor(selectedPass.category)}`}>
                                    {selectedPass.category || 'General'}
                                </span>
                            </div>

                            <div className="text-[10px] text-gray-400 mt-4 border-t border-dashed pt-4">
                                Please present this QR code at the entry gate.
                            </div>
                        </div>

                        {/* Status Information */}
                        <div className="bg-gray-50 border p-3 rounded-xl mt-4 text-left text-xs space-y-1 text-gray-600">
                            <div><strong>Status:</strong> {selectedPass.status}</div>
                            {selectedPass.status === 'CHECKED_IN' && (
                                <>
                                    <div><strong>Checked In:</strong> {new Date(selectedPass.checked_in_at).toLocaleString()}</div>
                                    <div><strong>Gate:</strong> {selectedPass.gate || 'N/A'}</div>
                                </>
                            )}
                            {selectedPass.notes && <div><strong>Notes:</strong> {selectedPass.notes}</div>}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 justify-center mt-5">
                            <button
                                type="button"
                                className="text-xs px-4 py-2 border rounded-lg hover:bg-gray-50 font-semibold text-gray-600"
                                onClick={() => setSelectedPass(null)}
                            >
                                Close
                            </button>
                            {selectedPass.status === 'ISSUED' && (
                                <Button
                                    variant="secondary"
                                    className="text-xs py-2 px-4 hover:scale-100"
                                    onClick={() => handleManualCheckIn(selectedPass.id)}
                                >
                                    🚪 Check In Manually
                                </Button>
                            )}
                            {selectedPass.status !== 'CANCELLED' && (
                                <Button
                                    variant="primary"
                                    className="text-xs py-2 px-4 hover:scale-100"
                                    onClick={() => handlePrint(selectedPass)}
                                >
                                    🖨️ Print Ticket
                                </Button>
                            )}
                            <button
                                type="button"
                                className="text-xs px-4 py-2 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold"
                                onClick={() => handleReissuePass(selectedPass.id)}
                            >
                                🔄 Reissue New QR
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================
          MODAL: CREATE/EDIT EVENT
          ============================================================ */}
            {showCreateEventModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-fade-in">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">
                            {editingEvent ? 'Edit Event Details' : 'Create New Event'}
                        </h3>
                        <form onSubmit={handleSaveEvent} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 block mb-1">Event Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={eventForm.name}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        const slugVal = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                                        setEventForm({
                                            ...eventForm,
                                            name: val,
                                            slug: editingEvent ? eventForm.slug : slugVal // auto-derive slug only for new events
                                        });
                                    }}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                                    placeholder="e.g. SNEPC Annual Exhibition 2026"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 block mb-1">Unique URL Slug *</label>
                                <input
                                    type="text"
                                    required
                                    value={eventForm.slug}
                                    onChange={(e) => setEventForm({ ...eventForm, slug: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm font-mono"
                                    placeholder="e.g. snepc-2026"
                                    disabled={!!editingEvent} // slug immutable for safety
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 block mb-1">Event Date</label>
                                <input
                                    type="date"
                                    value={eventForm.eventDate}
                                    onChange={(e) => setEventForm({ ...eventForm, eventDate: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 block mb-1">Venue / Physical Location</label>
                                <input
                                    type="text"
                                    value={eventForm.venue}
                                    onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                                    placeholder="e.g. Exhibition Hall, Swadhyay Ashram"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 block mb-1">Description</label>
                                <textarea
                                    value={eventForm.description}
                                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                                    rows="3"
                                    placeholder="Details and scheduling details..."
                                />
                            </div>

                            <div className="flex gap-2 justify-end pt-2">
                                <button
                                    type="button"
                                    className="text-xs px-4 py-2 border rounded-lg hover:bg-gray-50 font-semibold text-gray-600"
                                    onClick={() => setShowCreateEventModal(false)}
                                >
                                    Cancel
                                </button>
                                <Button type="submit" variant="primary" className="text-xs py-2 px-5 hover:scale-100">
                                    {editingEvent ? 'Save Changes' : 'Create Event'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ============================================================
          MODAL: REGISTER SCANNER DEVICE
          ============================================================ */}
            {showCreateScannerModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-fade-in">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Register Scanner Device</h3>
                        <form onSubmit={handleCreateScanner} className="space-y-4">
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
                                    onChange={(e) => setNewScanner({ ...newScanner, deviceCode: e.target.value.toUpperCase().replace(/\s+/g, '-') })}
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
                                        onClick={handleGenerateScannerPassword}
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
                                            <option key={evt.id} value={evt.id}>{evt.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-2 justify-end pt-2">
                                <button
                                    type="button"
                                    className="text-xs px-4 py-2 border rounded-lg hover:bg-gray-50 font-semibold text-gray-600"
                                    onClick={() => setShowCreateScannerModal(false)}
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
        </div>
    );
};

export default EventPassAdminTab;
