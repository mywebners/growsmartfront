import React, { useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LEVELS = [
  {
    id: "matric",
    title: "I completed Matric",
    subtitle: "Select Matric stream + marks — then get Pakistan job apply links",
    icon: "🎓",
    accent: "hover:border-amber-400 hover:shadow-amber-500/30",
  },
  {
    id: "inter",
    title: "I completed Intermediate",
    subtitle: "Matric + Intermediate details → jobs you can apply for now",
    icon: "📘",
    accent: "hover:border-orange-400 hover:shadow-orange-500/30",
  },
  {
    id: "bachelor",
    title: "I completed / studying Bachelor",
    subtitle: "Matric + Inter + degree/CGPA (or transcript photo) → job matches",
    icon: "🏛️",
    accent: "hover:border-rose-400 hover:shadow-rose-500/30",
  },
];

function JobsGuidance() {
  const navigate = useNavigate();
  const { setGuidanceType, setJobsGoal, setStudyGoal } = useContext(AuthContext);

  const handleLevel = (id) => {
    setGuidanceType("jobs");
    setStudyGoal(null);
    setJobsGoal(id);
    navigate("/stream", { state: { jobsMode: true, jobsGoal: id } });
  };

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-20 px-3 sm:px-4 flex flex-col items-center justify-center">
      <motion.div
        className="glass-card p-8 sm:p-12 md:p-14 max-w-3xl w-full text-center career-glow"
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-6xl mb-5">💼</div>
        <h1 className="text-3xl sm:text-5xl font-bold text-career-gradient mb-4">
          Jobs Related Guidance
        </h1>
        <p className="text-white/75 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Kitna parha hai? Pehle education level choose karo — phir marks do. OpenAI Pakistan ke
          government + private portals pe apply links suggest karega.
        </p>

        <div className="grid gap-4 sm:gap-5 text-left">
          {LEVELS.map((lvl, i) => (
            <motion.button
              key={lvl.id}
              type="button"
              onClick={() => handleLevel(lvl.id)}
              className={`group glass-card p-6 sm:p-7 border-2 border-white/25 ${lvl.accent} transition-all flex gap-4 items-start`}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              whileHover={{ scale: 1.02, y: -3 }}
              whileTap={{ scale: 0.99 }}
            >
              <span className="text-4xl shrink-0">{lvl.icon}</span>
              <span>
                <span className="block text-xl sm:text-2xl font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">
                  {lvl.title}
                </span>
                <span className="block text-sm sm:text-base text-white/65 leading-relaxed">
                  {lvl.subtitle}
                </span>
              </span>
            </motion.button>
          ))}
        </div>

        <button
          type="button"
          className="mt-10 text-white/55 hover:text-white/90 text-sm"
          onClick={() => navigate("/guidance")}
        >
          ← Back to guidance options
        </button>
      </motion.div>
    </div>
  );
}

export default JobsGuidance;
