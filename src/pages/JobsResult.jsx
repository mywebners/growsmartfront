import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";

function JobsResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    guidanceType,
    jobsGoal,
    matricStream,
    matricMarks,
    intermediateStream,
    intermediateMarks,
    resetAssessment,
  } = useContext(AuthContext);

  const existing = location.state?.result;
  const [result, setResult] = useState(existing || null);
  const [loading, setLoading] = useState(!existing);
  const [error, setError] = useState("");

  useEffect(() => {
    if (existing) return;
    if (guidanceType !== "jobs") {
      navigate("/jobs-guidance", { replace: true });
      return;
    }

    // Auto-submit for matric / inter levels
    if (jobsGoal !== "matric" && jobsGoal !== "inter") {
      if (jobsGoal === "bachelor") {
        navigate("/jobs/bachelor", { replace: true });
      }
      return;
    }

    const run = async () => {
      setLoading(true);
      setError("");
      const payload = {
        education_level: jobsGoal,
        matric_stream: matricStream,
        matric_marks: matricMarks?.[matricStream] || {},
        intermediate_stream: jobsGoal === "inter" ? intermediateStream : null,
        intermediate_marks:
          jobsGoal === "inter" ? intermediateMarks?.[intermediateStream] || {} : null,
        bachelor_degree: null,
        bachelor_cgpa: null,
        transcript_image: null,
      };
      try {
        const res = await fetch("http://127.0.0.1:5000/jobs-guidance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load jobs.");
        setResult(data);
      } catch (e) {
        setError(e.message || "Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [
    existing,
    guidanceType,
    jobsGoal,
    matricStream,
    matricMarks,
    intermediateStream,
    intermediateMarks,
    navigate,
  ]);

  const jobs = result?.jobs || [];
  const portals = result?.portals || [];
  const summary = result?.summary || "";

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-16 px-3 sm:px-4">
      <div className="max-w-3xl mx-auto w-full">
        <motion.div
          className="glass-card p-7 sm:p-10 career-glow text-center mb-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-5xl mb-3">🇵🇰</div>
          <h1 className="text-2xl sm:text-4xl font-bold text-career-gradient mb-3">
            Jobs you can apply for
          </h1>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed">
            Pakistan government + private portals — based on your qualifications (OpenAI).
          </p>
        </motion.div>

        {loading && (
          <GlassCard className="p-8 text-center text-white/80">
            Finding matching jobs and direct apply links…
          </GlassCard>
        )}

        {error && (
          <GlassCard className="p-8 text-center text-red-200 border-red-300/40">
            {error}
            <p className="text-white/50 text-sm mt-3">
              Check that OPENAI_API_KEY is set in growsmartback/.env and backend is running.
            </p>
          </GlassCard>
        )}

        {!loading && !error && result && (
          <div className="space-y-5">
            {summary && (
              <GlassCard className="p-5 sm:p-6 text-left">
                <h2 className="text-lg font-bold text-white mb-2">Summary</h2>
                <p className="text-white/75 text-sm sm:text-base leading-relaxed">{summary}</p>
              </GlassCard>
            )}

            <div className="space-y-4">
              {jobs.map((job, i) => (
                <GlassCard key={`${job.title}-${i}`} className="p-5 sm:p-6 text-left border border-white/15">
                  <div className="flex gap-3 items-start mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center font-black text-slate-900 shrink-0">
                      {i + 1}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-white break-anywhere">
                        {job.title}
                      </h3>
                      <p className="text-amber-200/90 text-sm mt-1">
                        {job.sector || "Private / Government"}
                        {job.fit ? ` · Fit ${job.fit}` : ""}
                      </p>
                    </div>
                  </div>
                  {job.why && (
                    <p className="text-white/70 text-sm leading-relaxed mb-4">{job.why}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {(job.apply_links || []).map((link, li) => (
                      <a
                        key={`${link.url}-${li}`}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-500/25 hover:bg-sky-500/40 border border-sky-300/40 text-white text-xs sm:text-sm font-semibold"
                      >
                        {link.portal || "Apply"}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ))}
                  </div>
                </GlassCard>
              ))}
            </div>

            {portals.length > 0 && (
              <GlassCard className="p-5 sm:p-6 text-left">
                <h2 className="text-lg font-bold text-white mb-3">Useful Pakistan portals</h2>
                <div className="flex flex-wrap gap-2">
                  {portals.map((p, i) => (
                    <a
                      key={`${p.name}-${i}`}
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl glass-card hover:bg-white/15 text-white text-sm"
                    >
                      {p.name}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ))}
                </div>
              </GlassCard>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <AnimatedButton
                className="btn-career"
                onClick={() => {
                  resetAssessment();
                  navigate("/guidance");
                }}
              >
                Choose another guidance
              </AnimatedButton>
              <AnimatedButton
                className="glass-card px-6 py-3 hover:bg-white/15"
                onClick={() => navigate("/jobs-guidance")}
              >
                Run jobs again
              </AnimatedButton>
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="fixed top-16 sm:top-24 left-2 sm:left-4 z-30 p-2.5 rounded-full glass-card hover:bg-white/20"
        aria-label="Back"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
    </div>
  );
}

export default JobsResult;
