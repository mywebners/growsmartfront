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
  const { guidanceType, resetAssessment } = useContext(AuthContext);

  const existing = location.state?.result;
  const [result, setResult] = useState(existing || null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (existing) {
      setResult(existing);
      setError("");
      return;
    }
    if (guidanceType !== "jobs") {
      navigate("/jobs-guidance", { replace: true });
      return;
    }
    setError("No job result found. Please enter your field or program first.");
  }, [existing, guidanceType, navigate]);

  const jobs = result?.jobs || [];
  const portals = result?.portals || [];
  const summary = result?.summary || "";

  return (
    <div className="min-h-screen pt-8 sm:pt-10 pb-16 px-3 sm:px-4">
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
          <p className="text-[#5b5b5b] text-sm sm:text-base leading-relaxed">
            Pakistan government + private portals — based on your field/program (OpenAI).
          </p>
        </motion.div>

        {error && (
          <GlassCard className="p-6 text-center mb-6">
            <p className="text-[#c62828] mb-4">{error}</p>
            <AnimatedButton className="btn-career" onClick={() => navigate("/jobs-guidance")}>
              Back to Jobs guidance
            </AnimatedButton>
          </GlassCard>
        )}

        {!error && result && (
          <>
            {summary ? (
              <GlassCard className="p-5 sm:p-6 mb-5 text-left">
                <h2 className="text-lg font-bold text-[#1a1a1a] mb-2">Summary</h2>
                <p className="text-[#5b5b5b] leading-relaxed">{summary}</p>
              </GlassCard>
            ) : null}

            <div className="space-y-4 mb-6">
              {jobs.map((job, idx) => (
                <GlassCard key={`${job.title}-${idx}`} className="p-5 sm:p-6 text-left">
                  <div className="flex gap-3 items-start mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0056d2] to-[#378edd] flex items-center justify-center font-black text-white shrink-0">
                      {idx + 1}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-[#1a1a1a] break-anywhere">
                        {job.title}
                      </h3>
                      <p className="text-sm text-[#6a6a6a]">
                        {job.sector || "Government / Private"}
                        {job.fit ? ` · Fit: ${job.fit}` : ""}
                      </p>
                    </div>
                  </div>
                  {job.why ? (
                    <p className="text-[#5b5b5b] text-sm sm:text-base mb-4 leading-relaxed">
                      {job.why}
                    </p>
                  ) : null}
                  <div className="flex flex-wrap gap-2">
                    {(job.apply_links || []).map((link, i) => (
                      <a
                        key={`${link.url}-${i}`}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 border border-sky-500 text-white text-xs sm:text-sm font-semibold"
                      >
                        {link.portal || "Apply"}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ))}
                  </div>
                </GlassCard>
              ))}
            </div>

            {portals.length > 0 ? (
              <GlassCard className="p-5 sm:p-6 mb-6 text-left">
                <h2 className="text-lg font-bold text-[#1a1a1a] mb-3">Useful Pakistan portals</h2>
                <div className="flex flex-wrap gap-2">
                  {portals.map((p, i) => (
                    <a
                      key={`${p.url}-${i}`}
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl glass-card hover:bg-[#0056d2]/10 text-[#1a1a1a] text-sm"
                    >
                      {p.name}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ))}
                </div>
              </GlassCard>
            ) : null}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <AnimatedButton
                className="glass-card px-6 py-3 hover:bg-[#0056d2]/10"
                onClick={() => navigate("/jobs-guidance")}
              >
                <ArrowLeft className="w-4 h-4 inline mr-2" />
                Try again
              </AnimatedButton>
              <AnimatedButton
                className="btn-career px-6 py-3"
                onClick={() => {
                  resetAssessment();
                  navigate("/guidance");
                }}
              >
                Back to guidance hub
              </AnimatedButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default JobsResult;
