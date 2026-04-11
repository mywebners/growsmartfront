import React, { useEffect, useState, useContext, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";
import { ArrowLeft, ClipboardList, Sparkles } from "lucide-react";
import { addHistoryEntry, createHistoryEntry } from "../utils/historyStorage";

const RANK_STYLES = [
  "from-amber-400 to-orange-500",
  "from-slate-300 to-slate-400",
  "from-amber-700 to-amber-600",
  "from-emerald-400/90 to-teal-500/90",
  "from-violet-400/85 to-purple-600/85",
];

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user,
    resetAssessment,
    matricStream,
    intermediateStream,
    matricMarks,
    intermediateMarks,
  } = useContext(AuthContext);

  const career = location.state?.career;
  const topCareers = location.state?.topCareers || [];
  const data = location.state?.fullData || {};
  const skillsRaw = location.state?.skillsRaw || {};
  const skillsConverted = location.state?.skillsConverted || {};
  const hasSavedRef = useRef(false);

  const [animateConfetti, setAnimateConfetti] = useState(false);

  const rankedCareers = useMemo(() => {
    const rows = Array.isArray(topCareers) ? [...topCareers] : [];
    if (rows.length === 0 && career) {
      rows.push({
        career,
        confidence: null,
        blend_confidence: null,
      });
    }
    return rows.slice(0, 5);
  }, [topCareers, career]);

  const handleStartNewTest = () => {
    resetAssessment();
    navigate("/education");
  };

  useEffect(() => {
    if (career) {
      setAnimateConfetti(true);
    }
  }, [career]);

  useEffect(() => {
    if (!career || hasSavedRef.current) return;

    const entry = createHistoryEntry({
      user,
      career,
      topCareers: rankedCareers,
      fullData: data,
      skillsRaw,
      skillsConverted,
      matricInfo: {
        stream: matricStream,
        marks: matricMarks?.[matricStream] || {},
      },
      intermediateInfo: {
        stream: intermediateStream,
        marks: intermediateMarks?.[intermediateStream] || {},
      },
    });

    addHistoryEntry(user, entry);
    hasSavedRef.current = true;
  }, [
    career,
    user,
    data,
    skillsRaw,
    skillsConverted,
    rankedCareers,
    matricStream,
    intermediateStream,
    matricMarks,
    intermediateMarks,
  ]);

  if (!career) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <GlassCard className="p-12 max-w-md text-center">
          <div className="text-6xl mb-6">❌</div>
          <h2 className="text-3xl font-bold text-white mb-4">No Result Found</h2>
          <p className="text-white/70 mb-8">Please complete the assessment first</p>
          <AnimatedButton
            onClick={() => navigate("/skills")}
            className="px-12 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white"
          >
            Start Skills Test
          </AnimatedButton>
        </GlassCard>
      </div>
    );
  }

  const primary = rankedCareers[0]?.career || career;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 pt-24 pb-20 px-0">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-10"
          >
            <AnimatePresence>
              {animateConfetti && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 rounded-full blur-3xl opacity-30 animate-ping" />
                  <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full blur-2xl opacity-40 animate-bounce" />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="inline-flex items-center gap-2 text-white/80 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4 text-amber-300" />
              Top career matches
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-3 drop-shadow-lg">
              Your best match
            </h1>
            <motion.div
              className="text-3xl md:text-5xl font-black bg-gradient-to-r from-yellow-300 via-amber-200 to-orange-300 bg-clip-text text-transparent px-6 py-5 rounded-3xl border border-white/20 bg-white/5 backdrop-blur-md inline-block max-w-full"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              {primary}
            </motion.div>
            <p className="text-white/65 text-base md:text-lg mt-6 max-w-xl mx-auto leading-relaxed">
              Below are up to five ranked suggestions from the model, adjusted for your stream and skills.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-4 mb-12"
          >
            {rankedCareers.map((row, i) => (
              <GlassCard
                key={`${row.career}-${i}`}
                className="p-5 md:p-6 flex flex-row items-center gap-4 border border-white/15"
              >
                <div
                  className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white bg-gradient-to-br ${RANK_STYLES[i] || RANK_STYLES[4]} shadow-lg`}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-white font-bold text-lg md:text-xl truncate">{row.career}</p>
                  <p className="text-white/55 text-sm mt-1">
                    {row.blend_confidence != null && (
                      <span className="text-emerald-300/95">{row.blend_confidence}% adjusted fit</span>
                    )}
                    {row.blend_confidence != null && row.confidence != null && (
                      <span className="mx-2 text-white/30">·</span>
                    )}
                    {row.confidence != null && (
                      <span>{row.confidence}% model</span>
                    )}
                    {row.blend_confidence == null && row.confidence == null && (
                      <span>Rank #{i + 1}</span>
                    )}
                  </p>
                </div>
              </GlassCard>
            ))}
          </motion.div>

          <motion.div
            className="flex flex-col gap-4 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <AnimatedButton
              onClick={() => navigate("/history")}
              className="px-8 py-5 text-lg glass-card backdrop-blur-xl border-2 border-white/35 text-white font-bold rounded-2xl shadow-xl flex items-center justify-center gap-3 w-full"
            >
              <ClipboardList className="w-6 h-6" />
              View full details in history
            </AnimatedButton>
            <AnimatedButton
              onClick={handleStartNewTest}
              className="px-8 py-5 text-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl shadow-xl w-full"
            >
              Start a new test
            </AnimatedButton>
          </motion.div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="fixed top-24 left-4 z-30 p-3 rounded-full glass-card hover:bg-white/20 transition-all"
        aria-label="Go back"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
    </div>
  );
}

export default Result;
