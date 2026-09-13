import React, { useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LEVELS = [
  {
    id: "matric",
    title: "I completed Matric",
    subtitle: "Tell us your Matric field/program — then get Pakistan job apply links",
    icon: "🎓",
    accent: "hover:border-[#2f7de1] hover:shadow-[#0056d2]/20",
  },
  {
    id: "inter",
    title: "I completed Intermediate",
    subtitle: "Tell us your Intermediate field/program → jobs you can apply for now",
    icon: "📘",
    accent: "hover:border-[#378edd] hover:shadow-[#0056d2]/20",
  },
  {
    id: "bachelor",
    title: "I completed / studying Bachelor",
    subtitle: "Degree/program + CGPA or marks, and optional transcript upload",
    icon: "🏛️",
    accent: "hover:border-[#0056d2] hover:shadow-[#0056d2]/20",
  },
];

function JobsGuidance() {
  const navigate = useNavigate();
  const { setGuidanceType, setJobsGoal, setStudyGoal } = useContext(AuthContext);

  const handleLevel = (id) => {
    setGuidanceType("jobs");
    setStudyGoal(null);
    setJobsGoal(id);
    navigate("/jobs/details", { state: { jobsGoal: id } });
  };

  return (
    <div className="min-h-screen pt-8 sm:pt-10 pb-16 sm:pb-20 px-3 sm:px-4 flex flex-col items-center justify-center">
      <motion.div
        className="glass-card p-8 sm:p-12 md:p-14 max-w-3xl w-full text-center career-glow"
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-6xl mb-5">💼</div>
        <h1 className="text-3xl sm:text-5xl font-bold text-career-gradient mb-4">
          Jobs Related Guidance
        </h1>
        <p className="text-[#5b5b5b] text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Choose your education level, then tell us which field or program you studied.
          We will suggest Pakistan job portals and apply links — no marks needed.
        </p>

        <div className="grid gap-4 sm:gap-5 text-left">
          {LEVELS.map((lvl, i) => (
            <motion.button
              key={lvl.id}
              type="button"
              onClick={() => handleLevel(lvl.id)}
              className={`group glass-card p-6 sm:p-7 border-2 border-[#d9d9d9] ${lvl.accent} transition-all flex gap-4 items-start`}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              whileHover={{ scale: 1.02, y: -3 }}
              whileTap={{ scale: 0.99 }}
            >
              <span className="text-4xl shrink-0">{lvl.icon}</span>
              <span>
                <span className="block text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-1 group-hover:text-[#0056d2] transition-colors">
                  {lvl.title}
                </span>
                <span className="block text-sm sm:text-base text-[#5b5b5b] leading-relaxed">
                  {lvl.subtitle}
                </span>
              </span>
            </motion.button>
          ))}
        </div>

        <button
          type="button"
          className="mt-10 text-[#6a6a6a] hover:text-[#1a1a1a] text-sm"
          onClick={() => navigate("/guidance")}
        >
          ← Back to guidance options
        </button>
      </motion.div>
    </div>
  );
}

export default JobsGuidance;
