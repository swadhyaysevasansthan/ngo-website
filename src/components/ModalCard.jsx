import React from "react";

const MODAL_HEIGHTS = {
  base: "max-h-[90vh]", // Changed to max-h for better responsiveness
  md: "md:max-h-[85vh]",
  lg: "lg:max-h-[80vh]"
};

const ModalCard = ({ selectedMember, onClose }) => (
  <div
    className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <div
      className={`
        w-full max-w-lg mx-4 md:max-w-2xl lg:max-w-2xl lg:mx-0
        ${MODAL_HEIGHTS.base} ${MODAL_HEIGHTS.md} ${MODAL_HEIGHTS.lg}
        flex flex-col relative shadow-2xl
        overflow-hidden
        border border-gray-300
        rounded-xl
        bg-white
      `}
      onClick={e => e.stopPropagation()}
    >
      {/* Close Button - Outside scrollable area */}
      <button
        className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-primary-700 z-20"
        onClick={onClose}
        aria-label="Close"
        type="button"
      >
        &times;
      </button>

      {/* Scrollable Content Area */}
      <div className="overflow-y-auto flex-1 pt-4 pb-4 px-6">
        <div className="flex flex-col items-center w-full">
          {/* Profile Image */}
          <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-green-500 to-primary-500 rounded-full overflow-hidden mx-auto mb-4 border-4 border-primary-100 flex items-center justify-center">
            <img 
              src={selectedMember.image} 
              alt={selectedMember.name} 
              className="w-full h-full object-cover" 
            />
          </div>

          {/* Name */}
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 text-center">
            {selectedMember.name}
          </h3>

          {/* Role */}
          {selectedMember.role && (
            <p className="text-primary-600 font-medium mb-2 text-center">
              {selectedMember.role}
            </p>
          )}

          {/* Description */}
          {selectedMember.description && (
            <p className="text-gray-600 text-center mb-4">
              {selectedMember.description}
            </p>
          )}

          {/* Details */}
          {selectedMember.details && (
            <div className="w-full text-gray-700 text-sm mt-2">
              {selectedMember.details}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default ModalCard;
