import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";

const PLATFORM_COLORS = {
  linkedin: "from-[#2f7de1] to-[#0056d2]",
  rozee: "from-[#0056d2] to-[#0044a8]",
  mustakbil: "from-[#378edd] to-[#003a9b]",
  other: "from-[#FF6BA8] to-[#0056d2]",
};

function CareerScope() {
  const location = useLocation();
  const navigate = useNavigate();
  const career = location.state?.career;
  const scope = location.state?.scope;

  const platforms = useMemo(() => {
    const portalMeta = scope?.portals || [];
    const shares = scope?.platforms || {};
    return portalMeta.map((p) => ({
      ...p,
      percent: shares[p.id] ?? 0,
      color: PLATFORM_COLORS[p.id] || "from-slate-400 to-slate-600",
    }));
  }, [scope]);

  if (!career || !scope) {
    return (
      <div className="min-h-screen pt-28 px-4 flex items-center justify-center">
        <GlassCard className="p-10 max-w-md text-center">
          <div className="text-5xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-3">No scope data</h2>
          <p className="text-[#5b5b5b] mb-8">
            Open this page from a career result using the Pakistan Job Scope button.
          </p>
          <AnimatedButton className="btn-career" onClick={() => navigate("/guidance")}>
            Back to guidance
          </AnimatedButton>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 sm:pt-10 pb-16 px-3 sm:px-4">
      <div className="max-w-3xl mx-auto w-full">
        <motion.div
          className="glass-card p-7 sm:p-10 career-glow text-center mb-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-5xl mb-4">🇵🇰</div>
          <p className="text-[#6a6a6a] text-sm mb-2">Pakistan job-market scope</p>
          <h1 className="text-2xl sm:text-4xl font-bold text-career-gradient mb-3 break-anywhere">
            {career}
          </h1>
          <p className="text-[#5b5b5b] text-sm sm:text-base">
            Category: <span className="text-emerald-300 font-semibold">{scope.category_label}</span>
          </p>
          <p className="text-[#7a7a7a] text-xs mt-3 max-w-xl mx-auto leading-relaxed">
            Job Scope uses curated portal estimates in{" "}
            <span className="text-[#6a6a6a]">growsmartback/dataset/pakistan_career_scope.json</span>{" "}
            (API <span className="text-[#6a6a6a]">/career-scope</span>) — not live LinkedIn scraping.
            Pakistan Guide (universities) uses <span className="text-[#6a6a6a]">OPENAI_API_KEY</span> from backend .env.
          </p>
        </motion.div>

        <motion.div
          className="glass-card p-6 sm:p-8 mb-5 text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-[#5b5b5b] text-sm mb-2">Overall Pakistan scope</p>
          <div className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-[#003a9b] via-[#0056d2] to-[#2f7de1] bg-clip-text text-transparent mb-3">
            {scope.overall_scope}%
          </div>
          <div className="w-full bg-[#eef5ff] h-3 rounded-full overflow-hidden mb-4">
            <motion.div
              className="h-full bg-gradient-to-r from-[#0056d2] to-[#378edd] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${scope.overall_scope}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
          <p className="text-[#5b5b5b] text-sm sm:text-base leading-relaxed text-left">
            {scope.demand_note}
          </p>
        </motion.div>

        <motion.div
          className="glass-card p-6 sm:p-8 mb-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
        >
          <h2 className="text-xl font-bold text-[#1a1a1a] mb-2 text-left">
            Where jobs show up (relative share)
          </h2>
          <p className="text-[#6a6a6a] text-xs sm:text-sm mb-5 text-left">
            Approximate share of Pakistan-facing openings for this career family across major portals.
          </p>
          <div className="space-y-4">
            {platforms.map((p, i) => (
              <div key={p.id} className="text-left">
                <div className="flex justify-between gap-3 mb-1.5">
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#1a1a1a] font-semibold hover:text-emerald-300 transition-colors"
                  >
                    {p.label}
                  </a>
                  <span className="text-emerald-200 font-bold">{p.percent}%</span>
                </div>
                <div className="w-full bg-[#eef5ff] h-2.5 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${p.color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${p.percent}%` }}
                    transition={{ duration: 0.7, delay: 0.08 * i }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {scope.meta_note && (
          <p className="text-[#7a7a7a] text-xs sm:text-sm leading-relaxed mb-6 px-1">
            {scope.meta_note}
            {scope.updated ? ` (Updated ${scope.updated})` : ""}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <AnimatedButton
            className="btn-career"
            onClick={() => navigate("/career-insights", { state: { career } })}
          >
            Pakistan study / institute guide
          </AnimatedButton>
          <AnimatedButton
            className="glass-card px-6 py-3 hover:bg-[#0056d2]/10"
            onClick={() => navigate(-1)}
          >
            Back to results
          </AnimatedButton>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="fixed top-16 sm:top-24 left-2 sm:left-4 z-30 p-2.5 sm:p-3 rounded-full glass-card hover:bg-[#0056d2]/10"
        aria-label="Go back"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
    </div>
  );
}

export default CareerScope;
