import React, { useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const OPTIONS = [
  {
    id: "study",
    title: "Study / Educational Guidance",
    subtitle: "Matric → Inter → Bachelor — what should you study next?",
    icon: "📚",
    path: "/study/goal",
  },
  {
    id: "career",
    title: "Career Related Guidance",
    subtitle: "Matric + Inter marks + career questions → top career matches",
    icon: "🧭",
    path: "/education",
  },
  {
    id: "jobs",
    title: "Jobs Related Guidance",
    subtitle: "Matric / Inter / Bachelor → Pakistan job portals + apply links",
    icon: "💼",
    path: "/jobs-guidance",
  },
];

function GuidanceHub() {
  const navigate = useNavigate();
  const { user, setGuidanceType, setStudyGoal, setJobsGoal, resetAssessment } = useContext(AuthContext);

  const handlePick = (opt) => {
    resetAssessment();
    setGuidanceType(opt.id);
    if (opt.id !== "study") setStudyGoal(null);
    if (opt.id !== "jobs") setJobsGoal(null);
    navigate(opt.path);
  };

  return (
    <div className="min-h-screen pt-8 sm:pt-12 pb-16 sm:pb-20 px-3 max-[320px]:px-2 sm:px-4 flex flex-col items-center">
      <motion.div
        className="glass-card p-8 sm:p-12 md:p-14 max-w-5xl w-full text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <motion.div
          className="mb-10 sm:mb-12"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="text-5xl sm:text-6xl mb-6 mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-[#eef5ff] text-[#0056d2] rounded-2xl flex items-center justify-center border border-[#d9e6fb]">
            ✨
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-career-gradient mb-4">
            What do you need help with?
          </h1>
          <p className="text-base sm:text-xl text-[#5b5b5b] max-w-2xl mx-auto leading-relaxed">
            {user ? `Hi ${user} — ` : ""}
            Pick one path. We will guide you step by step, in plain language.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {OPTIONS.map((opt, index) => (
            <motion.button
              key={opt.id}
              type="button"
              onClick={() => handlePick(opt)}
              className="gs-link-card min-h-[220px] items-center text-center"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-5xl sm:text-6xl mb-4">{opt.icon}</div>
              <span className="gs-link-title text-xl sm:text-2xl">{opt.title}</span>
              <span className="gs-link-desc">{opt.subtitle}</span>
              <span className="gs-link-cta">Open →</span>
            </motion.button>
          ))}
        </div>

        <motion.p
          className="mt-10 sm:mt-12 text-sm sm:text-base text-[#6a6a6a]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Honest guidance first — we show every realistic option, not just one “perfect” answer.
        </motion.p>
      </motion.div>
    </div>
  );
}

export default GuidanceHub;
