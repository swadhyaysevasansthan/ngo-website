import React from 'react';

// 🔥 SNEAC — reject an access request, with an optional reason.
const RejectRequestModal = ({ rejectionReason, setRejectionReason, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
      <h3 className="text-xl font-bold mb-4">Reject Access Request</h3>
      <textarea
        rows="4"
        placeholder="Optional rejection reason..."
        value={rejectionReason}
        onChange={(e) => setRejectionReason(e.target.value)}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <div className="flex justify-end gap-3 mt-5">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
        >
          Reject
        </button>
      </div>
    </div>
  </div>
);

export default RejectRequestModal;