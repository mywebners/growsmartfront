import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";
import { MARK_MIN, MARK_MAX, isMarkFieldInvalid, isMarkValid } from "../utils/marksValidation";

function MatricSubjects() {
  const navigate = useNavigate();
  const location = useLocation();
  const { stream } = location.state || {};
  const {
    setMatricData,
    setMatricCompleted,
    matricMarks,
    setMatricMarks,
    setMatricStream,
    guidanceType,
    studyGoal,
    jobsGoal,
  } = useContext(AuthContext);
  const isStudyMode = guidanceType === "study";
  const isJobsMode = guidanceType === "jobs";

  const [marks, setMarks] = useState({});

  const subjectsMap = {
    bio: ["Biology", "Chemistry", "Physics", "English"],
    cs: ["Computer", "Math", "Physics", "English"],
    arts: ["Civics", "History", "Geography", "English"]
  };

  const subjects = subjectsMap[stream] || [];

  useEffect(() => {
    if (stream && matricMarks[stream]) {
      setMarks(matricMarks[stream]);
    }
  }, [stream, matricMarks]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newMarks = {
      ...marks,
      [name]: value
    };
    setMarks(newMarks);
    setMatricMarks(stream, newMarks);
  };

  const convertPerformance = (score) => {
    const num = Number(score);
    if (num >= 80) return "BEST";
    if (num >= 60) return "AVG";
    return "POOR";
  };

  const handleSubmit = async () => {
    if (Object.keys(marks).length !== subjects.length || Object.values(marks).some((v) => v === "" || v == null)) {
      alert("Please enter a mark for every subject.");
      return;
    }
    if (subjects.some((sub) => !isMarkValid(marks[sub]))) {
      alert(`Each mark must be between ${MARK_MIN} and ${MARK_MAX} (your score out of 100).`);
      return;
    }

    const academicData = {};
    subjects.forEach((sub, index) => {
      academicData[`P${index + 1}`] = convertPerformance(marks[sub]);
    });

    setMatricData(academicData);
    setMatricCompleted(true);
    setMatricStream(stream);

    if (isStudyMode && studyGoal === "inter") {
      navigate("/study/result", { replace: true });
      return;
    }
    if (isStudyMode && studyGoal === "bachelor") {
      navigate("/intermediate-stream", { replace: true });
      return;
    }
    if (isJobsMode && jobsGoal === "matric") {
      navigate("/jobs/result", { replace: true });
      return;
    }
    if (isJobsMode && (jobsGoal === "inter" || jobsGoal === "bachelor")) {
      navigate("/intermediate-stream", { replace: true });
      return;
    }

    navigate("/education");
  };

  const filledCount = Object.values(marks).filter((v) => v !== "" && v != null).length;
  const allMarksValid =
    subjects.length > 0 &&
    subjects.every((sub) => isMarkValid(marks[sub]));

  const isSubmitting = false; // Simplified for now

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 pt-20 sm:pt-24 pb-16 sm:pb-20 px-3 max-[320px]:px-2 sm:px-4">
        <div className="max-w-2xl mx-auto w-full">
          
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="text-5xl sm:text-6xl mb-4 sm:mb-6">📚</div>
            <h3 className="text-2xl min-[321px]:text-4xl sm:text-5xl md:text-6xl font-black bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-500 bg-clip-text text-transparent mb-3 sm:mb-4 px-1 break-anywhere">
              Matric Subjects
            </h3>
            <p className="text-base sm:text-xl text-white/70 max-w-lg mx-auto px-1">
              Type your <span className="font-semibold text-emerald-300">percentage</span> for each subject (
              {stream?.toUpperCase()}). Use numbers from <span className="text-emerald-300 font-semibold">{MARK_MIN}</span>{" "}
              (pass) to <span className="text-emerald-300 font-semibold">{MARK_MAX}</span> (full marks).
            </p>
            <div className="w-full bg-white/10 backdrop-blur-sm h-2 rounded-full mt-8 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(filledCount / subjects.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>

          <div className="space-y-6">
            {subjects.map((sub, i) => (
              <motion.div
                key={sub}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <GlassCard
                  className={`p-8 transition-colors ${
                    isMarkFieldInvalid(marks[sub]) ? "ring-2 ring-red-500/80 border-red-500/60" : ""
                  }`}
                >
                  <div className="relative">
                    <input
                      type="number"
                      name={sub}
                      min={MARK_MIN}
                      max={MARK_MAX}
                      value={marks[sub] || ""}
                      onChange={handleChange}
                      className={`w-full p-5 bg-transparent border-none outline-none text-2xl font-semibold text-center transition-all duration-300 peer ${
                        isMarkFieldInvalid(marks[sub])
                          ? "text-red-200 placeholder-red-300/50"
                          : "text-white/90 placeholder-white/50"
                      }`}
                      placeholder={`${MARK_MIN}–${MARK_MAX} (%)`}
                    />
                    <label className="absolute left-5 top-5 text-lg text-white/50 transition-all duration-300 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-emerald-400 peer-valid:-top-2 peer-valid:text-sm peer-valid:text-emerald-400">
                      {sub}
                    </label>
                    {isMarkFieldInvalid(marks[sub]) && (
                      <p className="mt-3 text-center text-sm text-red-300">
                        Use a number from {MARK_MIN} to {MARK_MAX} only.
                      </p>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-16"
          >
            <AnimatedButton
              onClick={handleSubmit}
              disabled={filledCount !== subjects.length || !allMarksValid}
              className="px-16 py-6 text-xl font-bold bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 shadow-2xl disabled:opacity-40 disabled:pointer-events-none"
            >
              {isStudyMode && studyGoal === "inter"
                ? "See Inter recommendations"
                : isStudyMode && studyGoal === "bachelor"
                  ? "Next: Intermediate details"
                  : isJobsMode && jobsGoal === "matric"
                    ? "Find jobs I can apply for"
                    : isJobsMode
                      ? "Next: Intermediate details"
                      : "Save and go to Intermediate"}
            </AnimatedButton>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default MatricSubjects;

