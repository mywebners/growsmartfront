import React, { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";
import { saveUserGuidance } from "../utils/api";

function CvResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;
  const payload = location.state?.payload;
  const savedRef = useRef(false);

  useEffect(() => {
    if (!result || savedRef.current) return;
    savedRef.current = true;
    (async () => {
      try {
        await saveUserGuidance({
          type: "cv",
          title: result.header?.full_name || result.header?.headline || "US CV",
          cvResult: {
            header: result.header,
            summary: result.summary,
            skills: result.skills,
            plain_text: result.plain_text,
          },
          payload: payload || {},
        });
      } catch (err) {
        console.error("Failed to save CV to account:", err);
        savedRef.current = false;
      }
    })();
  }, [result, payload]);

  const header = result?.header || {};
  const contactLine = useMemo(() => {
    return [
      header.email,
      header.phone,
      header.location,
      header.linkedin,
      header.portfolio,
    ]
      .filter(Boolean)
      .join(" · ");
  }, [header]);

  if (!result) {
    return (
      <div className="min-h-screen pt-16 px-4 flex items-center justify-center">
        <GlassCard className="p-8 text-center max-w-md">
          <p className="text-[#1a1a1a] mb-5">No CV found. Please fill the form first.</p>
          <AnimatedButton className="btn-career" onClick={() => navigate("/cv-maker")}>
            Open CV Maker
          </AnimatedButton>
        </GlassCard>
      </div>
    );
  }

  const downloadTxt = () => {
    const blob = new Blob([result.plain_text || ""], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(header.full_name || "GrowSmart_CV").replace(/\s+/g, "_")}_US_Resume.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(result.plain_text || "");
      alert("CV copied to clipboard.");
    } catch {
      alert("Could not copy. Please download instead.");
    }
  };

  return (
    <div className="min-h-screen pt-8 sm:pt-10 pb-16 px-3 sm:px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-career-gradient mb-2">
            Your US-based CV
          </h1>
          <p className="text-[#5b5b5b]">AI-generated ATS-friendly resume ready to use.</p>
        </motion.div>

        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <AnimatedButton className="btn-career px-5 py-3" onClick={downloadTxt}>
            Download .txt
          </AnimatedButton>
          <AnimatedButton className="btn-career px-5 py-3" onClick={copyText}>
            Copy text
          </AnimatedButton>
          <AnimatedButton
            className="btn-career px-5 py-3"
            onClick={() => window.print()}
          >
            Print / Save PDF
          </AnimatedButton>
          <button
            type="button"
            className="glass-card px-5 py-3 font-semibold hover:bg-[#0056d2]/10"
            onClick={() => navigate("/cv-maker")}
          >
            Edit & regenerate
          </button>
        </div>

        <GlassCard className="p-6 sm:p-8 cv-print-sheet text-left">
          <header className="border-b border-[#d9d9d9] pb-4 mb-5">
            <h2 className="text-3xl font-extrabold text-[#0f1f3d]">
              {header.full_name || "Your Name"}
            </h2>
            {header.headline ? (
              <p className="text-[#0056d2] font-semibold mt-1">{header.headline}</p>
            ) : null}
            {contactLine ? (
              <p className="text-sm text-[#5b5b5b] mt-2 break-anywhere">{contactLine}</p>
            ) : null}
          </header>

          {result.summary ? (
            <section className="mb-5">
              <h3 className="text-sm font-bold tracking-wider uppercase text-[#0056d2] mb-2">
                Professional Summary
              </h3>
              <p className="text-[#1a1a1a] leading-relaxed">{result.summary}</p>
            </section>
          ) : null}

          {result.skills?.length ? (
            <section className="mb-5">
              <h3 className="text-sm font-bold tracking-wider uppercase text-[#0056d2] mb-2">
                Skills
              </h3>
              <p className="text-[#1a1a1a]">{result.skills.join(" · ")}</p>
            </section>
          ) : null}

          {result.experience?.length ? (
            <section className="mb-5">
              <h3 className="text-sm font-bold tracking-wider uppercase text-[#0056d2] mb-3">
                Experience
              </h3>
              <div className="space-y-4">
                {result.experience.map((item, idx) => (
                  <div key={`exp-${idx}`}>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                      <p className="font-bold text-[#1a1a1a]">
                        {item.title}
                        {item.company ? ` — ${item.company}` : ""}
                      </p>
                      <p className="text-sm text-[#6a6a6a]">{item.dates}</p>
                    </div>
                    {(item.location || "") && (
                      <p className="text-sm text-[#6a6a6a] mb-1">{item.location}</p>
                    )}
                    <ul className="list-disc pl-5 space-y-1 text-[#1a1a1a]">
                      {(item.bullets || []).map((b, i) => (
                        <li key={`b-${idx}-${i}`}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {result.education?.length ? (
            <section className="mb-5">
              <h3 className="text-sm font-bold tracking-wider uppercase text-[#0056d2] mb-3">
                Education
              </h3>
              <div className="space-y-3">
                {result.education.map((item, idx) => (
                  <div key={`edu-${idx}`}>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                      <p className="font-bold text-[#1a1a1a]">
                        {item.degree}
                        {item.school ? ` — ${item.school}` : ""}
                      </p>
                      <p className="text-sm text-[#6a6a6a]">{item.dates}</p>
                    </div>
                    {item.location ? (
                      <p className="text-sm text-[#6a6a6a]">{item.location}</p>
                    ) : null}
                    {item.details ? (
                      <p className="text-sm text-[#1a1a1a]">{item.details}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {result.projects?.length ? (
            <section className="mb-5">
              <h3 className="text-sm font-bold tracking-wider uppercase text-[#0056d2] mb-3">
                Projects
              </h3>
              <div className="space-y-3">
                {result.projects.map((item, idx) => (
                  <div key={`proj-${idx}`}>
                    <p className="font-bold text-[#1a1a1a]">{item.name}</p>
                    {item.description ? (
                      <p className="text-[#1a1a1a]">{item.description}</p>
                    ) : null}
                    {item.tech ? (
                      <p className="text-sm text-[#6a6a6a]">Tech: {item.tech}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {result.certifications?.length ? (
            <section className="mb-5">
              <h3 className="text-sm font-bold tracking-wider uppercase text-[#0056d2] mb-2">
                Certifications
              </h3>
              <ul className="list-disc pl-5 text-[#1a1a1a]">
                {result.certifications.map((item, idx) => (
                  <li key={`cert-${idx}`}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {result.languages?.length ? (
            <section className="mb-5">
              <h3 className="text-sm font-bold tracking-wider uppercase text-[#0056d2] mb-2">
                Languages
              </h3>
              <p className="text-[#1a1a1a]">{result.languages.join(" · ")}</p>
            </section>
          ) : null}

          {result.achievements?.length ? (
            <section>
              <h3 className="text-sm font-bold tracking-wider uppercase text-[#0056d2] mb-2">
                Achievements
              </h3>
              <ul className="list-disc pl-5 text-[#1a1a1a]">
                {result.achievements.map((item, idx) => (
                  <li key={`ach-${idx}`}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}
        </GlassCard>
      </div>
    </div>
  );
}

export default CvResult;
