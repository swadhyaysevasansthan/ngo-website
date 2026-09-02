import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { eventPassAPI } from '../../utils/api';
import Card from '../Card';
import Button from '../Button';
import PassDetail from './PassDetail';
import { getCategoryColor, downloadPassAsImage, downloadCsv } from './eventPassHelpers';
import ngoLogo from '../../assets/ngo-logo.png';

const PassList = ({ selectedEventId, events, onStatsRefreshNeeded }) => {
  const [passes, setPasses] = useState([]);
  const [passSearch, setPassSearch] = useState('');
  const [passStatus, setPassStatus] = useState('');
  const [passLimit, setPassLimit] = useState(50);
  const [passOffset, setPassOffset] = useState(0);
  const [totalPassesCount, setTotalPassesCount] = useState(0);
  const [selectedPass, setSelectedPass] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPassIds, setSelectedPassIds] = useState([]);
  const [quickPassNum, setQuickPassNum] = useState('');
  const [downloadingDirectory, setDownloadingDirectory] = useState(false);
  const [newPass, setNewPass] = useState({
    guestName: '',
    mobile: '',
    email: '',
    category: 'General',
    notes: '',
  });

  const loadPasses = useCallback(async () => {
    if (!selectedEventId) return;
    try {
      const res = await eventPassAPI.listPasses({
        eventId: selectedEventId,
        status: passStatus,
        search: passSearch,
        limit: passLimit,
        offset: passOffset,
      });
      if (res.data.success) {
        setPasses(res.data.passes);
        setTotalPassesCount(res.data.totalCount);
      }
    } catch {
      toast.error('Failed to retrieve passes list');
    }
  }, [selectedEventId, passStatus, passSearch, passLimit, passOffset]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPassOffset(0);
  }, [passSearch, passStatus, selectedEventId]);

  useEffect(() => {
    loadPasses();
  }, [loadPasses]);

  // Reset selection when passes list changes
  useEffect(() => {
    setSelectedPassIds([]);
  }, [passes]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await eventPassAPI.createPass({
        ...newPass,
        eventId: parseInt(selectedEventId),
      });
      if (res.data.success) {
        toast.success('Pass issued successfully');
        setShowCreateModal(false);
        setNewPass({ guestName: '', mobile: '', email: '', category: 'General', notes: '' });
        loadPasses();
        onStatsRefreshNeeded?.();
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
        loadPasses();
        onStatsRefreshNeeded?.();
        if (selectedPass?.id === passId) setSelectedPass(res.data.pass);
      }
    } catch {
      toast.error('Failed to cancel pass');
    }
  };

  const handleDeletePass = async (passId) => {
    if (!window.confirm('Are you sure you want to PERMANENTLY delete this pass? This will also delete any associated scan logs. This action is irreversible.')) return;
    try {
      const res = await eventPassAPI.deletePass(passId);
      if (res.data.success) {
        toast.success('Pass permanently deleted');
        loadPasses();
        onStatsRefreshNeeded?.();
        if (selectedPass?.id === passId) setSelectedPass(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete pass');
    }
  };

  const handleDeletePassesBulk = async () => {
    if (selectedPassIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to PERMANENTLY delete the ${selectedPassIds.length} selected passes? This will also delete any associated scan logs. This action is irreversible.`)) return;
    try {
      const res = await eventPassAPI.deletePassesBulk(selectedPassIds);
      if (res.data.success) {
        toast.success(res.data.message || `Successfully deleted ${selectedPassIds.length} passes`);
        setSelectedPassIds([]);
        loadPasses();
        onStatsRefreshNeeded?.();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed bulk delete passes');
    }
  };

  const handleManualCheckIn = async (passId) => {
    if (!window.confirm('Check in this guest manually?')) return;
    try {
      const res = await eventPassAPI.manualCheckIn({ passId, gate: 'Admin Desk' });
      if (res.data.success) {
        toast.success('Guest checked in successfully!');
        loadPasses();
        onStatsRefreshNeeded?.();
        if (selectedPass?.id === passId) setSelectedPass((p) => ({ ...p, status: 'CHECKED_IN' }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed manual check-in');
    }
  };

  const handleQuickCheckIn = async (e) => {
    e.preventDefault();
    if (!quickPassNum.trim()) return;
    try {
      // Find the pass by searching exact pass number
      const res = await eventPassAPI.listPasses({
        eventId: selectedEventId,
        search: quickPassNum.trim(),
        limit: 1,
      });
      if (res.data.success && res.data.passes.length > 0) {
        const foundPass = res.data.passes[0];
        if (foundPass.pass_number.toLowerCase() === quickPassNum.trim().toLowerCase()) {
          if (foundPass.status === 'CHECKED_IN') {
            toast.warning(`Guest "${foundPass.guest_name}" is already checked in.`);
            return;
          }
          if (foundPass.status === 'CANCELLED') {
            toast.error(`Pass "${foundPass.pass_number}" is cancelled.`);
            return;
          }
          const checkinRes = await eventPassAPI.manualCheckIn({
            passId: foundPass.id,
            gate: 'Admin Desk',
          });
          if (checkinRes.data.success) {
            toast.success(`Checked in ${foundPass.guest_name} successfully!`);
            setQuickPassNum('');
            loadPasses();
            onStatsRefreshNeeded?.();
          }
        } else {
          toast.error(`No exact match found for Pass ID "${quickPassNum}"`);
        }
      } else {
        toast.error(`Pass ID "${quickPassNum}" not found.`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed quick check-in');
    }
  };

  const handleToggleSelect = (passId) => {
    setSelectedPassIds((prev) =>
      prev.includes(passId) ? prev.filter((id) => id !== passId) : [...prev, passId]
    );
  };

  const handleToggleSelectAll = () => {
    const activePasses = passes.filter((p) => p.status !== 'CANCELLED');
    if (selectedPassIds.length === activePasses.length && activePasses.length > 0) {
      setSelectedPassIds([]);
    } else {
      setSelectedPassIds(activePasses.map((p) => p.id));
    }
  };

  const handlePrintBulk = () => {
    const selectedPassObjs = passes.filter((p) => selectedPassIds.includes(p.id));
    if (selectedPassObjs.length === 0) {
      toast.warning('No passes selected for printing');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Pop-up blocked! Please allow pop-ups to print passes.');
      return;
    }

    const displayName = currentEventName || 'Swadhyay Event';
    const logoUrl = window.location.origin + ngoLogo;

    let passesHtml = '';
    selectedPassObjs.forEach((pass, index) => {
      passesHtml += `
        <div class="pass-card">
          <img class="logo" src="${logoUrl}" alt="Swadhyay Logo" />
          <div class="org-title">SWADHYAY SEVA FOUNDATION</div>
          <div class="pass-label">OFFICIAL ENTRY PASS</div>
          <div class="event-title">${displayName}</div>
          <img class="qr-code" src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${pass.qr_token}" alt="Pass QR" />
          <div class="guest-name">${pass.guest_name}</div>
          <div class="pass-num">${pass.pass_number}</div>
          <div><div class="cat-badge cat-${(pass.category || '').toUpperCase()}">${pass.category || 'General'}</div></div>
          <div class="note">Please present this QR code at the entry gate.</div>
        </div>
        ${index < selectedPassObjs.length - 1 ? '<div class="page-break"></div>' : ''}
      `;
    });

    printWindow.document.write(`
      <html>
        <head>
          <title>Bulk Print Passes - ${selectedPassObjs.length} Tickets</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              margin: 0;
              padding: 0;
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
              margin: 40px auto;
              page-break-inside: avoid;
            }
            .logo {
              width: 50px;
              height: 50px;
              object-fit: contain;
              margin: 0 auto 10px auto;
              display: block;
              border-radius: 50%;
              border: 1px solid #e2e8f0;
              padding: 2px;
              background: #fff;
            }
            .org-title { color: #1b4d3e; font-size: 15px; font-weight: 800; margin-bottom: 2px; letter-spacing: 1px; }
            .pass-label { color: #d97706; font-size: 11px; font-weight: 700; margin-bottom: 15px; letter-spacing: 0.5px; }
            .event-title { font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; }
            .qr-code { margin: 15px auto; width: 180px; height: 180px; border: 1px solid #f1f5f9; padding: 8px; border-radius: 8px; }
            .guest-name { font-size: 18px; font-weight: 700; color: #1e293b; margin: 12px 0 4px 0; }
            .pass-num { font-family: monospace; font-size: 13px; color: #64748b; background: #f8fafc; padding: 4px 10px; border-radius: 6px; display: inline-block; margin-bottom: 10px; }
            .cat-badge { font-size: 11px; font-weight: bold; color: #fff; background-color: #d97706; padding: 4px 14px; border-radius: 9999px; display: inline-block; margin-bottom: 15px; text-transform: uppercase; }
            .cat-VIP { background-color: #dc2626; }
            .cat-PATRON { background-color: #db2777; }
            .cat-GUEST { background-color: #2563eb; }
            .cat-DELEGATE { background-color: #16a34a; }
            .cat-ORGANISER, .cat-ORGANIZER { background-color: #7c3aed; }
            .note { font-size: 11px; color: #94a3b8; margin-top: 10px; border-top: 1px dashed #e2e8f0; padding-top: 10px; }
            
            @media print {
              body {
                background: none;
              }
              .pass-card {
                margin: 0 auto;
                box-shadow: none;
                height: 95vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                border: 3px dashed #1b4d3e;
              }
              .page-break {
                page-break-after: always;
                break-after: page;
              }
            }
          </style>
        </head>
        <body>
          ${passesHtml}
          <script>
            window.onload = function() { window.print(); setTimeout(function() { window.close(); }, 500); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownloadBulk = async () => {
    const selectedPassObjs = passes.filter((p) => selectedPassIds.includes(p.id));
    if (selectedPassObjs.length === 0) {
      toast.warning('No passes selected for downloading');
      return;
    }

    toast.info(`Generating and downloading ${selectedPassObjs.length} pass images...`);

    for (let i = 0; i < selectedPassObjs.length; i++) {
      const pass = selectedPassObjs[i];
      try {
        await downloadPassAsImage(pass, currentEventName);
        if (i < selectedPassObjs.length - 1) {
          // Wait 300ms before triggering the next download to prevent browser blockages
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      } catch (err) {
        console.error(err);
        toast.error(`Failed to download image for ${pass.guest_name}`);
      }
    }
    toast.success('Finished triggering downloads!');
  };

  // Called by PassDetail when pass state changes (reissue / manual check-in from modal)
  const handlePassUpdated = (updatedPass) => {
    setSelectedPass(updatedPass);
    loadPasses();
    onStatsRefreshNeeded?.();
  };

  // Downloads the Passes Directory as CSV: Pass ID, Guest Name, Category,
  // Status. Honours whatever Status Filter / Search is currently applied
  // in the toolbar above, and fetches the FULL matching set — not just
  // the current page — so the export isn't truncated to `passLimit`.
  const handleDownloadDirectory = async () => {
    if (!selectedEventId) return;
    setDownloadingDirectory(true);
    try {
      const res = await eventPassAPI.listPasses({
        eventId: selectedEventId,
        status: passStatus,
        search: passSearch,
        limit: 100000,
        offset: 0,
      });
      const allPasses = res.data.success ? res.data.passes : [];

      if (!allPasses || allPasses.length === 0) {
        toast.info('No passes match the current filters');
        return;
      }

      const header = ['Pass ID', 'Guest Name', 'Category', 'Status'];
      const rows = allPasses.map((p) => [
        p.pass_number,
        p.guest_name,
        p.category || 'General',
        p.status,
      ]);
      const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
      const statusPart = passStatus ? `-${passStatus.toLowerCase()}` : '';
      downloadCsv(`passes-directory-event-${selectedEventId}${statusPart}-${stamp}.csv`, header, rows);
      toast.success(`Downloaded ${allPasses.length} pass${allPasses.length === 1 ? '' : 'es'}`);
    } catch {
      toast.error('Failed to download passes directory');
    } finally {
      setDownloadingDirectory(false);
    }
  };

  const currentEventName = events?.find((e) => e.id.toString() === selectedEventId)?.name;
  const activePasses = passes.filter((p) => p.status !== 'CANCELLED');

  return (
    <>
      <Card className="p-5 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center mb-6">
          <h3 className="font-bold text-gray-800 text-lg">Passes Directory ({totalPassesCount})</h3>
          <div className="flex gap-2">
            {selectedPassIds.length > 0 && (
              <>
                <Button
                  variant="secondary"
                  className="text-xs px-4 py-2 hover:scale-100 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg"
                  onClick={handleDownloadBulk}
                >
                  💾 Download Images ({selectedPassIds.length})
                </Button>
                <Button
                  variant="secondary"
                  className="text-xs px-4 py-2 hover:scale-100"
                  onClick={handlePrintBulk}
                >
                  🖨️ Print Selected ({selectedPassIds.length})
                </Button>
                <Button
                  className="text-xs px-4 py-2 hover:scale-100 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg"
                  onClick={handleDeletePassesBulk}
                >
                  🗑️ Delete Selected ({selectedPassIds.length})
                </Button>
              </>
            )}
            <Button
              variant="outline"
              className="text-xs px-4 py-2 hover:scale-100 flex items-center gap-1.5"
              onClick={handleDownloadDirectory}
              disabled={downloadingDirectory}
              title="Downloads all passes matching the Status Filter / Search above, not just the current page"
            >
              {downloadingDirectory ? 'Preparing…' : '⬇️ Download List'}
            </Button>
            <Button
              variant="primary"
              className="text-xs px-4 py-2 hover:scale-100"
              onClick={() => setShowCreateModal(true)}
            >
              ➕ Create Single Pass
            </Button>
          </div>
        </div>

        {/* Search/Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
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
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Quick Check-in</label>
            <form onSubmit={handleQuickCheckIn} className="flex gap-2">
              <input
                type="text"
                placeholder="Pass ID"
                value={quickPassNum}
                onChange={(e) => setQuickPassNum(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary uppercase"
              />
              <Button type="submit" variant="primary" className="text-xs px-3 hover:scale-100">
                In
              </Button>
            </form>
          </div>
          <div className="flex items-end">
            <Button variant="outline" className="w-full text-xs py-2 hover:scale-100" onClick={loadPasses}>
              🔍 Apply Filters
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold">
                <th className="p-3 w-10">
                  <input
                    type="checkbox"
                    checked={activePasses.length > 0 && selectedPassIds.length === activePasses.length}
                    onChange={handleToggleSelectAll}
                    className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                  />
                </th>
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
                  <td className="p-3 w-10">
                    {pass.status !== 'CANCELLED' ? (
                      <input
                        type="checkbox"
                        checked={selectedPassIds.includes(pass.id)}
                        onChange={() => handleToggleSelect(pass.id)}
                        className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                      />
                    ) : null}
                  </td>
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
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        pass.status === 'ISSUED'
                          ? 'bg-amber-100 text-amber-800'
                          : pass.status === 'CHECKED_IN'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
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
                    <button
                      className="text-xs px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium"
                      onClick={() => handleDeletePass(pass.id)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
              {passes.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-gray-400 py-8">
                    No passes found matching this selection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPassesCount > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>
                Showing{' '}
                <span className="font-semibold text-gray-700">{passOffset + 1}</span>
                {' '}–{' '}
                <span className="font-semibold text-gray-700">{Math.min(passOffset + passLimit, totalPassesCount)}</span>
                {' '}of{' '}
                <span className="font-semibold text-gray-700">{totalPassesCount}</span>
                {' '}passes
              </span>
              <select
                value={passLimit}
                onChange={(e) => { setPassLimit(Number(e.target.value)); setPassOffset(0); }}
                className="ml-2 px-2 py-1 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value={25}>25 / page</option>
                <option value={50}>50 / page</option>
                <option value={100}>100 / page</option>
              </select>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPassOffset(0)}
                disabled={passOffset === 0}
                className="px-2 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                title="First page"
              >
                «
              </button>
              <button
                onClick={() => setPassOffset(Math.max(0, passOffset - passLimit))}
                disabled={passOffset === 0}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                ‹ Prev
              </button>
              {/* Page number pills */}
              {(() => {
                const totalPages = Math.ceil(totalPassesCount / passLimit);
                const currentPage = Math.floor(passOffset / passLimit);
                const pages = [];
                const maxVisible = 5;
                let startPage = Math.max(0, currentPage - Math.floor(maxVisible / 2));
                let endPage = Math.min(totalPages - 1, startPage + maxVisible - 1);
                if (endPage - startPage < maxVisible - 1) startPage = Math.max(0, endPage - maxVisible + 1);
                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => setPassOffset(i * passLimit)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                        i === currentPage
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                }
                return pages;
              })()}
              <button
                onClick={() => setPassOffset(passOffset + passLimit)}
                disabled={passOffset + passLimit >= totalPassesCount}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next ›
              </button>
              <button
                onClick={() => setPassOffset((Math.ceil(totalPassesCount / passLimit) - 1) * passLimit)}
                disabled={passOffset + passLimit >= totalPassesCount}
                className="px-2 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                title="Last page"
              >
                »
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Create Pass Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fade-in border border-gray-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Issue Single Entry Pass</h3>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
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
                <input
                  type="text"
                  list="pass-categories"
                  value={newPass.category}
                  onChange={(e) => setNewPass({ ...newPass, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                  placeholder="e.g. General, VIP, Patron..."
                />
                <datalist id="pass-categories">
                  <option value="General" />
                  <option value="VIP" />
                  <option value="Patron" />
                  <option value="Guest" />
                  <option value="Delegate" />
                  <option value="Organiser" />
                </datalist>
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
                  onClick={() => setShowCreateModal(false)}
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

      {/* Pass Detail / Print Preview Modal */}
      <PassDetail
        pass={selectedPass}
        onClose={() => setSelectedPass(null)}
        onPassUpdated={handlePassUpdated}
        onPassDeleted={(passId) => {
          setSelectedPass(null);
          loadPasses();
          onStatsRefreshNeeded?.();
        }}
        eventName={currentEventName}
      />
    </>
  );
};

export default PassList;