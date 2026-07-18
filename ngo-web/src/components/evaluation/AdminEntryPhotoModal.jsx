import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { X, MapPin, Calendar, Camera, Leaf, Maximize2, Loader2, Mail, Phone } from 'lucide-react';
import { evaluationAdminAPI } from '../../utils/api';
import JudgeImageViewer from './JudgeImageViewer';

const AdminEntryPhotoModal = ({ entryId, onClose }) => {
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await evaluationAdminAPI.getEntryPhoto(entryId);
      setEntry(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load photo');
      onClose();
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entryId]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-gray-800">
            {entry ? `Entry #${entry.entryNumber} — ${entry.fullName}` : 'Loading…'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700" aria-label="Close">
            <X size={22} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : entry ? (
          <div className="p-6 space-y-5">
            <div className="relative">
              {entry.imageUrl ? (
                <img
                  src={entry.imageUrl}
                  alt={`Entry #${entry.entryNumber}`}
                  loading="eager"
                  decoding="async"
                  className="w-full max-h-[50vh] object-contain bg-gray-100 rounded-xl cursor-zoom-in"
                  onClick={() => setFullscreen(true)}
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                  Image not available
                </div>
              )}
              {entry.imageUrl && (
                <button
                  onClick={() => setFullscreen(true)}
                  className="absolute bottom-3 right-3 bg-black/60 text-white rounded-lg px-3 py-1.5 text-sm flex items-center gap-1.5 opacity-90 hover:opacity-100"
                >
                  <Maximize2 size={14} /> View fullscreen
                </button>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
              <span className="font-medium text-gray-800">{entry.fullName}</span>
              <span className="text-gray-400">{entry.participantId}</span>
              <span className="flex items-center gap-1"><Mail size={13} /> {entry.email}</span>
              <span className="flex items-center gap-1"><Phone size={13} /> {entry.phone}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-sm">
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
                <span>{entry.captureLocation || '—'}</span>
              </div>
              <div className="flex items-start gap-2 text-gray-600">
                <Calendar size={16} className="mt-0.5 shrink-0 text-primary" />
                <span>{entry.captureDate ? new Date(entry.captureDate).toLocaleDateString() : '—'}</span>
              </div>
              <div className="flex items-start gap-2 text-gray-600">
                <Camera size={16} className="mt-0.5 shrink-0 text-primary" />
                <span>{entry.cameraModel || '—'}</span>
              </div>
              <div className="flex items-start gap-2 text-gray-600 capitalize">
                <span className="font-semibold text-primary">Category:</span>
                <span>{entry.category || '—'}</span>
              </div>
            </div>

            {entry.environmentalMessage && (
              <div className="flex items-start gap-2 bg-green-50 border border-green-100 rounded-lg p-3 text-sm text-green-800">
                <Leaf size={16} className="mt-0.5 shrink-0" />
                <span>{entry.environmentalMessage}</span>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {fullscreen && entry?.imageUrl && (
        <JudgeImageViewer
          imageUrl={entry.fullImageUrl || entry.imageUrl}
          alt={`Entry #${entry.entryNumber}`}
          onClose={() => setFullscreen(false)}
        />
      )}
    </div>
  );
};

export default AdminEntryPhotoModal;