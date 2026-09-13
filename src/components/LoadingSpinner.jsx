import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-10 bg-[#f5f7fb]/96 backdrop-blur-md">
      <div className="loader-3d" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <motion.div
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse" }}
        className="text-base md:text-lg tracking-[0.14em] uppercase text-[#0056d2] font-semibold"
      >
        Loading GrowSmart
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;
