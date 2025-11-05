import React from "react";
import Card from "./Card";

const MODAL_HEIGHTS = {
  base: "h-[450px]",
  md: "md:h-[500px]",
  lg: "lg:h-[550px]"
};

const ModalCard = ({ selectedMember, onClose }) => (
  <div
    className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center"
    onClick={onClose}
  >
    <Card
      className={`
        w-full max-w-md mx-4 md:max-w-lg md:mx-8 lg:max-w-xl lg:mx-0
        ${MODAL_HEIGHTS.base} ${MODAL_HEIGHTS.md} ${MODAL_HEIGHTS.lg}
        flex flex-col items-center justify-start relative shadow-2xl
        overflow-y-auto
        border border-gray-300
        rounded-xl
        bg-white
      `}
      onClick={e => e.stopPropagation()}
    >
      <button
        className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-primary-700"
        onClick={onClose}
        aria-label="Close"
        type="button"
      >&times;</button>
      <div className="flex flex-col items-center w-full pt-4 pb-4 px-6">
        <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-green-500 to-primary-500 rounded-full overflow-hidden mx-auto mb-4 border-4 border-primary-100 flex items-center justify-center">
          <img src={selectedMember.image} alt={selectedMember.name} className="w-full h-full object-cover" />
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 text-center">{selectedMember.name}</h3>
        {selectedMember.role && (
          <p className="text-primary-600 font-medium mb-2 text-center">
            {selectedMember.role}
          </p>
        )}
        {selectedMember.description && (
          <p className="text-gray-600 text-center mb-4">{selectedMember.description}</p>
        )}
        {selectedMember.details && (
          <div className="w-full text-gray-700 text-sm mt-2">
            {selectedMember.details}
          </div>
        )}
      </div>
    </Card>
  </div>
);

export default ModalCard;
