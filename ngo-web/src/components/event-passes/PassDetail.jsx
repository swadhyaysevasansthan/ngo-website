import React from 'react';
import { toast } from 'react-toastify';
import { eventPassAPI } from '../../utils/api';
import Button from '../Button';
import { getCategoryColor } from './eventPassHelpers';
import ngoLogo from '../../assets/ngo-logo.png';

/**
 * Print preview modal for a single pass. Also handles
 * manual check-in and QR reissue actions from this view.
 *
 * Props:
 *   pass          - the pass object to display (null = hidden)
 *   onClose       - callback to close the modal
 *   onPassUpdated - callback(updatedPass) when pass state changes
 *   eventName     - display name of the current event
 */
const PassDetail = ({ pass, onClose, onPassUpdated, onPassDeleted, eventName }) => {
  if (!pass) return null;

  const handleManualCheckIn = async () => {
    if (!window.confirm('Check in this guest manually?')) return;
    try {
      const res = await eventPassAPI.manualCheckIn({ passId: pass.id, gate: 'Admin Desk' });
      if (res.data.success) {
        toast.success('Guest checked in successfully!');
        onPassUpdated({ ...pass, status: 'CHECKED_IN' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed manual check-in');
    }
  };

  const handleReissue = async () => {
    if (!window.confirm('This will invalidate the existing QR code and issue a new one. Continue?')) return;
    try {
      const res = await eventPassAPI.reissueQR(pass.id);
      if (res.data.success) {
        toast.success('New QR pass reissued successfully');
        const updatedPass = { ...res.data.pass, event_name: pass.event_name };
        onPassUpdated(updatedPass);
      }
    } catch {
      toast.error('Failed to reissue QR pass');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to PERMANENTLY delete this pass? This will also delete any associated scan logs. This action is irreversible.')) return;
    try {
      const res = await eventPassAPI.deletePass(pass.id);
      if (res.data.success) {
        toast.success('Pass permanently deleted');
        onPassDeleted?.(pass.id);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete pass');
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Pop-up blocked! Please allow pop-ups to print passes.');
      return;
    }
    const displayName = eventName || pass.event_name || 'Swadhyay Event';
    const logoUrl = window.location.origin + ngoLogo;

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
            .cat-GUEST { background-color: #2563eb; }
            .cat-DELEGATE { background-color: #16a34a; }
            .note { font-size: 11px; color: #94a3b8; margin-top: 10px; border-top: 1px dashed #e2e8f0; padding-top: 10px; }
          </style>
        </head>
        <body>
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
          <script>
            window.onload = function() { window.print(); setTimeout(function() { window.close(); }, 500); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-center animate-scale-up">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Pass Ticket Preview</h3>

        {/* Cutout Pass Card */}
        <div className="border-2 border-dashed border-primary/50 rounded-2xl p-6 bg-gradient-to-b from-white to-gray-50/50 shadow-inner">
          <div className="flex justify-center mb-3">
            <img src={ngoLogo} alt="NGO Logo" className="w-12 h-12 object-contain rounded-full border border-gray-100 p-0.5 bg-white shadow-sm" />
          </div>
          <div className="text-primary font-extrabold text-sm tracking-wider">SWADHYAY SEVA FOUNDATION</div>
          <div className="text-saffron-600 font-bold text-[10px] tracking-widest uppercase">Official Entry Pass</div>

          <div
            className="font-extrabold text-slate-800 text-base mt-4 border-b border-gray-100 pb-2 truncate"
            title={pass.event_name}
          >
            {pass.event_name || 'Event Pass'}
          </div>

          <div className="my-5 bg-white border border-gray-100 p-4 rounded-xl inline-block shadow-sm">
            <img
              className="w-48 h-48 mx-auto"
              src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${pass.qr_token}`}
              alt="QR Code"
            />
          </div>

          <div className="font-bold text-slate-800 text-lg">{pass.guest_name}</div>
          <div className="font-mono text-xs text-gray-500 mt-1 bg-gray-100 px-3 py-1 rounded-md inline-block">
            {pass.pass_number}
          </div>

          <div className="mt-2">
            <span className={`px-3 py-0.5 rounded-full text-[11px] font-bold border uppercase ${getCategoryColor(pass.category)}`}>
              {pass.category || 'General'}
            </span>
          </div>

          <div className="text-[10px] text-gray-400 mt-4 border-t border-dashed pt-4">
            Please present this QR code at the entry gate.
          </div>
        </div>

        {/* Status Info */}
        <div className="bg-gray-50 border p-3 rounded-xl mt-4 text-left text-xs space-y-1 text-gray-600">
          <div><strong>Status:</strong> {pass.status}</div>
          {pass.status === 'CHECKED_IN' && (
            <>
              <div><strong>Checked In:</strong> {new Date(pass.checked_in_at).toLocaleString()}</div>
              <div><strong>Gate:</strong> {pass.gate || 'N/A'}</div>
            </>
          )}
          {pass.notes && <div><strong>Notes:</strong> {pass.notes}</div>}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 justify-center mt-5">
          <button
            type="button"
            className="text-xs px-4 py-2 border rounded-lg hover:bg-gray-50 font-semibold text-gray-600"
            onClick={onClose}
          >
            Close
          </button>
          {pass.status === 'ISSUED' && (
            <Button variant="secondary" className="text-xs py-2 px-4 hover:scale-100" onClick={handleManualCheckIn}>
              🚪 Check In Manually
            </Button>
          )}
          {pass.status !== 'CANCELLED' && (
            <Button variant="primary" className="text-xs py-2 px-4 hover:scale-100" onClick={handlePrint}>
              🖨️ Print Ticket
            </Button>
          )}
          <button
            type="button"
            className="text-xs px-4 py-2 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold"
            onClick={handleReissue}
          >
            🔄 Reissue New QR
          </button>
          <button
            type="button"
            className="text-xs px-4 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold"
            onClick={handleDelete}
          >
            🗑️ Delete Pass
          </button>
        </div>
      </div>
    </div>
  );
};

export default PassDetail;
