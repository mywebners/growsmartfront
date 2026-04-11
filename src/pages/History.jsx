import React, { useEffect, useMemo, useState, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { getHistoryItems } from "../utils/historyStorage";
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

  const latestFive = useMemo(() => data.slice(0, 5), [data]);

  const handleStartNewTest = () => {
    resetAssessment();
    navigate("/education", { replace: true });
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 backdrop-blur-xl shadow-xl mb-8"
        >
          <AnimatedButton
            onClick={handleStartNewTest}
            className="w-full sm:w-auto px-8 py-4 text-base font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl shadow-lg flex items-center justify-center gap-2 mb-8"
          >
            <RotateCcw className="w-5 h-5" />
            Start a new test
          </AnimatedButton>

          <div className="flex items-center justify-between gap-4 mb-6">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              My career history
            </h1>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-3 rounded-full glass-card hover:bg-white/20 transition-all shrink-0"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
          <p className="text-white/70 text-lg max-w-2xl">
            Latest five results. Open any card for full details.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestFive.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="glass-card p-8 backdrop-blur-xl hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20 transition-all cursor-pointer group border border-white/10"
              whileHover={{ y: -6 }}
              onClick={() => navigate(`/history/${item.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate(`/history/${item.id}`);
                }
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-800 rounded-2xl flex items-center justify-center shadow-lg career-glow">
                  <span className="text-sm font-bold text-white">#{index + 1}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-2">
                    {item.career}
                  </h3>
                  <p className="text-white/60 text-sm mt-1">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mb-4" />
              <p className="text-white/50 text-xs">Tap for marks &amp; skills</p>
            </motion.div>
          ))}
        </div>

        {latestFive.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-16 text-center backdrop-blur-xl mt-8"
          >
            <h3 className="text-3xl font-bold text-white/80 mb-4">No history yet</h3>
            <p className="text-white/60 mb-8 max-w-md mx-auto">
              Complete a career test to see your results here.
            </p>
            <button
              type="button"
              className="btn-career px-12 py-4 text-lg"
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
