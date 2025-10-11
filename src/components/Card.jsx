import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className={`bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;
