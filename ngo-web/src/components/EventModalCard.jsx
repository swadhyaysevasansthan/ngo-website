import React from "react";
import { Calendar, MapPin, Users, X } from 'lucide-react';

const EventModalCard = ({ selectedEvent, onClose }) => {
  if (!selectedEvent) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header - Sticky */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-start z-10 rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedEvent.school}
            </h2>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-primary-600" />
                <span>{selectedEvent.date}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-primary-600" />
                <span>{selectedEvent.location}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-primary-600" />
                <span>{selectedEvent.participants}</span>
              </div>
            </div>
          </div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="overflow-y-auto p-6">
          {/* Event Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              About the Event
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {selectedEvent.description}
            </p>
          </div>

          {/* Event Highlights */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Event Highlights
            </h3>
            <ul className="space-y-2">
              {selectedEvent.highlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start text-gray-600">
                  <span className="text-primary-600 mr-2 mt-1">✓</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Event Gallery */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Event Gallery
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {selectedEvent.images.map((image, idx) => (
                <div
                  key={idx}
                  className="rounded-lg overflow-hidden shadow-md"
                >
                  <img
                    src={image}
                    alt={`${selectedEvent.school} - Photo ${idx + 1}`}
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModalCard;
