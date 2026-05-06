import React, { useEffect, useMemo, useState, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RotateCcw, Trash2 } from "lucide-react";
import { getHistoryItems, deleteHistoryEntry } from "../utils/historyStorage";
import { AuthContext } from "../context/AuthContext";
import AnimatedButton from "../components/AnimatedButton";

function History() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
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

  useEffect(() => {
    setData(getHistoryItems(user));
  }, [user]);

  const sortedItems = useMemo(() => {
    return [...data].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [data]);

  const handleStartNewTest = () => {
    resetAssessment();
    navigate("/education", { replace: true });
  };

  const handleDelete = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Remove this result from your history?")) return;
    setData(deleteHistoryEntry(user, id));
  };

  const openDetail = (id) => navigate(`/history/${id}`);

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-16 sm:pb-20 px-3 max-[320px]:px-2 sm:px-4">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 sm:p-8 backdrop-blur-xl shadow-xl mb-8 sm:mb-10"
        >
          <AnimatedButton
            onClick={handleStartNewTest}
            className="w-full sm:w-auto px-8 py-4 text-base font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl shadow-lg flex items-center justify-center gap-2 mb-8"
          >
            <RotateCcw className="w-5 h-5" />
            Start a new test
          </AnimatedButton>

          <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-4 mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              My career history
            </h1>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-3 rounded-full glass-card hover:bg-white/20 transition-all shrink-0 self-start"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
          <p className="text-white/70 text-base sm:text-lg max-w-2xl">
            Stored on this browser. Tap a card for full marks and skills. Trash removes only that entry.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {sortedItems.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(0.08 * index, 0.5) }}
              className="relative glass-card rounded-2xl sm:rounded-3xl border border-white/15 shadow-xl backdrop-blur-xl overflow-hidden min-h-[220px] sm:min-h-[260px] flex flex-col"
            >
              <button
                type="button"
                onClick={(e) => handleDelete(e, item.id)}
                className="absolute top-4 right-4 z-10 p-2.5 rounded-xl bg-red-500/25 hover:bg-red-500/45 border border-red-400/35 text-white transition-colors"
                aria-label="Delete this history entry"
              >
                <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
              </button>

              <div
                role="button"
                tabIndex={0}
                className="flex-1 flex flex-col p-6 sm:p-9 pt-14 sm:pt-10 pr-14 sm:pr-16 cursor-pointer text-left group outline-none focus-visible:ring-2 focus-visible:ring-violet-400/80 rounded-[inherit]"
                onClick={() => openDetail(item.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openDetail(item.id);
                  }
                }}
              >
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 bg-gradient-to-br from-violet-600 to-purple-900 rounded-2xl flex items-center justify-center shadow-lg career-glow">
                    <span className="text-base sm:text-lg font-black text-white">#{index + 1}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-violet-200 transition-colors break-anywhere leading-snug">
                      {item.career}
                    </h2>
                    <p className="text-white/55 text-sm sm:text-base mt-2">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-white/25 to-transparent mb-5" />

                <div className="mt-auto flex flex-wrap gap-2">
                  <span className="text-xs sm:text-sm px-3 py-1.5 rounded-full bg-white/10 text-white/80 border border-white/15">
                    Matric · {item.matric?.stream ? String(item.matric.stream).toUpperCase() : "—"}
                  </span>
                  <span className="text-xs sm:text-sm px-3 py-1.5 rounded-full bg-white/10 text-white/80 border border-white/15">
                    Inter ·{" "}
                    {item.intermediate?.stream
                      ? String(item.intermediate.stream).replace(/-/g, " ")
                      : "—"}
                  </span>
                </div>

                <p className="text-violet-300/90 text-sm font-medium mt-5">
                  Open details →
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        {sortedItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 sm:p-16 text-center backdrop-blur-xl mt-8 rounded-2xl sm:rounded-3xl"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-white/85 mb-4">No history yet</h3>
            <p className="text-white/60 mb-8 max-w-md mx-auto text-base">
              Finish a test once and it will show up here.
            </p>
            <button
              type="button"
              className="btn-career px-10 sm:px-12 py-4 text-base sm:text-lg"
              onClick={() => {
                resetAssessment();
                navigate("/education", { replace: true });
              }}
            >
              Start first test
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default History;
