import React from 'react';
import { motion } from 'framer-motion'; // Will add later if needed, fallback GSAP

const GlassCard = ({ children, className = '', onHover, ...props }) => {
  return (
    <div className={`glass-card p-8 ${className}`} {...props}>
      <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default GlassCard;

