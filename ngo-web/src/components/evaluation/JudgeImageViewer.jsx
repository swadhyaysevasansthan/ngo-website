import React from 'react';
import { X } from 'lucide-react';

/**
 * Fullscreen image viewer. Clicking the backdrop or the X closes it.
 * Clicking the image itself does not close it (so pinch/scroll-zoom
 * gestures on mobile don't accidentally dismiss).
 */
const JudgeImageViewer = ({ imageUrl, alt, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
        aria-label="Close fullscreen image"
      >
        <X size={28} />
      </button>
      <img
        src={imageUrl}
        alt={alt}
        className="max-w-full max-h-full object-contain rounded-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default JudgeImageViewer;
