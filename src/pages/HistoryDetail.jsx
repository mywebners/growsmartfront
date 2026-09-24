import React, { useEffect, useMemo, useState, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { fetchUserGuidanceItem } from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import AnimatedButton from "../components/AnimatedButton";
import { SKILL_OPTION_LABELS, SKILL_QUESTION_BY_ID } from "../utils/skillsQuestions";

function HistoryDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { resetAssessment } = useContext(AuthContext);
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetchUserGuidanceItem(id);
        if (!cancelled) setRecord(res?.entry || null);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Not found");
          setRecord(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleStartNewTest = () => {
    resetAssessment();
    navigate("/guidance");
  };

  const matricMarks = Object.entries(record?.matric?.marks || {});
  const intermediateMarks = Object.entries(record?.intermediate?.marks || {});
  const skillsRaw = useMemo(() => {
    return Object.entries(record?.skillsRaw || {}).map(([key, value]) => {
      const questionMap = record?.skillsQuestionMap || {};
      const questionText = questionMap[key] || SKILL_QUESTION_BY_ID[key] || key;
      const answerLabel = SKILL_OPTION_LABELS[value] || String(value);
      return [questionText, answerLabel];
    });
  }, [record]);
  const topCareers = Array.isArray(record?.topCareers) ? record.topCareers : [];
  const title = record?.career || record?.title || "Guidance";

  if (loading) {
    return (
      <div className="min-h-screen pt-8 sm:pt-10 px-3 sm:px-4">
        <div className="max-w-3xl mx-auto glass-card p-10 text-center text-[#5b5b5b]">
          Loading account record…
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="min-h-screen pt-8 sm:pt-10 px-3 max-[320px]:px-2 sm:px-4">
        <div className="max-w-3xl mx-auto glass-card p-10 text-center">
          <h2 className="text-3xl font-bold mb-4 text-[#1a1a1a]">Record Not Found</h2>
          <p className="text-[#5b5b5b] mb-6">{error}</p>
          <button className="btn-career px-8 py-3" onClick={() => navigate("/history")}>
            Back to History
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 sm:pt-10 pb-16 sm:pb-20 px-3 max-[320px]:px-2 sm:px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 md:p-8 border border-[#0056d2]/30"
        >
          <AnimatedButton
            onClick={handleStartNewTest}
            className="w-full md:w-auto px-10 py-5 text-lg font-bold bg-gradient-to-r from-[#0056d2] via-[#2f7de1] to-[#378edd] text-white rounded-2xl shadow-xl flex items-center justify-center gap-3 mb-6"
          >
            <RotateCcw className="w-6 h-6" />
            Start a new test
          </AnimatedButton>
          <p className="text-[#6a6a6a] text-sm mb-6">
            Saved on your GrowSmart account. Mid-form marks on this device can still be cleared for a new test.
          </p>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-[#2f7de1] mb-1">
                {record.type || "career"}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-2">{title}</h1>
              <p className="text-[#5b5b5b] text-sm">Saved on {new Date(record.createdAt).toLocaleString()}</p>
            </div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-3 rounded-full glass-card hover:bg-[#0056d2]/10 transition-all self-start"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {topCareers.length > 0 && (
          <motion.div className="glass-card p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-4">Top career matches</h2>
            <ol className="space-y-3">
              {topCareers.map((row, i) => (
                <li
                  key={`${row.career}-${i}`}
                  className="flex flex-wrap items-center justify-between gap-2 bg-[#eef5ff] rounded-xl px-4 py-3"
                >
                  <span className="text-[#1a1a1a] font-medium">
                    <span className="text-emerald-400/90 mr-2">{i + 1}.</span>
                    {row.career}
                  </span>
                </li>
              ))}
            </ol>
          </motion.div>
        )}

        {record.type === "scope" && (
          <motion.div className="glass-card p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-4">Job scope snapshot</h2>
            <pre className="text-sm text-[#2b2b2b] whitespace-pre-wrap break-anywhere max-h-80 overflow-auto">
              {JSON.stringify(record.payload?.scope || record.payload, null, 2)}
            </pre>
          </motion.div>
        )}

        {record.type === "insights" && (
          <motion.div className="glass-card p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-4">Insights snapshot</h2>
            <pre className="text-sm text-[#2b2b2b] whitespace-pre-wrap break-anywhere max-h-80 overflow-auto">
              {JSON.stringify(record.payload?.insights || record.payload, null, 2)}
            </pre>
          </motion.div>
        )}

        {record.type === "study" && record.studyResult && (
          <motion.div className="glass-card p-8 space-y-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div>
              <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-2">
                {record.studyResult.headline || "Study guidance"}
              </h2>
              {record.studyResult.summary ? (
                <p className="text-[#5b5b5b] leading-relaxed">{record.studyResult.summary}</p>
              ) : null}
              {record.studyResult.context ? (
                <div className="mt-4 flex flex-wrap gap-2 text-sm">
                  {record.studyResult.context.matricAvg != null && (
                    <span className="px-3 py-1.5 rounded-full bg-[#eef5ff] border border-[#d9d9d9] text-[#2b2b2b]">
                      Matric avg ~ {record.studyResult.context.matricAvg}%
                    </span>
                  )}
                  {record.studyResult.context.intermediateAvg != null && (
                    <span className="px-3 py-1.5 rounded-full bg-[#eef5ff] border border-[#d9d9d9] text-[#2b2b2b]">
                      Inter avg ~ {record.studyResult.context.intermediateAvg}%
                    </span>
                  )}
                  {record.studyResult.context.matricStream && (
                    <span className="px-3 py-1.5 rounded-full bg-[#eef5ff] border border-[#d9d9d9] text-[#2b2b2b]">
                      Matric: {record.studyResult.context.matricStream}
                    </span>
                  )}
                  {record.studyResult.context.intermediateStream && (
                    <span className="px-3 py-1.5 rounded-full bg-[#eef5ff] border border-[#d9d9d9] text-[#2b2b2b]">
                      Inter: {record.studyResult.context.intermediateStream}
                    </span>
                  )}
                </div>
              ) : null}
            </div>

            <div className="space-y-4">
              {(record.studyResult.recommendations || []).map((item, index) => (
                <div
                  key={item.id || index}
                  className="rounded-2xl border border-[#d9d9d9] bg-[#f8fbff] p-4 sm:p-5"
                >
                  <div className="flex gap-3 sm:gap-4 items-start">
                    <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-[#0056d2] to-[#2f7de1] text-white font-black flex items-center justify-center">
                      #{item.rank || index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {item.icon ? <span className="text-xl">{item.icon}</span> : null}
                        <h3 className="text-lg font-bold text-[#1a1a1a]">{item.title}</h3>
                      </div>
                      {item.tagline ? (
                        <p className="text-sm text-[#5b5b5b] mb-2">{item.tagline}</p>
                      ) : null}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {item.fit ? (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-[#0056d2]/10 border border-[#0056d2]/25 text-[#0056d2] font-semibold">
                            {item.fit}
                          </span>
                        ) : null}
                        {item.score != null ? (
                          <span className="text-xs text-[#6a6a6a]">Match score {item.score}/100</span>
                        ) : null}
                      </div>
                      {item.humanNote ? (
                        <p className="text-sm text-[#2b2b2b] leading-relaxed mb-1">{item.humanNote}</p>
                      ) : null}
                      {item.reason ? (
                        <p className="text-xs text-[#6a6a6a] leading-relaxed">{item.reason}</p>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {Array.isArray(record.studyResult.tips) && record.studyResult.tips.length > 0 ? (
              <div>
                <h3 className="text-lg font-bold text-[#1a1a1a] mb-2">Friendly advice</h3>
                <ul className="space-y-2">
                  {record.studyResult.tips.map((tip, i) => (
                    <li key={i} className="text-sm text-[#5b5b5b] flex gap-2">
                      <span className="text-[#0056d2]">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </motion.div>
        )}

        {record.type === "jobs" && record.jobsResult && (
          <motion.div className="glass-card p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-4">Jobs result</h2>
            <p className="text-[#5b5b5b] mb-3">{record.jobsResult.summary || ""}</p>
            <ul className="space-y-2">
              {(record.jobsResult.jobs || []).slice(0, 8).map((job, i) => (
                <li key={`${job.title}-${i}`} className="bg-[#eef5ff] rounded-xl px-4 py-3 text-[#1a1a1a]">
                  {job.title}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {record.type === "cv" && record.cvResult && (
          <motion.div className="glass-card p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-4">CV summary</h2>
            <p className="text-[#1a1a1a] font-medium mb-2">
              {record.cvResult.header?.full_name || record.title}
            </p>
            <p className="text-[#5b5b5b] whitespace-pre-wrap">
              {(record.cvResult.summary || "").slice(0, 600)}
            </p>
          </motion.div>
        )}

        {(matricMarks.length > 0 || record?.matric?.stream) && (
        <motion.div className="glass-card p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-4">Matric</h2>
          <p className="text-[#5b5b5b] mb-4">Stream: {record?.matric?.stream || "N/A"}</p>
          <div className="grid md:grid-cols-2 gap-3">
            {matricMarks.length > 0 ? (
              matricMarks.map(([subject, mark]) => (
                <div key={subject} className="bg-[#eef5ff] rounded-xl px-4 py-3 flex justify-between text-[#1a1a1a]">
                  <span>{subject}</span>
                  <span className="font-semibold">{mark}</span>
                </div>
              ))
            ) : (
              <p className="text-[#6a6a6a]">No matric marks saved</p>
            )}
          </div>
        </motion.div>
        )}

        {(intermediateMarks.length > 0 || record?.intermediate?.stream) && (
        <motion.div className="glass-card p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-4">Intermediate</h2>
          <p className="text-[#5b5b5b] mb-4">Stream: {record?.intermediate?.stream || "N/A"}</p>
          <div className="grid md:grid-cols-2 gap-3">
            {intermediateMarks.length > 0 ? (
              intermediateMarks.map(([subject, mark]) => (
                <div key={subject} className="bg-[#eef5ff] rounded-xl px-4 py-3 flex justify-between text-[#1a1a1a]">
                  <span>{subject}</span>
                  <span className="font-semibold">{mark}</span>
                </div>
              ))
            ) : (
              <p className="text-[#6a6a6a]">No intermediate marks saved</p>
            )}
          </div>
        </motion.div>
        )}

        {skillsRaw.length > 0 && (
        <motion.div className="glass-card p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-4">Skills answers</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {skillsRaw.map(([question, answer]) => (
              <div key={question} className="bg-[#eef5ff] rounded-xl px-4 py-3 flex justify-between gap-4 text-[#1a1a1a]">
                <span className="text-[#1a1a1a]">{question}</span>
                <span className="font-semibold shrink-0">{answer}</span>
              </div>
            ))}
          </div>
        </motion.div>
        )}
      </div>
    </div>
  );
}

export default HistoryDetail;
