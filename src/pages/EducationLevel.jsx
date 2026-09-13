import React, { useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function EducationLevel() {
  const navigate = useNavigate();
  const {
    setEducationLevel,
    matricCompleted,
    matricStream,
    intermediateStream,
    guidanceType,
  } = useContext(AuthContext);

  const isCareer = guidanceType === "career";

  const handleMatricClick = () => {
    setEducationLevel("matric");
    if (matricCompleted && matricStream) {
      navigate("/stream", {
        state: { reviewingMatric: true, stream: matricStream },
      });
    } else {
      navigate("/stream");
    }
  };

  const handleIntermediateClick = () => {
    setEducationLevel("intermediate");
    if (intermediateStream) {
      navigate("/intermediate-stream", {
        state: { reviewingIntermediate: true, stream: intermediateStream },
      });
    } else {
      navigate("/intermediate-stream");
    }
  };

  return (
    <div className="min-h-screen pt-8 sm:pt-10 pb-16 sm:pb-20 px-3 max-[320px]:px-2 sm:px-4 flex flex-col items-center justify-center">
      <motion.div
        className="glass-card p-10 sm:p-16 max-w-2xl w-full backdrop-blur-xl shadow-2xl career-glow text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="mb-12 sm:mb-16">
          <div className="text-6xl sm:text-7xl mb-6 sm:mb-8 mx-auto w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-[#0056d2] to-[#003a9b] rounded-3xl flex items-center justify-center shadow-2xl career-glow">
            {isCareer ? "🧭" : "📚"}
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-[#003a9b] via-[#0056d2] to-[#2f7de1] bg-clip-text text-transparent mb-4 sm:mb-6">
            {isCareer ? "Career Related Guidance" : "Your Education Journey"}
          </h1>
          <p className="text-base sm:text-xl text-[#5b5b5b] max-w-lg mx-auto leading-relaxed">
            {isCareer
              ? !matricCompleted
                ? "First tell us what you have already studied — start with Matric marks, then Intermediate."
                : "Great — now add Intermediate details. After that we ask 8 career questions and suggest top careers."
              : !matricCompleted
                ? "Start with your Matric details to unlock personalized recommendations"
                : "Great! Now choose Intermediate or continue with Matric insights"}
          </p>
        </div>

        <div
          className={`grid gap-6 sm:gap-8 w-full mx-auto ${
            matricCompleted
              ? "max-w-3xl grid-cols-1 sm:grid-cols-2 sm:items-stretch"
              : "max-w-sm grid-cols-1"
          }`}
        >
          <motion.button
            type="button"
            className="group glass-card p-8 sm:p-12 hover:bg-[#0056d2]/10 backdrop-blur-xl border-2 border-[#d9d9d9] hover:border-[#2f7de1] hover:shadow-2xl hover:shadow-[#0056d2]/20 transition-all duration-500 relative overflow-hidden w-full min-h-[220px] sm:min-h-[288px] flex flex-col items-center justify-center text-center"
            onClick={handleMatricClick}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.03, y: -8 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-5xl sm:text-6xl mb-5 group-hover:scale-110 transition-transform">
              🎓
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-3 group-hover:text-[#2f7de1] transition-colors">
              Matric
            </h3>
            <p className="text-[#5b5b5b] text-base sm:text-lg min-h-[1.75rem]">
              {!matricCompleted ? "Do this first" : "Change / check"}
            </p>
            <div className="absolute inset-0 bg-gradient-to-r from-[#0056d2]/25 to-[#378edd]/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
          </motion.button>

          {matricCompleted && (
            <motion.button
              type="button"
              className="group glass-card p-8 sm:p-12 hover:bg-[#0056d2]/10 backdrop-blur-xl border-2 border-[#d9d9d9] hover:border-[#378edd] hover:shadow-2xl hover:shadow-[#0056d2]/20 transition-all duration-500 relative overflow-hidden w-full min-h-[220px] sm:min-h-[288px] flex flex-col items-center justify-center text-center"
              onClick={handleIntermediateClick}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.03, y: -8 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-5xl sm:text-6xl mb-5 group-hover:scale-110 transition-transform">
                🏆
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-3 group-hover:text-[#9ec5ff] transition-colors">
                Intermediate
              </h3>
              <p className="text-[#5b5b5b] text-base sm:text-lg min-h-[1.75rem]">
                {isCareer ? "Required for career match" : "After Matric (FSc etc.)"}
              </p>
              <div className="absolute inset-0 bg-gradient-to-r from-[#2f7de1]/25 to-[#0056d2]/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
            </motion.button>
          )}
        </div>

        {!matricCompleted ? (
          <motion.p
            className="mt-12 sm:mt-16 text-base sm:text-lg text-[#6a6a6a] max-w-lg text-center bg-yellow-500/20 p-4 rounded-2xl border border-yellow-400/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {isCareer
              ? "Career guidance needs Matric + Intermediate marks, then 8 career questions."
              : "Complete Matric subjects first to unlock Intermediate options"}
          </motion.p>
        ) : (
          <motion.p
            className="mt-12 sm:mt-16 text-base sm:text-lg text-[#6a6a6a] max-w-lg text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {isCareer
              ? "Next: Intermediate marks → career questions → top career suggestions."
              : "Next: add Intermediate marks, then the short skills page."}
          </motion.p>
        )}

        <motion.button
          type="button"
          className="mt-8 text-[#6a6a6a] hover:text-[#1a1a1a] text-sm transition-colors"
          onClick={() => navigate("/guidance")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          ← Back to guidance options
        </motion.button>
      </motion.div>
    </div>
  );
}

export default EducationLevel;
