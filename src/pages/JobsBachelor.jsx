import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";

const LEVEL_COPY = {
  matric: {
    icon: "🎓",
    title: "Matric qualification",
    label: "Matric field / program",
    placeholder: "e.g. Science, Arts, Computer Science, Technical",
    hint: "Which field or program did you complete in Matric?",
  },
  inter: {
    icon: "📘",
    title: "Intermediate qualification",
    label: "Intermediate field / program",
    placeholder: "e.g. Pre-Engineering, Pre-Medical, ICS, I.Com, FA, FSc",
    hint: "Which field or program did you complete in Intermediate?",
  },
  bachelor: {
    icon: "🏛️",
    title: "Bachelor qualification",
    label: "Bachelor field / program",
    placeholder: "e.g. BS Computer Science, BBA, BS Software Engineering, BA English",
    hint: "Enter your degree/program, CGPA or marks, and optionally upload your transcript.",
  },
};

function JobsBachelor() {
  const navigate = useNavigate();
  const { guidanceType, jobsGoal } = useContext(AuthContext);
  const [fieldOrProgram, setFieldOrProgram] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [percentage, setPercentage] = useState("");
  const [transcriptPreview, setTranscriptPreview] = useState("");
  const [transcriptBase64, setTranscriptBase64] = useState("");
  const [loading, setLoading] = useState(false);

  const level = jobsGoal || "bachelor";
  const copy = LEVEL_COPY[level] || LEVEL_COPY.bachelor;
  const isBachelor = level === "bachelor";

  if (guidanceType !== "jobs" || !LEVEL_COPY[level]) {
    return (
      <div className="min-h-screen pt-28 px-4 flex items-center justify-center">
        <GlassCard className="p-8 text-center max-w-md">
          <p className="text-[#1a1a1a] mb-6">Start from Jobs guidance and choose your level.</p>
          <AnimatedButton className="btn-career" onClick={() => navigate("/jobs-guidance")}>
            Jobs guidance
          </AnimatedButton>
        </GlassCard>
      </div>
    );
  }

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload a transcript image (JPG/PNG).");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      alert("Image must be under 4MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      setTranscriptPreview(result);
      setTranscriptBase64(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    const value = fieldOrProgram.trim();
    if (!value) {
      alert("Please enter your field or program.");
      return;
    }

    if (isBachelor) {
      if (!cgpa && !percentage && !transcriptBase64) {
        alert("For Bachelor, enter CGPA or marks/percentage, or upload a transcript photo.");
        return;
      }
      if (cgpa && (Number(cgpa) < 0 || Number(cgpa) > 4)) {
        alert("CGPA should be between 0 and 4.0.");
        return;
      }
      if (percentage && (Number(percentage) < 0 || Number(percentage) > 100)) {
        alert("Percentage should be between 0 and 100.");
        return;
      }
    }

    setLoading(true);
    const payload = {
      education_level: level,
      field_or_program: value,
      matric_stream: level === "matric" ? value : null,
      intermediate_stream: level === "inter" ? value : null,
      bachelor_degree: level === "bachelor" ? value : null,
      matric_marks: {},
      intermediate_marks: {},
      bachelor_cgpa: isBachelor && cgpa ? Number(cgpa) : null,
      bachelor_percentage: isBachelor && percentage ? Number(percentage) : null,
      transcript_image: isBachelor ? transcriptBase64 || null : null,
    };

    try {
      const res = await fetch("http://127.0.0.1:5000/jobs-guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Could not get job guidance.");
        setLoading(false);
        return;
      }
      navigate("/jobs/result", { replace: true, state: { result: data, payload } });
    } catch {
      alert("Cannot reach server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-8 sm:pt-10 pb-16 px-3 sm:px-4">
      <div className="max-w-xl mx-auto">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-5xl mb-3">{copy.icon}</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-career-gradient mb-2">
            {copy.title}
          </h1>
          <p className="text-[#5b5b5b]">{copy.hint}</p>
        </motion.div>

        <GlassCard className="p-6 sm:p-8 space-y-5">
          <div>
            <label className="block text-[#5b5b5b] text-sm mb-2">{copy.label}</label>
            <input
              className="input-field"
              placeholder={copy.placeholder}
              value={fieldOrProgram}
              onChange={(e) => setFieldOrProgram(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isBachelor) handleSubmit();
              }}
            />
          </div>

          {isBachelor ? (
            <>
              <div>
                <label className="block text-[#5b5b5b] text-sm mb-2">
                  CGPA (out of 4.0)
                </label>
                <input
                  className="input-field"
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  placeholder="e.g. 3.2"
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[#5b5b5b] text-sm mb-2">
                  Or marks / percentage
                </label>
                <input
                  className="input-field"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="e.g. 78"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[#5b5b5b] text-sm mb-2">
                  Upload transcript photo (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onFile}
                  className="block w-full text-sm text-[#5b5b5b] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-[#0056d2]/15 file:text-[#0056d2] file:font-semibold"
                />
                {transcriptPreview ? (
                  <img
                    src={transcriptPreview}
                    alt="Transcript preview"
                    className="mt-4 rounded-2xl border border-[#d9d9d9] max-h-56 mx-auto object-contain"
                  />
                ) : null}
              </div>
            </>
          ) : (
            <p className="text-sm text-[#6a6a6a]">
              No subject marks or percentage needed — only your qualification field/program.
            </p>
          )}

          <AnimatedButton
            onClick={handleSubmit}
            disabled={loading}
            className="w-full btn-career py-4 text-lg font-bold disabled:opacity-50"
          >
            {loading ? "Finding Pakistan jobs…" : "Get job apply links"}
          </AnimatedButton>

          <button
            type="button"
            className="w-full text-sm text-[#6a6a6a] hover:text-[#1a1a1a]"
            onClick={() => navigate("/jobs-guidance")}
          >
            ← Change education level
          </button>
        </GlassCard>
      </div>
    </div>
  );
}

export default JobsBachelor;
