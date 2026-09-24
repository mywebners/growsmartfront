import React, { useEffect, useMemo, useState, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RotateCcw, Trash2 } from "lucide-react";
import { deleteUserGuidance } from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import AnimatedButton from "../components/AnimatedButton";

function History() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { resetAssessment, guidanceHistory, refreshMe } = useContext(AuthContext);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        // Prefer refresh of /auth/me (same data as first post-login load)
        const me = await refreshMe();
        if (!cancelled) {
          const list = Array.isArray(me?.guidance)
            ? me.guidance
            : Array.isArray(guidanceHistory)
              ? guidanceHistory
              : [];
          setData(list);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Could not load account history");
          setData([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sortedItems = useMemo(() => {
    return [...data].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [data]);

  const handleStartNewTest = () => {
    resetAssessment();
    navigate("/guidance", { replace: true });
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Remove this result from your account?")) return;
    try {
      await deleteUserGuidance(id);
      setData((prev) => prev.filter((row) => row.id !== id));
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  };

  const openDetail = (id) => navigate(`/history/${id}`);

  const cardTitle = (item) =>
    item.career || item.title || (item.type ? String(item.type).toUpperCase() : "Guidance");

  return (
    <div className="min-h-screen pt-8 sm:pt-10 pb-16 sm:pb-20 px-3 max-[320px]:px-2 sm:px-4">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 sm:p-8 backdrop-blur-xl shadow-xl mb-8 sm:mb-10"
        >
          <AnimatedButton
            onClick={handleStartNewTest}
            className="w-full sm:w-auto px-8 py-4 text-base font-bold bg-gradient-to-r from-[#0056d2] to-[#2f7de1] text-white rounded-2xl shadow-lg flex items-center justify-center gap-2 mb-8"
          >
            <RotateCcw className="w-5 h-5" />
            Start a new test
          </AnimatedButton>

          <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-4 mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#003a9b] via-[#0056d2] to-[#2f7de1] bg-clip-text text-transparent">
              My guidance history
            </h1>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-3 rounded-full glass-card hover:bg-[#0056d2]/10 transition-all shrink-0 self-start"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
          <p className="text-[#5b5b5b] text-base sm:text-lg max-w-2xl">
            Saved on your GrowSmart account (MongoDB) — available after login on any device.
          </p>
        </motion.div>

        {loading && (
          <p className="text-center text-[#5b5b5b] py-10">Loading your account history…</p>
        )}
        {error && !loading && (
          <p className="text-center text-[#c62828] py-6">{error}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {sortedItems.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(0.08 * index, 0.5) }}
              className="relative glass-card rounded-2xl sm:rounded-3xl border border-[#d9d9d9] shadow-xl backdrop-blur-xl overflow-hidden min-h-[220px] sm:min-h-[260px] flex flex-col"
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
                className="flex-1 flex flex-col p-6 sm:p-9 pt-14 sm:pt-10 pr-14 sm:pr-16 cursor-pointer text-left group outline-none focus-visible:ring-2 focus-visible:ring-[#2f7de1]/80 rounded-[inherit]"
                onClick={() => openDetail(item.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openDetail(item.id);
                  }
                }}
              >
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 bg-gradient-to-br from-[#0056d2] to-[#003a9b] rounded-2xl flex items-center justify-center text-white shadow-lg career-glow">
                    <span className="text-base sm:text-lg font-black text-white">#{index + 1}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-wide text-[#2f7de1] mb-1">
                      {item.type || "career"}
                    </p>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] group-hover:text-[#9ec5ff] transition-colors break-anywhere leading-snug">
                      {cardTitle(item)}
                    </h2>
                    <p className="text-[#6a6a6a] text-sm sm:text-base mt-2">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-white/25 to-transparent mb-5" />

                <div className="mt-auto flex flex-wrap gap-2">
                  <span className="text-xs sm:text-sm px-3 py-1.5 rounded-full bg-[#eef5ff] text-[#2b2b2b] border border-white/15">
                    Matric · {item.matric?.stream ? String(item.matric.stream).toUpperCase() : "—"}
                  </span>
                  <span className="text-xs sm:text-sm px-3 py-1.5 rounded-full bg-[#eef5ff] text-[#2b2b2b] border border-white/15">
                    Inter ·{" "}
                    {item.intermediate?.stream
                      ? String(item.intermediate.stream).replace(/-/g, " ")
                      : "—"}
                  </span>
                </div>

                <p className="text-[#2f7de1] text-sm font-medium mt-5">
                  Open details →
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        {!loading && !error && sortedItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 sm:p-16 text-center backdrop-blur-xl mt-8 rounded-2xl sm:rounded-3xl"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-4">No history yet</h3>
            <p className="text-[#6a6a6a] mb-8 max-w-md mx-auto text-base">
              Finish guidance once and it will be saved to your account.
            </p>
            <button
              type="button"
              className="btn-career px-10 sm:px-12 py-4 text-base sm:text-lg"
              onClick={() => {
                resetAssessment();
                navigate("/guidance", { replace: true });
              }}
            >
              Start first guidance
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default History;
