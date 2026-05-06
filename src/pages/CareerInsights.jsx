import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";

function normalizeInsightsPayload(raw) {
  if (!raw || typeof raw !== "object") return null;

  let degrees = Array.isArray(raw.degrees) ? raw.degrees.map(String).filter(Boolean) : [];
  let topUniversities = Array.isArray(raw.top_universities)
    ? raw.top_universities.map(String).filter(Boolean)
    : [];

  let jobProficiency = Array.isArray(raw.job_proficiency) ? [...raw.job_proficiency] : [];

  if (!degrees.length && Array.isArray(raw.related_fields)) {
    degrees = raw.related_fields.map((x) => String(x.field || "").trim()).filter(Boolean);
    jobProficiency = raw.related_fields.map((x) => ({
      degree: String(x.field || "").trim(),
      percentage: Number(x.percentage) || 0,
    }));
  }

  jobProficiency = jobProficiency
    .map((row) => ({
      degree: String(row.degree || row.field || "").trim(),
      percentage: Math.max(1, Math.min(100, Math.round(Number(row.percentage) || 0))),
    }))
    .filter((row) => row.degree && row.percentage > 0);

  if (degrees.length && jobProficiency.length < degrees.length) {
    const byDeg = new Map(jobProficiency.map((r) => [r.degree.toLowerCase(), r.percentage]));
    jobProficiency = degrees.map((d, i) => ({
      degree: d,
      percentage:
        byDeg.get(d.toLowerCase()) ||
        jobProficiency[i]?.percentage ||
        Math.max(35, 72 - i * 8),
    }));
  }

  if (degrees.length && jobProficiency.length === 0) {
    jobProficiency = degrees.map((d, i) => ({
      degree: d,
      percentage: Math.max(38, 78 - i * 7),
    }));
  }

  const institutes = Array.isArray(raw.institutes)
    ? raw.institutes.map(String).filter(Boolean)
    : [];

  return {
    career: raw.career,
    degrees,
    top_universities: topUniversities.slice(0, 10),
    job_proficiency: jobProficiency,
    institutes,
  };
}

function CareerInsights() {
  const location = useLocation();
  const navigate = useNavigate();
  const career = location.state?.career;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  const normalized = useMemo(() => normalizeInsightsPayload(data), [data]);

  useEffect(() => {
    if (!career) {
      navigate("/result", { replace: true });
      return;
    }

    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("http://127.0.0.1:5000/career-insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ career }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Could not fetch insights.");
        setData(json);
      } catch (err) {
        setError(err.message || "Failed to load insights.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [career, navigate]);

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-16 sm:pb-20 px-3 xs:px-4 max-[320px]:px-2">
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 text-center sm:text-left">
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm text-emerald-300/90 font-semibold uppercase tracking-wide mb-2">
              Pakistan career roadmap
            </p>
            <h1 className="text-xl min-[321px]:text-2xl sm:text-3xl md:text-4xl font-black text-white break-anywhere leading-tight">
              <span className="text-emerald-300">{career || "Career"}</span>
            </h1>
            <p className="text-white/60 text-sm mt-2 max-w-2xl mx-auto sm:mx-0">
              Degrees common in Pakistan, strongest universities for those pathways, then job-market alignment by degree.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2.5 sm:p-3 rounded-full glass-card hover:bg-white/20 transition-all shrink-0 mx-auto sm:mx-0 sm:mt-1"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {loading && (
          <GlassCard className="p-6 sm:p-8 text-center text-white/80">
            Loading degrees, universities, and Pakistan job-market signals…
          </GlassCard>
        )}

        {error && (
          <GlassCard className="p-6 sm:p-8 text-center text-red-200 border-red-300/40">{error}</GlassCard>
        )}

        {!loading && !error && normalized && (
          <div className="space-y-5 sm:space-y-6">
            <GlassCard className="p-4 sm:p-6 md:p-7 !rounded-2xl sm:!rounded-3xl">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 text-center sm:text-left">
                Related degrees in Pakistan
              </h2>
              <ol className="grid gap-2 sm:gap-3 sm:grid-cols-2">
                {(normalized.degrees.length ? normalized.degrees : []).map((name, i) => (
                  <li
                    key={`${name}-${i}`}
                    className="bg-white/10 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-white/90 text-sm sm:text-base break-anywhere flex gap-2"
                  >
                    <span className="text-emerald-400 font-black shrink-0">{i + 1}.</span>
                    <span>{name}</span>
                  </li>
                ))}
              </ol>
              {!normalized.degrees.length && (
                <p className="text-white/55 text-sm text-center">No degree list returned.</p>
              )}
            </GlassCard>

            <GlassCard className="p-4 sm:p-6 md:p-7 !rounded-2xl sm:!rounded-3xl">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 text-center sm:text-left">
                Top universities in Pakistan (up to 10 — strongest fit for these degrees)
              </h2>
              <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-2">
                {(normalized.top_universities.length ? normalized.top_universities : []).map((name, i) => (
                  <li
                    key={`${name}-${i}`}
                    className="bg-white/10 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-white/90 text-sm sm:text-base break-anywhere flex gap-2"
                  >
                    <span className="text-violet-300 font-black shrink-0">{i + 1}.</span>
                    <span>{name}</span>
                  </li>
                ))}
              </ol>
              {!normalized.top_universities.length && (
                <p className="text-white/55 text-sm text-center">No universities returned.</p>
              )}
            </GlassCard>

            <GlassCard className="p-4 sm:p-6 md:p-7 !rounded-2xl sm:!rounded-3xl">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 text-center sm:text-left">
                Job proficiency by degree (Pakistan — approximate %)
              </h2>
              <div className="space-y-4 max-w-3xl mx-auto sm:mx-0 sm:max-w-none">
                {(normalized.job_proficiency.length ? normalized.job_proficiency : []).map((item, i) => (
                  <div key={`${item.degree}-${i}`}>
                    <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1 xs:gap-3 mb-2">
                      <p className="text-white text-sm sm:text-base break-anywhere text-center xs:text-left flex-1">
                        {item.degree}
                      </p>
                      <p className="text-emerald-300 font-bold text-center xs:text-right shrink-0">
                        {item.percentage}%
                      </p>
                    </div>
                    <div className="h-2.5 sm:h-3 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 1.05, delay: i * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {!normalized.job_proficiency.length && (
                <p className="text-white/55 text-sm text-center">No job proficiency rows returned.</p>
              )}
            </GlassCard>

            {normalized.institutes.length > 0 && (
              <GlassCard className="p-4 sm:p-6 md:p-7 !rounded-2xl sm:!rounded-3xl">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 text-center sm:text-left">
                  Vocational & skills institutes
                </h2>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {normalized.institutes.map((name, i) => (
                    <li
                      key={`${name}-${i}`}
                      className="bg-white/10 rounded-xl px-3 py-2.5 text-white/85 text-sm break-anywhere"
                    >
                      {i + 1}. {name}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            )}

            <div className="flex justify-center sm:justify-start pt-2">
              <AnimatedButton
                onClick={() => navigate("/history")}
                className="w-full max-w-sm sm:max-w-xs px-6 py-3.5 sm:py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-bold text-sm sm:text-base"
              >
                View history
              </AnimatedButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CareerInsights;
