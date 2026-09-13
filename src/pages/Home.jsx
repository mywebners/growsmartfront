import React, { useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getHistoryItems } from "../utils/historyStorage";
import { AuthContext } from "../context/AuthContext";

function Home() {

const navigate = useNavigate();
  const { resetAssessment } = useContext(AuthContext);

  const userData = localStorage.getItem("user");
  let user = userData || null;

  if (userData && userData.startsWith("{")) {
    try {
      const parsedUser = JSON.parse(userData);
      user = parsedUser?.firstName || parsedUser?.name || userData;
    } catch (e) {
      console.error("Invalid user data in localStorage:", e);
    }
  }

  const handleStart = () => {
    if (!user) {
      alert("Please login first to start test");
      navigate("/login");
      return;
    }

    resetAssessment();
    navigate("/guidance", { replace: true });
  };

  const hasHistory = user ? getHistoryItems(user).length > 0 : false;

  return (
    <div className="min-h-screen pt-24 sm:pt-28 md:pt-36 pb-12 sm:pb-14 px-3 max-[320px]:px-2 sm:px-4 md:px-6 flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="glass-card px-6 py-10 md:p-12 max-w-4xl mx-auto w-full backdrop-blur-xl shadow-2xl career-glow"
      >
        <motion.h1 
          className="text-4xl md:text-6xl font-bold text-career-gradient mb-6 md:mb-8"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
        >
          GrowSmart AI
        </motion.h1>
        
        {user ? (
          <motion.h2 
            className="text-2xl md:text-3xl font-semibold text-white/90 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Hi, {user}
          </motion.h2>
        ) : (
          <motion.p 
            className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Log in to save your test and see your career ideas
          </motion.p>
        )}

        <motion.p 
          className="text-base md:text-lg text-white/70 mb-10 md:mb-12 max-w-xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Answer a few questions about school and skills. We suggest study paths, careers, and more that may fit you.
        </motion.p>

        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <button 
                className="btn-career text-base md:text-lg px-8 md:px-12 py-4 md:py-5 shadow-2xl career-glow hover:shadow-blue-500/50"
                onClick={handleStart}
              >
                Start guidance
              </button>
            </motion.div>
          )}
          {!user && (
            <motion.button
              className="text-xl px-10 py-4 glass-card hover:bg-white/20 transition-all backdrop-blur-xl"
              onClick={() => navigate('/login')}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              Login to Begin
            </motion.button>
          )}
          {user && hasHistory && (
            <motion.button
              className="text-base md:text-lg px-8 py-4 glass-card hover:bg-white/20 transition-all backdrop-blur-xl"
              onClick={() => navigate('/history')}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.72 }}
            >
              View History
            </motion.button>
          )}
        </div>
      </motion.div>

      <motion.div
        className="mt-14 md:mt-16 text-sm text-white/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        GrowSmart career helper
      </motion.div>
    </div>
  );
}

export default Home;