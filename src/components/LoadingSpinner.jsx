import React from 'react';
import { motion } from 'framer-motion'; // Placeholder - use GSAP later

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-10 bg-[#04070f]/95 backdrop-blur-md">
      <div className="loader-3d" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <motion.div
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse" }}
        className="text-base md:text-lg tracking-[0.14em] uppercase text-white/85 font-medium"
      >
        Loading GrowSmart
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;

