import React, { useContext, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  recommendIntermediate,
  recommendBachelor,
} from "../utils/studyRules";

const RANK_COLORS = [
  "from-[#0056d2] to-[#378edd]",
  "from-slate-200 to-slate-400",
  "from-amber-700 to-amber-500",
  "from-[#2f7de1] to-[#0044a8]",
  "from-[#FF6BA8] to-[#0056d2]",
];

function StudyResult() {
  const navigate = useNavigate();
  const {
    guidanceType,
    studyGoal,
    matricStream,
    matricMarks,
    intermediateStream,
    intermediateMarks,
    resetAssessment,
  } = useContext(AuthContext);

  const result = useMemo(() => {
    if (guidanceType !== "study" || !matricStream) return null;
    const mMarks = matricMarks?.[matricStream] || {};

    if (studyGoal === "inter") {
      return recommendIntermediate({
        matricStream,
        matricMarks: mMarks,
      });
    }

    if (studyGoal === "bachelor" && intermediateStream) {
      return recommendBachelor({
        matricStream,
        matricMarks: mMarks,
        intermediateStream,
        intermediateMarks: intermediateMarks?.[intermediateStream] || {},
      });
    }

    return null;
  }, [
    guidanceType,
    studyGoal,
    matricStream,
    matricMarks,
    intermediateStream,
    intermediateMarks,
  ]);

  if (!result || !result.recommendations?.length) {
    return (
      <div className="min-h-screen pt-28 px-4 flex items-center justify-center">
        <div className="glass-card p-10 max-w-md text-center career-glow">
          <div className="text-5xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-3">Almost there</h2>
          <p className="text-[#5b5b5b] mb-8">
            We still need your academic details to build a fair recommendation list.
          </p>
          <button
            type="button"
            className="btn-career"
            onClick={() => navigate("/study/goal")}
          >
            Start study guidance
          </button>
        </div>
      </div>
    );
  }

  const handleAgain = () => {
    resetAssessment();
    navigate("/guidance");
  };

  return (
    <div className="min-h-screen pt-8 sm:pt-10 pb-16 sm:pb-20 px-3 max-[320px]:px-2 sm:px-4">
      <div className="max-w-3xl mx-auto w-full">
        <motion.div
          className="glass-card p-7 sm:p-10 md:p-12 backdrop-blur-xl shadow-2xl career-glow text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="text-6xl mb-5"
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 160 }}
          >
            {studyGoal === "bachelor" ? "🏛️" : "🎓"}
          </motion.div>
          <h1 className="text-2xl sm:text-4xl font-bold text-career-gradient mb-4">
            {result.headline}
          </h1>
          <p className="text-base sm:text-lg text-[#5b5b5b] leading-relaxed max-w-2xl mx-auto">
            {result.summary}
          </p>
          {result.context && (
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
              <span className="px-3 py-1.5 rounded-full bg-[#eef5ff] border border-[#d9d9d9] text-[#2b2b2b]">
                Matric avg ~ {result.context.matricAvg}%
              </span>
              <span className="px-3 py-1.5 rounded-full bg-[#eef5ff] border border-[#d9d9d9] text-[#2b2b2b]">
                Inter avg ~ {result.context.intermediateAvg}%
              </span>
            </div>
          )}
        </motion.div>

        <div className="space-y-4 sm:space-y-5 mb-8">
          {result.recommendations.map((item, index) => (
            <motion.div
              key={item.id}
              className="glass-card p-5 sm:p-7 border border-[#d9d9d9] relative overflow-hidden"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * index }}
            >
              <div className="flex gap-4 sm:gap-5 items-start">
                <div
                  className={`shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${
                    RANK_COLORS[index % RANK_COLORS.length]
                  } flex items-center justify-center text-lg sm:text-xl font-black text-slate-900 shadow-lg`}
                >
                  #{item.rank}
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-2xl">{item.icon}</span>
                    <h3 className="text-lg sm:text-2xl font-bold text-[#1a1a1a]">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-[#5b5b5b] mb-3">
                    {item.tagline}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-xs sm:text-sm px-2.5 py-1 rounded-full bg-[#0056d2]/20 border border-[#2f7de1]/40 text-[#9ec5ff] font-semibold">
                      {item.fit}
                    </span>
                    <span className="text-xs sm:text-sm text-[#6a6a6a]">
                      Match score {item.score}/100
                    </span>
                  </div>
                  <div className="w-full bg-[#eef5ff] h-2 rounded-full overflow-hidden mb-3">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#0056d2] to-[#378edd] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      transition={{ duration: 0.7, delay: 0.1 * index }}
                    />
                  </div>
                  <p className="text-sm sm:text-base text-[#2b2b2b] leading-relaxed mb-2">
                    {item.humanNote}
                  </p>
                  <p className="text-xs sm:text-sm text-[#6a6a6a] leading-relaxed">
                    {item.reason}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {result.tips?.length > 0 && (
          <motion.div
            className="glass-card p-6 sm:p-8 mb-8 text-left border border-white/15"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-4">
              Friendly advice
            </h2>
            <ul className="space-y-3">
              {result.tips.map((tip, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-sm sm:text-base text-[#5b5b5b] leading-relaxed"
                >
                  <span className="text-[#9ec5ff] shrink-0">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <button type="button" className="btn-career" onClick={handleAgain}>
            Choose another guidance
          </button>
          <button
            type="button"
            className="glass-card px-6 py-3 hover:bg-[#0056d2]/10 transition-all"
            onClick={() => navigate("/study/goal")}
          >
            Run study guidance again
          </button>
          <button
            type="button"
            className="glass-card px-6 py-3 hover:bg-[#0056d2]/10 transition-all"
            onClick={() => navigate("/")}
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudyResult;
