import React from 'react';
import { motion } from 'framer-motion';

const ProgressLoader = ({ progress = 0, className = '' }) => {
  return (
    <div className={`w-full bg-white/10 rounded-full h-3 backdrop-blur-sm overflow-hidden border border-white/20 ${className}`}>
      <motion.div 
        className="h-full bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 rounded-full shadow-lg"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  );
};

export default ProgressLoader;

