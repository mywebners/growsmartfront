import React, { useMemo, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { getHistoryItems } from "../utils/historyStorage";
import { AuthContext } from "../context/AuthContext";
import AnimatedButton from "../components/AnimatedButton";
import { SKILL_OPTION_LABELS, SKILL_QUESTION_BY_ID } from "../utils/skillsQuestions";

function HistoryDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user: ctxUser, resetAssessment } = useContext(AuthContext);

  const userData = localStorage.getItem("user");
  let user = ctxUser || userData || "guest";
  if (!ctxUser && userData && userData.startsWith("{")) {
    try {
      const parsed = JSON.parse(userData);
      user = parsed?.firstName || parsed?.name || userData;
    } catch {
      user = "guest";
    }
  }

  const record = useMemo(() => {
    const all = getHistoryItems(user);
    return all.find((item) => item.id === id);
  }, [id, user]);

  const handleStartNewTest = () => {
    resetAssessment();
    navigate("/education");
  };

  if (!record) {
    return (
      <div className="min-h-screen pt-24 sm:pt-28 px-3 max-[320px]:px-2 sm:px-4">
        <div className="max-w-3xl mx-auto glass-card p-10 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Record Not Found</h2>
          <button className="btn-career px-8 py-3" onClick={() => navigate("/history")}>
            Back to History
          </button>
        </div>
      </div>
    );
  }

  const matricMarks = Object.entries(record?.matric?.marks || {});
  const intermediateMarks = Object.entries(record?.intermediate?.marks || {});
  const skillsRaw = Object.entries(record?.skillsRaw || {}).map(([key, value]) => {
    const questionMap = record?.skillsQuestionMap || {};
    const questionText = questionMap[key] || SKILL_QUESTION_BY_ID[key] || key;
    const answerLabel = SKILL_OPTION_LABELS[value] || String(value);
    return [questionText, answerLabel];
  });
  const topCareers = Array.isArray(record.topCareers) ? record.topCareers : [];

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-16 sm:pb-20 px-3 max-[320px]:px-2 sm:px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 md:p-8 border border-emerald-500/25"
        >
          <AnimatedButton
            onClick={handleStartNewTest}
            className="w-full md:w-auto px-10 py-5 text-lg font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white rounded-2xl shadow-xl flex items-center justify-center gap-3 mb-6"
          >
            <RotateCcw className="w-6 h-6" />
            Start a new test
          </AnimatedButton>
          <p className="text-white/60 text-sm mb-6">
            Clears your saved stream and marks for this device and begins the assessment from the start.
          </p>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{record.career}</h1>
              <p className="text-white/70 text-sm">Saved on {new Date(record.createdAt).toLocaleString()}</p>
            </div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-3 rounded-full glass-card hover:bg-white/20 transition-all self-start"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {topCareers.length > 0 && (
          <motion.div className="glass-card p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-semibold text-white mb-4">Top career matches</h2>
            <ol className="space-y-3">
              {topCareers.map((row, i) => (
                <li
                  key={`${row.career}-${i}`}
                  className="flex flex-wrap items-center justify-between gap-2 bg-white/10 rounded-xl px-4 py-3"
                >
                  <span className="text-white font-medium">
                    <span className="text-emerald-400/90 mr-2">{i + 1}.</span>
                    {row.career}
                  </span>
                </li>
              ))}
            </ol>
          </motion.div>
        )}

        <motion.div className="glass-card p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-2xl font-semibold text-white mb-4">Matric</h2>
          <p className="text-white/70 mb-4">Stream: {record?.matric?.stream || "N/A"}</p>
          <div className="grid md:grid-cols-2 gap-3">
            {matricMarks.length > 0 ? (
              matricMarks.map(([subject, mark]) => (
                <div key={subject} className="bg-white/10 rounded-xl px-4 py-3 flex justify-between text-white">
                  <span>{subject}</span>
                  <span className="font-semibold">{mark}</span>
                </div>
              ))
            ) : (
              <p className="text-white/60">No matric data</p>
            )}
          </div>
        </motion.div>

        <motion.div className="glass-card p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-2xl font-semibold text-white mb-4">Intermediate</h2>
          <p className="text-white/70 mb-4">Stream: {record?.intermediate?.stream || "N/A"}</p>
          <div className="grid md:grid-cols-2 gap-3">
            {intermediateMarks.length > 0 ? (
              intermediateMarks.map(([subject, mark]) => (
                <div key={subject} className="bg-white/10 rounded-xl px-4 py-3 flex justify-between text-white">
                  <span>{subject}</span>
                  <span className="font-semibold">{mark}</span>
                </div>
              ))
            ) : (
              <p className="text-white/60">No intermediate data</p>
            )}
          </div>
        </motion.div>

        <motion.div className="glass-card p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-2xl font-semibold text-white mb-4">Skills answers</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {skillsRaw.length > 0 ? (
              skillsRaw.map(([question, answer]) => (
                <div key={question} className="bg-white/10 rounded-xl px-4 py-3 flex justify-between gap-4 text-white">
                  <span className="text-white/90">{question}</span>
                  <span className="font-semibold shrink-0">{answer}</span>
                </div>
              ))
            ) : (
              <p className="text-white/60">No skills data</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default HistoryDetail;
