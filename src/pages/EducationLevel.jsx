import React, { useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function EducationLevel() {
  const navigate = useNavigate();
  const { setEducationLevel, matricCompleted, matricStream, intermediateStream } = useContext(AuthContext);

  const handleMatricClick = () => {
    setEducationLevel('matric');
    if (matricCompleted && matricStream) {
      navigate("/stream", { state: { reviewingMatric: true, stream: matricStream } });
    } else {
      navigate("/stream");
    }
  };

  const handleIntermediateClick = () => {
    setEducationLevel('intermediate');
    if (intermediateStream) {
      navigate("/intermediate-stream", { state: { reviewingIntermediate: true, stream: intermediateStream } });
    } else {
      navigate("/intermediate-stream");
    }
  };

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-20 px-3 max-[320px]:px-2 sm:px-4 flex flex-col items-center justify-center">
      <motion.div
        className="glass-card p-16 max-w-2xl w-full backdrop-blur-xl shadow-2xl career-glow text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="mb-16">
          <div className="text-7xl mb-8 mx-auto w-32 h-32 bg-gradient-to-br from-violet-600 to-purple-800 rounded-3xl flex items-center justify-center shadow-2xl career-glow">
            📚
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
            Your Education Journey
          </h1>
          <p className="text-xl text-white/80 max-w-lg mx-auto leading-relaxed">
            {!matricCompleted 
              ? "Start with your Matric details to unlock personalized recommendations" 
              : "Great! Now choose Intermediate or continue with Matric insights"
            }
          </p>
        </div>

        <div
          className={`grid gap-8 w-full mx-auto ${
            matricCompleted
              ? "max-w-3xl grid-cols-1 sm:grid-cols-2 sm:items-stretch"
              : "max-w-sm grid-cols-1"
          }`}
        >
          <motion.button
            type="button"
            className="group glass-card p-10 sm:p-12 hover:bg-white/20 backdrop-blur-xl border-2 border-white/30 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 relative overflow-hidden w-full min-h-[260px] sm:min-h-[288px] flex flex-col items-center justify-center text-center"
            onClick={handleMatricClick}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.03, y: -8 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">🎓</div>
            <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">Matric</h3>
            <p className="text-white/70 text-lg min-h-[1.75rem]">{!matricCompleted ? "Do this first" : "Change / check"}</p>
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/25 to-indigo-500/25 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
          </motion.button>

          {matricCompleted && (
            <motion.button
              type="button"
              className="group glass-card p-10 sm:p-12 hover:bg-white/20 backdrop-blur-xl border-2 border-white/30 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 relative overflow-hidden w-full min-h-[260px] sm:min-h-[288px] flex flex-col items-center justify-center text-center"
              onClick={handleIntermediateClick}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.03, y: -8 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">🏆</div>
              <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">Intermediate</h3>
              <p className="text-white/70 text-lg min-h-[1.75rem]">After Matric (FSc etc.)</p>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/25 to-violet-400/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
            </motion.button>
          )}
        </div>

        {!matricCompleted ? (
          <motion.p 
            className="mt-16 text-lg text-white/60 max-w-lg text-center bg-yellow-500/20 p-4 rounded-2xl border border-yellow-400/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Complete Matric subjects first to unlock Intermediate options
          </motion.p>
        ) : (
          <motion.p 
            className="mt-16 text-lg text-white/60 max-w-lg text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Next: add Intermediate marks, then the short skills page.
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

export default EducationLevel;

