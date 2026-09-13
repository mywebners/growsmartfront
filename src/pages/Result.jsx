import React, { useEffect, useState, useContext, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";
import { ArrowLeft, ClipboardList, Sparkles, X, ChevronDown, ChevronUp } from "lucide-react";
import { addHistoryEntry, createHistoryEntry } from "../utils/historyStorage";
import { SKILL_QUESTION_BY_ID } from "../utils/skillsQuestions";

const RANK_STYLES = [
  "from-[#0056d2] to-[#378edd]",
  "from-slate-300 to-slate-400",
  "from-amber-700 to-amber-600",
  "from-[#FF6BA8]/90 to-[#0056d2]/90",
  "from-[#2f7de1]/85 to-[#0044a8]/85",
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
  const [openDetailIndex, setOpenDetailIndex] = useState(null);

  const rankedCareers = useMemo(() => {
    const rows = Array.isArray(topCareers) ? [...topCareers] : [];
    if (rows.length === 0 && career) {
      rows.push({
        career,
        confidence: null,
        blend_confidence: null,
      });
    }
    return rows.slice(0, 4);
  }, [topCareers, career]);

  const handleStartNewTest = () => {
    resetAssessment();
    navigate("/guidance");
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
      skillsQuestionMap: SKILL_QUESTION_BY_ID,
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
      <div className="min-h-screen bg-gradient-to-br from-[#f5f7fb] to-[#e8eef8] flex items-center justify-center">
        <GlassCard className="p-12 max-w-md text-center">
          <div className="text-6xl mb-6">❌</div>
          <h2 className="text-3xl font-bold text-[#1a1a1a] mb-4">No Result Found</h2>
          <p className="text-[#5b5b5b] mb-8">Please complete the assessment first</p>
          <AnimatedButton
            onClick={() => navigate("/skills")}
            className="px-12 py-4 bg-gradient-to-r from-[#0056d2] to-[#2f7de1] text-white"
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
      <div className="relative z-10 pt-20 sm:pt-24 pb-16 sm:pb-20 px-3 max-[320px]:px-2 sm:px-4">
        <div className="max-w-3xl mx-auto w-full">
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
                  <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-[#0056d2] via-[#2f7de1] to-[#378edd] text-white rounded-full blur-3xl opacity-30 animate-ping" />
                  <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-[#2f7de1] to-[#0056d2] rounded-full blur-2xl opacity-40 animate-bounce" />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="inline-flex items-center gap-2 text-[#2b2b2b] text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4 text-amber-300" />
              Top career matches
            </div>
            <h1 className="text-2xl min-[321px]:text-4xl md:text-5xl font-black text-[#1a1a1a] mb-3 drop-shadow-lg px-1">
              Your best match
            </h1>
            <motion.div
              className="text-xl min-[321px]:text-3xl md:text-5xl font-black bg-gradient-to-r from-[#003a9b] via-[#0056d2] to-[#2f7de1] bg-clip-text text-transparent px-4 py-4 sm:px-6 sm:py-5 rounded-2xl sm:rounded-3xl border border-[#d9d9d9] bg-[#e8eef8]/80 backdrop-blur-md inline-block max-w-full break-anywhere text-center"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              {primary}
            </motion.div>
            <p className="text-[#5b5b5b] text-base md:text-lg mt-6 max-w-xl mx-auto leading-relaxed">
              Below are top career suggestions based on your Matric + Intermediate marks and career aptitude answers.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-4 mb-12"
          >
            {rankedCareers.map((row, i) => (
              <GlassCard key={`${row.career}-${i}`} className="p-4 sm:p-5 md:p-6 border border-white/15 !rounded-2xl sm:!rounded-3xl">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-row items-center gap-3 sm:gap-4 min-w-0">
                  <div
                    className={`shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-lg sm:text-xl font-black text-[#1a1a1a] bg-gradient-to-br ${RANK_STYLES[i] || RANK_STYLES[4]} shadow-lg`}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-[#1a1a1a] font-bold text-base sm:text-lg md:text-xl break-anywhere">{row.career}</p>
                    <p className="text-[#6a6a6a] text-xs sm:text-sm mt-1">Rank #{i + 1}</p>
                  </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 w-full">
                  <AnimatedButton
                    onClick={() => setOpenDetailIndex(openDetailIndex === i ? null : i)}
                    className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold bg-[#e8eef8] hover:bg-[#0056d2]/10 border border-[#d9d9d9] text-[#1a1a1a] rounded-xl inline-flex items-center gap-2"
                  >
                    Detail
                    {openDetailIndex === i ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </AnimatedButton>
                  <AnimatedButton
                    onClick={() =>
                      navigate("/career-insights", {
                        state: { career: row.career },
                      })
                    }
                    className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold bg-[#0056d2] hover:bg-[#0044a8] border border-[#0056d2] text-white rounded-xl"
                  >
                    Pakistan Guide
                  </AnimatedButton>
                  <AnimatedButton
                    onClick={async () => {
                      try {
                        const res = await fetch(
                          `http://127.0.0.1:5000/career-scope?career=${encodeURIComponent(row.career)}`
                        );
                        const data = await res.json();
                        if (!data?.success) {
                          alert(data?.message || "Could not load job scope.");
                          return;
                        }
                        navigate("/career-scope", {
                          state: { career: row.career, scope: data },
                        });
                      } catch {
                        alert("Cannot reach server for Pakistan job scope.");
                      }
                    }}
                    className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold bg-sky-500 hover:bg-sky-600 border border-sky-500 text-white rounded-xl"
                  >
                    Job Scope %
                  </AnimatedButton>
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {openDetailIndex === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -6 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -6 }}
                      transition={{ duration: 0.25 }}
                      className="mt-4 overflow-hidden"
                    >
                      <div className="relative rounded-2xl border border-[#2f7de1]/30 bg-[#0056d2]/10 p-4 text-left">
                        <button
                          type="button"
                          onClick={() => setOpenDetailIndex(null)}
                          className="absolute top-2 right-2 p-1 rounded-md text-[#5b5b5b] hover:text-[#1a1a1a] hover:bg-[#eef5ff]"
                          aria-label="Close details"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <p className="text-emerald-200 font-semibold mb-2">Why this career was predicted</p>
                        {(row.why || []).length > 0 ? (
                          <ul className="text-[#1a1a1a] text-sm leading-relaxed space-y-1 pr-8">
                            {(row.why || []).map((point, idx) => (
                              <li key={`${row.career}-reason-${idx}`}>- {point}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-[#2b2b2b] text-sm pr-8">
                            This career matches your combined academic and brain-skill profile.
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
              className="px-8 py-5 text-lg glass-card backdrop-blur-xl border-2 border-[#d9d9d9] text-[#1a1a1a] font-bold rounded-2xl shadow-xl flex items-center justify-center gap-3 w-full"
            >
              <ClipboardList className="w-6 h-6" />
              View full details in history
            </AnimatedButton>
            <AnimatedButton
              onClick={handleStartNewTest}
              className="px-8 py-5 text-lg bg-gradient-to-r from-[#0056d2] to-[#2f7de1] text-white font-bold rounded-2xl shadow-xl w-full"
            >
              Start a new test
            </AnimatedButton>
          </motion.div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="fixed top-16 sm:top-24 left-2 sm:left-4 z-30 p-2.5 sm:p-3 rounded-full glass-card hover:bg-[#0056d2]/10 transition-all max-[320px]:top-14"
        aria-label="Go back"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
    </div>
  );
}

export default Result;
