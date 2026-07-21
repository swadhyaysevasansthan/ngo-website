import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, GraduationCap, Briefcase, Award, Quote } from "lucide-react";

const PaintingJuryModal = ({ open, member, onClose }) => {
  return (
    <AnimatePresence>
      {open && member && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-gray-100 border border-gray-200 shadow-sm transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* Header */}
            <div className="shrink-0 bg-gradient-to-br from-orange-500 to-amber-500 px-8 pt-4 pb-4 text-white text-center">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg mb-2 bg-white/20">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='112' height='112'><rect width='100%25' height='100%25' fill='%23fbbf24'/></svg>";
                  }}
                />
              </div>
              <h3 className="text-2xl font-extrabold leading-tight">{member.name}</h3>
              <p className="text-sm font-semibold text-white/90 mt-1">{member.designation}</p>
            </div>

            {/* Body */}
            <div className="jury-modal-scroll flex-1 overflow-y-auto p-8 space-y-8">
              {member.profile && (
                <div className="flex gap-3">
                  <Quote className="w-6 h-6 text-orange-400 shrink-0" />
                  <p className="text-gray-700 leading-relaxed italic">{member.profile}</p>
                </div>
              )}

              {member.education?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">
                      Academic Proficiency
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {member.education.map((item, i) => (
                      <li key={i} className="text-sm text-gray-600 leading-relaxed pl-4 relative">
                        <span className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-orange-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {member.experience?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">
                      Teaching Experience
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {member.experience.map((item, i) => (
                      <li key={i} className="text-sm text-gray-600 leading-relaxed pl-4 relative">
                        <span className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {member.highlights?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-lg bg-amber-100 text-amber-600">
                      <Award className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">
                      Recognitions & Highlights
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {member.highlights.map((item, i) => (
                      <li key={i} className="text-sm text-gray-600 leading-relaxed pl-4 relative">
                        <span className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-amber-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>

          <style>{`
            .jury-modal-scroll {
              scrollbar-width: thin;
              scrollbar-color: #fb923c transparent;
            }
            .jury-modal-scroll::-webkit-scrollbar {
              width: 6px;
            }
            .jury-modal-scroll::-webkit-scrollbar-track {
              background: transparent;
            }
            .jury-modal-scroll::-webkit-scrollbar-thumb {
              background-color: #fdba74;
              border-radius: 9999px;
            }
            .jury-modal-scroll::-webkit-scrollbar-thumb:hover {
              background-color: #fb923c;
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaintingJuryModal;