import React, { useContext } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar() {

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="glass-card backdrop-blur-xl fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 w-[min(94vw,calc(100vw-0.75rem))] max-w-5xl z-20 px-2.5 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 shadow-2xl career-glow">
      <div className="flex items-center justify-between gap-2 sm:gap-4 min-h-[2.5rem]">
        <motion.h1 
          className="text-lg sm:text-2xl md:text-3xl font-bold text-career-gradient hover:scale-105 transition-transform truncate min-w-0 max-[320px]:text-base"
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05, rotate: 2 }}
          whileTap={{ scale: 0.98 }}
          style={{ cursor: 'pointer' }}
        >
          GrowSmart
        </motion.h1>
        
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
          {user ? (
            <button 
              className="px-2.5 sm:px-4 md:px-6 py-1.5 sm:py-2 glass-card text-xs sm:text-sm font-medium hover:bg-white/20 transition-all whitespace-nowrap"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <>
              <button 
                className="px-2.5 sm:px-4 md:px-6 py-1.5 sm:py-2 glass-card text-xs sm:text-sm font-medium hover:bg-white/20 transition-all whitespace-nowrap"
                onClick={() => navigate('/login')}
              >
                Login
              </button>
              <button 
                className="btn-career text-xs sm:text-sm px-2.5 sm:px-4 md:px-6 py-2 sm:py-2.5 max-[380px]:!py-2 max-[380px]:!px-2"
                onClick={() => navigate('/register')}
              >
                <span className="hidden xs:inline">Get Started</span>
                <span className="xs:hidden">Start</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;