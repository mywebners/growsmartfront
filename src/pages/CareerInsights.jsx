import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";
import { resolveUniversityPortal } from "../utils/pakistanUniversities";

function normalizeInsightsPayload(raw) {
  if (!raw || typeof raw !== "object") return null;

  let degrees = Array.isArray(raw.degrees) ? raw.degrees.map(String).filter(Boolean) : [];
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

  let universities = [];
  if (Array.isArray(raw.universities) && raw.universities.length) {
    universities = raw.universities
      .map((u) => {
        if (typeof u === "string") {
          return {
            name: u,
            url: resolveUniversityPortal(u, ""),
            programs: [],
            note: "",
          };
        }
        const name = String(u?.name || u?.university || "").trim();
        if (!name) return null;
        return {
          name,
          url: resolveUniversityPortal(name, u?.url || u?.portal || u?.link),
          programs: Array.isArray(u?.programs)
            ? u.programs.map(String).filter(Boolean)
            : [],
          note: String(u?.note || u?.why || "").trim(),
        };
      })
      .filter(Boolean);
  } else if (Array.isArray(raw.top_universities)) {
    universities = raw.top_universities.map((name) => ({
      name: String(name),
      url: resolveUniversityPortal(String(name), ""),
      programs: [],
      note: "",
    }));
  }

  return {
    career: raw.career,
    degrees,
    universities: universities.slice(0, 10),
    job_proficiency: jobProficiency,
    institutes,
    source: raw.source,
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
              Pakistan Guide · AI via OPENAI_API_KEY (.env)
            </p>
            <h1 className="text-xl min-[321px]:text-2xl sm:text-3xl md:text-4xl font-black text-white break-anywhere leading-tight">
              <span className="text-emerald-300">{career || "Career"}</span>
            </h1>
            <p className="text-white/60 text-sm mt-2 max-w-2xl mx-auto sm:mx-0">
              Degrees, universities that teach them in Pakistan, and direct portal links so you can open the official site in one click.
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
            Asking AI for Pakistan universities, programs, and portal links…
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
            </GlassCard>

            <GlassCard className="p-4 sm:p-6 md:p-7 !rounded-2xl sm:!rounded-3xl">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 text-center sm:text-left">
                Universities in Pakistan for this career
              </h2>
              <p className="text-white/55 text-xs sm:text-sm mb-5 text-center sm:text-left">
                Tap Open portal to go straight to the university website.
              </p>
              <div className="space-y-3">
                {(normalized.universities.length ? normalized.universities : []).map((uni, i) => (
                  <div
                    key={`${uni.name}-${i}`}
                    className="bg-white/10 rounded-2xl px-4 py-4 border border-white/15 text-left"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-bold text-base sm:text-lg break-anywhere">
                          <span className="text-violet-300 mr-2">{i + 1}.</span>
                          {uni.name}
                        </p>
                        {uni.programs?.length > 0 && (
                          <p className="text-emerald-200/90 text-sm mt-2">
                            Offers: {uni.programs.join(" · ")}
                          </p>
                        )}
                        {uni.note && (
                          <p className="text-white/60 text-sm mt-1.5 leading-relaxed">{uni.note}</p>
                        )}
                      </div>
                      <a
                        href={uni.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 shrink-0 px-4 py-2.5 rounded-xl bg-sky-500/25 hover:bg-sky-500/40 border border-sky-300/40 text-white text-sm font-semibold transition-colors"
                      >
                        Open portal
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <p className="text-white/35 text-[11px] sm:text-xs mt-2 break-all">{uni.url}</p>
                  </div>
                ))}
              </div>
              {!normalized.universities.length && (
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

            <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start pt-2">
              <AnimatedButton
                onClick={async () => {
                  try {
                    const res = await fetch(
                      `http://127.0.0.1:5000/career-scope?career=${encodeURIComponent(career)}`
                    );
                    const json = await res.json();
                    if (!json?.success) {
                      alert(json?.message || "Could not load job scope.");
                      return;
                    }
                    navigate("/career-scope", { state: { career, scope: json } });
                  } catch {
                    alert("Cannot reach server for job scope.");
                  }
                }}
                className="w-full max-w-sm px-6 py-3.5 glass-card hover:bg-white/15 text-white rounded-2xl font-bold text-sm"
              >
                Also see Job Scope %
              </AnimatedButton>
              <AnimatedButton
                onClick={() => navigate("/history")}
                className="w-full max-w-sm px-6 py-3.5 sm:py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-bold text-sm sm:text-base"
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
