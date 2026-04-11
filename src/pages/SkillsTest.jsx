import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";

function SkillsTest() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    matricMarks,
    intermediateMarks,
    matricStream,
    intermediateStream,
  } = useContext(AuthContext);

  const academicData = location.state || {};
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [skills, setSkills] = useState({});
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

  const questions = [
    {
      key: "Linguistic",
      text: "How good are you at writing or speaking your ideas?",
      icon: "✍️",
    },
    {
      key: "Musical",
      text: "How good are you with music, rhythm, or tunes?",
      icon: "🎵",
    },
    {
      key: "Bodily",
      text: "How good are you at sports, dance, or body control?",
      icon: "🏃",
    },
    {
      key: "Logical",
      text: "How much do you like puzzles, numbers, or logic?",
      icon: "🧮",
    },
    {
      key: "Spatial",
      text: "How easy is it for you to picture shapes or 3D objects in your mind?",
      icon: "🎨",
    },
    {
      key: "Interpersonal",
      text: "How well do you get along with people and read their feelings?",
      icon: "🗣️",
    },
    {
      key: "Intrapersonal",
      text: "How well do you know your own feelings and goals?",
      icon: "🤔",
    },
    {
      key: "Naturalist",
      text: "How much do you like nature, animals, or plants?",
      icon: "🌿",
    },
  ];

  const options = [
    { value: 1, label: "Not really", emoji: "😴" },
    { value: 2, label: "A little", emoji: "😐" },
    { value: 3, label: "So-so", emoji: "🤔" },
    { value: 4, label: "Pretty good", emoji: "😊" },
    { value: 5, label: "Very good", emoji: "🔥" },
  ];

  const answeredCount = Object.keys(skills).length;
  const progress = (answeredCount / questions.length) * 100;

  const handleOptionSelect = (value) => {
    const questionKey = questions[currentQuestion].key;
    setSkills({
      ...skills,
      [questionKey]: value,
    });

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 280);
    } else {
      setTimeout(() => setIsCompleted(true), 400);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const convertSkill = (value) => {
    const num = Number(value);
    if (num <= 2) return "LOW";
    if (num === 3) return "MEDIUM";
    return "HIGH";
  };

  const handleSubmit = async () => {
    if (currentQuestion !== questions.length - 1 || Object.keys(skills).length !== questions.length) {
      alert("Please pick one answer for every question.");
      return;
    }

    setIsSubmitting(true);

    const finalSkills = {};
    Object.keys(skills).forEach((key) => {
      finalSkills[key] = convertSkill(skills[key]);
    });

    const finalData = {
      ...academicData,
      ...finalSkills,
      matric_marks: academicData.matric_marks || matricMarks?.[matricStream] || {},
      intermediate_marks:
        academicData.intermediate_marks || intermediateMarks?.[intermediateStream] || {},
      matric_stream: academicData.matric_stream || matricStream || null,
      intermediate_stream: academicData.intermediate_stream || intermediateStream || null,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/predict-career", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
            skillsRaw: skills,
            skillsConverted: finalSkills,
          },
        });
      }, 1200);
    } catch (error) {
      console.error("Error:", error);
      alert("Cannot reach the server. Check that the app is running.");
      setIsSubmitting(false);
    }
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 pt-24 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="text-6xl mb-6">🧠</div>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
              Skills
            </h1>
            <p className="text-lg text-white/75 max-w-lg mx-auto mb-6">
              Tap the line that fits you best. There are no right or wrong answers.
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
                  <div className="text-5xl md:text-6xl mb-6 text-center">{currentQ.icon}</div>
                  <h2 className="text-xl md:text-2xl font-bold text-white text-center mb-8 leading-snug px-1">
                    {currentQ.text}
                  </h2>
                  <div className="space-y-4 flex-1 flex flex-col justify-center">
                    {options.map((option, i) => (
                      <motion.button
                        key={option.value}
                        type="button"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.06 * i }}
                        onClick={() => handleOptionSelect(option.value)}
                        className="w-full text-left rounded-2xl border border-white/20 bg-white/5 hover:bg-white/12 hover:border-emerald-400/40 px-5 py-4 md:py-5 shadow-lg backdrop-blur-sm transition-colors duration-200 flex items-center gap-4"
                      >
                        <span className="text-2xl shrink-0">{option.emoji}</span>
                        <span className="font-semibold text-lg text-white/95">{option.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center flex-1 text-center py-6">
                  <div className="text-7xl mb-8">🎉</div>
                  <p className="text-2xl font-bold text-white mb-4">All done</p>
                  <p className="text-white/70 text-lg mb-10 max-w-md">
                    Press the button below to see career ideas based on your answers.
                  </p>
                </div>
              )}
            </GlassCard>
          </motion.div>

          <div className="flex flex-wrap gap-4 justify-center">
            <AnimatedButton
              onClick={handleBack}
              disabled={currentQuestion === 0 || isCompleted}
              className="px-10 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold rounded-2xl backdrop-blur-sm disabled:opacity-30"
            >
              ← Back
            </AnimatedButton>

            {isCompleted ? (
              <AnimatedButton
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-14 py-5 text-lg font-bold bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 shadow-2xl rounded-2xl"
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2 align-middle" />
                    Working…
                  </>
                ) : (
                  "See my results"
                )}
              </AnimatedButton>
            ) : currentQuestion === questions.length - 1 ? (
              <AnimatedButton
                onClick={handleSubmit}
                disabled={isSubmitting || !skills[currentQ.key]}
                className="px-14 py-4 text-lg font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-2xl shadow-2xl"
              >
                Finish and see results
              </AnimatedButton>
            ) : (
              <AnimatedButton
                disabled={!skills[currentQ.key]}
                onClick={() => handleOptionSelect(skills[currentQ.key])}
                className="px-14 py-4 text-lg font-bold bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 rounded-2xl shadow-2xl"
              >
                Next →
              </AnimatedButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkillsTest;
