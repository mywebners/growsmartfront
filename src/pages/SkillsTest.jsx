import React, { useState, useEffect, useContext, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";
import { SKILL_QUESTIONS, SKILL_DIMENSIONS } from "../utils/skillsQuestions";

const options = [
  { value: 1, label: "Not really", emoji: "😴" },
  { value: 2, label: "A little", emoji: "😐" },
  { value: 3, label: "So-so", emoji: "🤔" },
  { value: 4, label: "Pretty good", emoji: "😊" },
  { value: 5, label: "Very good", emoji: "🔥" },
];

function SkillsTest() {
  const location = useLocation();
  const navigate = useNavigate();
  const { matricMarks, intermediateMarks, matricStream, intermediateStream } =
    useContext(AuthContext);

  const academicData = location.state || {};
  const [questions, setQuestions] = useState(SKILL_QUESTIONS);
  const [questionsSource, setQuestionsSource] = useState("local");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const stateOk =
      location.state &&
      typeof location.state === "object" &&
      location.state.intermediate_marks &&
      Object.keys(location.state.intermediate_marks).length > 0;
    const ctxOk =
      matricStream &&
      intermediateStream &&
      matricMarks?.[matricStream] &&
      intermediateMarks?.[intermediateStream] &&
      Object.keys(matricMarks[matricStream]).length > 0 &&
      Object.keys(intermediateMarks[intermediateStream]).length > 0;
    if (!stateOk && !ctxOk) {
      navigate("/education", { replace: true });
    }
  }, [
    location.state,
    matricStream,
    intermediateStream,
    matricMarks,
    intermediateMarks,
    navigate,
  ]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/career-questions");
        const data = await res.json();
        if (!cancelled && data?.success && Array.isArray(data.questions) && data.questions.length) {
          setQuestions(data.questions);
          setQuestionsSource(data.source || "database");
        }
      } catch {
        // keep local fallback
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const answeredCount = Object.keys(answers).length;
  const progress = questions.length
    ? (answeredCount / questions.length) * 100
    : 0;

  const aggregateDimensionScores = () => {
    const grouped = {};
    questions.forEach((q) => {
      const value = Number(answers[q.id]);
      if (!Number.isFinite(value)) return;
      const dim = q.dimension || "Logical";
      if (!grouped[dim]) grouped[dim] = [];
      grouped[dim].push(value);
    });

    const averages = {};
    SKILL_DIMENSIONS.forEach((dimension) => {
      const values = grouped[dimension] || [3];
      const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
      averages[dimension] = Math.round(avg);
    });
    return averages;
  };

  const handleOptionSelect = (value) => {
    const questionId = questions[currentQuestion].id;
    setAnswers((prev) => ({ ...prev, [questionId]: value }));

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion((prev) => prev + 1), 280);
    } else {
      setTimeout(() => setIsCompleted(true), 400);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setIsCompleted(false);
    }
  };

  const convertSkill = (value) => {
    const num = Number(value);
    if (num <= 2) return "LOW";
    if (num === 3) return "MEDIUM";
    return "HIGH";
  };

  const handleSubmit = async () => {
    if (
      currentQuestion !== questions.length - 1 ||
      Object.keys(answers).length !== questions.length
    ) {
      alert("Please pick one answer for every question.");
      return;
    }

    setIsSubmitting(true);
    const groupedAverages = aggregateDimensionScores();
    const finalSkills = {};
    Object.keys(groupedAverages).forEach((key) => {
      finalSkills[key] = convertSkill(groupedAverages[key]);
    });
    // Model also accepts alternate column names from training dataset
    finalSkills["Logical - Mathematical"] = finalSkills.Logical;
    finalSkills["Spatial-Visualization"] = finalSkills.Spatial;

    const finalData = {
      ...academicData,
      ...finalSkills,
      matric_marks:
        academicData.matric_marks || matricMarks?.[matricStream] || {},
      intermediate_marks:
        academicData.intermediate_marks ||
        intermediateMarks?.[intermediateStream] ||
        {},
      matric_stream: academicData.matric_stream || matricStream || null,
      intermediate_stream:
        academicData.intermediate_stream || intermediateStream || null,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/predict-career", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      const result = await response.json();
      if (!result.predicted_career) {
        alert(result.message || "Could not get a career idea. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setTimeout(() => {
        setIsSubmitting(false);
        navigate("/result", {
          replace: true,
          state: {
            career: result.predicted_career,
            topCareers: result.top_careers || [],
            usedSortedPslots: result.used_sorted_pslots,
            fullData: finalData,
            skillsRaw: answers,
            groupedAverages,
            skillsConverted: finalSkills,
            questionsSource,
          },
        });
      }, 900);
    } catch (error) {
      console.error("Error:", error);
      alert("Cannot reach the server. Check that the app is running.");
      setIsSubmitting(false);
    }
  };

  const currentQ = questions[currentQuestion] || questions[0];
  const subtitle = useMemo(
    () =>
      questionsSource === "database"
        ? "Career questions loaded from the GrowSmart database."
        : "Career aptitude questions (8) matched to your marks profile.",
    [questionsSource]
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 pt-20 sm:pt-24 pb-16 sm:pb-20 px-3 max-[320px]:px-2 sm:px-4">
        <div className="max-w-2xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="text-5xl sm:text-6xl mb-4 sm:mb-6">🧭</div>
            <h1 className="text-2xl min-[321px]:text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-500 bg-clip-text text-transparent mb-3 sm:mb-4 px-1 break-anywhere">
              Career Aptitude Questions
            </h1>
            <p className="text-base sm:text-lg text-white/75 max-w-lg mx-auto mb-6 px-1">
              {subtitle} Answer honestly — suggestions use your Matric + Inter marks and these answers.
            </p>
            <div className="w-full bg-white/10 backdrop-blur-sm h-2 rounded-full overflow-hidden max-w-xl mx-auto">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.35 }}
              />
            </div>
            {!isCompleted && (
              <p className="text-white/60 text-sm mt-3">
                Question {currentQuestion + 1} of {questions.length}
              </p>
            )}
          </motion.div>

          <motion.div
            key={isCompleted ? "done" : currentQuestion}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-10"
          >
            <GlassCard className="p-8 md:p-10 min-h-[28rem] md:min-h-[30rem] flex flex-col">
              {!isCompleted ? (
                <>
                  <div className="text-5xl md:text-6xl mb-6 text-center">
                    {currentQ?.icon || "💼"}
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white text-center mb-8 leading-snug px-1">
                    {currentQ?.text}
                  </h2>
                  <div className="space-y-4 flex-1 flex flex-col justify-center">
                    {options.map((option, i) => {
                      const selected = answers[currentQ?.id] === option.value;
                      return (
                      <motion.button
                        key={option.value}
                        type="button"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.06 * i }}
                        onClick={() => handleOptionSelect(option.value)}
                        className={`w-full text-left rounded-2xl border px-5 py-4 md:py-5 shadow-lg backdrop-blur-sm transition-colors duration-200 flex items-center gap-4 ${
                          selected
                            ? "border-emerald-400/70 bg-emerald-500/20 ring-2 ring-emerald-400/40"
                            : "border-white/20 bg-white/5 hover:bg-white/12 hover:border-emerald-400/40"
                        }`}
                      >
                        <span className="text-2xl shrink-0">{option.emoji}</span>
                        <span className="font-semibold text-lg text-white/95">
                          {option.label}
                        </span>
                      </motion.button>
                    );})}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center flex-1 text-center py-6">
                  <div className="text-7xl mb-8">🎉</div>
                  <p className="text-2xl font-bold text-white mb-4">All done</p>
                  <p className="text-white/70 text-lg mb-10 max-w-md">
                    We will match top careers using your marks and these career answers from the database model.
                  </p>
                </div>
              )}
            </GlassCard>
          </motion.div>

          <div className="flex flex-wrap gap-4 justify-center">
            {!isCompleted && (
              <AnimatedButton
                onClick={handleBack}
                disabled={currentQuestion === 0}
                className="px-10 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold rounded-2xl backdrop-blur-sm disabled:opacity-30"
              >
                ← Previous
              </AnimatedButton>
            )}

            {isCompleted && (
              <AnimatedButton
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-14 py-5 text-lg font-bold bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 shadow-2xl rounded-2xl"
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2 align-middle" />
                    Working...
                  </>
                ) : (
                  "See my career matches"
                )}
              </AnimatedButton>
            )}
          </div>

          {!isCompleted && (
            <p className="text-center text-white/45 text-sm mt-6">
              Tap an answer to continue — no Next button. Use Previous to change a past answer.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SkillsTest;
