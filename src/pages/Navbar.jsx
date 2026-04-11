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
    <nav className="glass-card backdrop-blur-xl fixed top-5 left-1/2 -translate-x-1/2 w-[94vw] max-w-5xl z-20 px-4 py-3 md:px-6 md:py-4 shadow-2xl career-glow">
      <div className="flex items-center justify-between gap-4">
        <motion.h1 
          className="text-2xl md:text-3xl font-bold text-career-gradient hover:scale-105 transition-transform whitespace-nowrap"
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05, rotate: 2 }}
          whileTap={{ scale: 0.98 }}
          style={{ cursor: 'pointer' }}
        >
          GrowSmart
        </motion.h1>
        
        <div className="flex items-center gap-2 md:gap-3">
          {user ? (
            <button 
              className="px-4 md:px-6 py-2 glass-card text-sm font-medium hover:bg-white/20 transition-all"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <>
              <button 
                className="px-4 md:px-6 py-2 glass-card text-sm font-medium hover:bg-white/20 transition-all"
                onClick={() => navigate('/login')}
              >
                Login
              </button>
              <button 
                className="btn-career text-sm px-4 md:px-6 py-2.5"
                onClick={() => navigate('/register')}
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;