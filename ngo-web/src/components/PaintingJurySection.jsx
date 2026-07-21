import React from "react";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const PaintingJurySection = ({ jury, onOpen }) => {
  if (!jury || jury.length === 0) return null;

  return (
    <section className="bg-white border-t border-b border-gray-100 py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.p
            variants={fadeUp}
            className="text-sm font-semibold tracking-[0.2em] uppercase text-orange-600 mb-1"
          >
            Meet the Panel
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl font-extrabold text-gray-900 mb-2">
            Painting Competition Jury
          </motion.h2>
          <motion.p variants={fadeUp} className="text-gray-500 max-w-lg mx-auto">
            Distinguished art educators and experts who will evaluate the National
            Environmental Painting Competition entries.
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-6"
        >
          {jury.map((member, i) => (
            <motion.button
              key={member.id}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={() => onOpen(member)}
              className="w-full sm:w-[280px] bg-gray-100 hover:bg-orange-50 rounded-2xl border border-gray-300 hover:border-orange-200 shadow-sm hover:shadow-lg transition-all p-6 flex flex-col items-center text-center focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md mb-4 bg-gray-200">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='112' height='112'><rect width='100%25' height='100%25' fill='%23e5e7eb'/></svg>";
                  }}
                />
              </div>

              <h3 className="font-extrabold text-gray-900 text-lg leading-tight mb-1">
                {member.name}
              </h3>
              <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-1">
                {member.designation}
              </p>

              <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                {member.shortBio}
              </p>

              <span className="inline-flex items-center gap-1.5 mt-4 text-xs font-bold text-orange-600">
                <GraduationCap className="w-4 h-4" />
                View full profile
              </span>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PaintingJurySection;