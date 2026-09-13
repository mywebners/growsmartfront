import React, { useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const GOALS = [
  {
    id: "inter",
    title: "I want Intermediate guidance",
    subtitle: "Tell us your Matric stream & marks — we rank Inter courses for you",
    icon: "🎓",
    steps: "Matric → Inter recommendation",
    accent: "hover:border-teal-400 hover:shadow-teal-500/30",
    gradient: "from-teal-500/20 to-cyan-500/10",
  },
  {
    id: "bachelor",
    title: "I want Bachelor guidance",
    subtitle: "Matric + Intermediate details — we rank Bachelor directions honestly",
    icon: "🏛️",
    steps: "Matric + Inter → Bachelor recommendation",
    accent: "hover:border-sky-400 hover:shadow-sky-500/30",
    gradient: "from-sky-500/20 to-indigo-500/10",
  },
];

function StudyGoal() {
  const navigate = useNavigate();
  const { setGuidanceType, setStudyGoal } = useContext(AuthContext);

  const handleGoal = (goalId) => {
    setGuidanceType("study");
    setStudyGoal(goalId);
    navigate("/stream", { state: { studyMode: true, studyGoal: goalId } });
  };

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-20 px-3 max-[320px]:px-2 sm:px-4 flex flex-col items-center justify-center">
      <motion.div
        className="glass-card p-8 sm:p-12 md:p-16 max-w-3xl w-full backdrop-blur-xl shadow-2xl career-glow text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="mb-10 sm:mb-14">
          <div className="text-6xl sm:text-7xl mb-6 mx-auto w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-emerald-600 to-teal-800 rounded-3xl flex items-center justify-center shadow-2xl career-glow">
            📖
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent mb-4">
            Study / Educational Guidance
          </h1>
          <p className="text-base sm:text-xl text-white/75 max-w-xl mx-auto leading-relaxed">
            What are you planning next? We will ask only what we need, then show every ranked option with clear reasons.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:gap-6">
          {GOALS.map((goal, index) => (
            <motion.button
              key={goal.id}
              type="button"
              onClick={() => handleGoal(goal.id)}
              className={`group glass-card p-7 sm:p-9 border-2 border-white/25 ${goal.accent} transition-all duration-500 relative overflow-hidden text-left flex gap-5 items-start`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + index * 0.12 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="text-4xl sm:text-5xl shrink-0 group-hover:scale-110 transition-transform">
                {goal.icon}
              </div>
              <div className="min-w-0">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                  {goal.title}
                </h3>
                <p className="text-sm sm:text-base text-white/70 leading-relaxed mb-3">
                  {goal.subtitle}
                </p>
                <span className="inline-block text-xs sm:text-sm px-3 py-1 rounded-full bg-white/10 border border-white/20 text-emerald-200/90">
                  {goal.steps}
                </span>
              </div>
              <div
                className={`absolute inset-0 bg-gradient-to-br ${goal.gradient} opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none`}
              />
            </motion.button>
          ))}
        </div>

        <motion.button
          type="button"
          className="mt-10 text-white/60 hover:text-white/90 text-sm sm:text-base transition-colors"
          onClick={() => navigate("/guidance")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          ← Back to all guidance options
        </motion.button>
      </motion.div>
    </div>
  );
}

export default StudyGoal;
