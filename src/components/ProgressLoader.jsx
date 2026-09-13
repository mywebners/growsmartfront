import React from 'react';
import { motion } from 'framer-motion';

const ProgressLoader = ({ progress = 0, className = '' }) => {
  return (
    <div className={`w-full bg-[#e8eef8] rounded-full h-3 backdrop-blur-sm overflow-hidden border border-[#d9d9d9] ${className}`}>
      <motion.div 
        className="h-full bg-gradient-to-r from-[#0056d2] via-[#2f7de1] to-[#378edd] rounded-full shadow-lg"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  );
};

export default ProgressLoader;

