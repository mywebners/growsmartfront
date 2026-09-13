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
    accent: "from-emerald-400 via-teal-400 to-cyan-400",
    border: "hover:border-emerald-400 hover:shadow-emerald-500/30",
    glow: "from-emerald-500/20 to-teal-500/10",
    path: "/study/goal",
  },
  {
    id: "career",
    title: "Career Related Guidance",
    subtitle: "Matric + Inter marks + career questions → top career matches",
    icon: "🧭",
    accent: "from-violet-400 via-purple-400 to-fuchsia-400",
    border: "hover:border-violet-400 hover:shadow-violet-500/30",
    glow: "from-violet-500/20 to-purple-500/10",
    path: "/education",
  },
  {
    id: "jobs",
    title: "Jobs Related Guidance",
    subtitle: "Matric / Inter / Bachelor → Pakistan job portals + apply links (OpenAI)",
    icon: "💼",
    accent: "from-amber-400 via-orange-400 to-rose-400",
    border: "hover:border-amber-400 hover:shadow-amber-500/30",
    glow: "from-amber-500/20 to-orange-500/10",
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
    <div className="min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-20 px-3 max-[320px]:px-2 sm:px-4 flex flex-col items-center justify-center">
      <motion.div
        className="glass-card p-8 sm:p-12 md:p-16 max-w-5xl w-full backdrop-blur-xl shadow-2xl career-glow text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <motion.div
          className="mb-10 sm:mb-14"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="text-6xl sm:text-7xl mb-6 mx-auto w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-violet-600 to-indigo-800 rounded-3xl flex items-center justify-center shadow-2xl career-glow">
            ✨
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-career-gradient mb-4">
            What do you need help with?
          </h1>
          <p className="text-base sm:text-xl text-white/75 max-w-2xl mx-auto leading-relaxed">
            {user ? `Hi ${user} — ` : ""}
            Pick one path. We will guide you step by step, in plain language.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-7">
          {OPTIONS.map((opt, index) => (
            <motion.button
              key={opt.id}
              type="button"
              onClick={() => handlePick(opt)}
              className={`group glass-card p-7 sm:p-9 border-2 border-white/25 ${opt.border} transition-all duration-500 relative overflow-hidden min-h-[240px] flex flex-col items-center justify-center text-center`}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.03, y: -8 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-5xl sm:text-6xl mb-5 group-hover:scale-110 transition-transform">
                {opt.icon}
              </div>
              <h3
                className={`text-xl sm:text-2xl font-bold mb-3 bg-gradient-to-r ${opt.accent} bg-clip-text text-transparent`}
              >
                {opt.title}
              </h3>
              <p className="text-sm sm:text-base text-white/70 leading-relaxed">
                {opt.subtitle}
              </p>
              <div
                className={`absolute inset-0 bg-gradient-to-br ${opt.glow} opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none`}
              />
            </motion.button>
          ))}
        </div>

        <motion.p
          className="mt-10 sm:mt-14 text-sm sm:text-base text-white/55"
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
