import React from 'react';
import { motion } from 'framer-motion';

const SectionHeader = ({ title, subtitle, centered = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`mb-12 ${centered ? 'text-center' : ''}`}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      <div className={`w-24 h-1 bg-gradient-to-r from-primary-500 to-saffron-500 rounded-full mt-4 ${centered ? 'mx-auto' : ''}`}></div>
    </motion.div>
  );
};

export default SectionHeader;
    