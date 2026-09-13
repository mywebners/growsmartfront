import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";

function JobsBachelor() {
  const navigate = useNavigate();
  const {
    guidanceType,
    jobsGoal,
    matricStream,
    matricMarks,
    intermediateStream,
    intermediateMarks,
  } = useContext(AuthContext);

  const [degree, setDegree] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [transcriptPreview, setTranscriptPreview] = useState("");
  const [transcriptBase64, setTranscriptBase64] = useState("");
  const [loading, setLoading] = useState(false);

  if (guidanceType !== "jobs" || jobsGoal !== "bachelor") {
    return (
      <div className="min-h-screen pt-28 px-4 flex items-center justify-center">
        <GlassCard className="p-8 text-center max-w-md">
          <p className="text-white mb-6">Start from Jobs guidance and choose Bachelor.</p>
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
    if (!degree.trim() && !transcriptBase64) {
      alert("Enter your Bachelor degree/program OR upload a transcript photo.");
      return;
    }
    if (cgpa && (Number(cgpa) < 0 || Number(cgpa) > 4)) {
      alert("CGPA should be between 0 and 4 (or leave blank if using transcript).");
      return;
    }

    setLoading(true);
    const payload = {
      education_level: "bachelor",
      matric_stream: matricStream,
      matric_marks: matricMarks?.[matricStream] || {},
      intermediate_stream: intermediateStream,
      intermediate_marks: intermediateMarks?.[intermediateStream] || {},
      bachelor_degree: degree.trim(),
      bachelor_cgpa: cgpa ? Number(cgpa) : null,
      transcript_image: transcriptBase64 || null,
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
    <div className="min-h-screen pt-24 sm:pt-28 pb-16 px-3 sm:px-4">
      <div className="max-w-xl mx-auto">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-5xl mb-3">🏛️</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-career-gradient mb-2">
            Bachelor details
          </h1>
          <p className="text-white/70">
            Degree / CGPA likho — ya transcript ki photo upload karo.
          </p>
        </motion.div>

        <GlassCard className="p-6 sm:p-8 space-y-5">
          <div>
            <label className="block text-white/70 text-sm mb-2">Bachelor program / degree</label>
            <input
              className="input-field"
              placeholder="e.g. BS Computer Science, BBA, BS Software Engineering"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-white/70 text-sm mb-2">CGPA (optional, out of 4.0)</label>
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
            <label className="block text-white/70 text-sm mb-2">
              Or upload transcript photo (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={onFile}
              className="block w-full text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-amber-500/30 file:text-white"
            />
            {transcriptPreview && (
              <img
                src={transcriptPreview}
                alt="Transcript preview"
                className="mt-4 rounded-2xl border border-white/20 max-h-56 mx-auto object-contain"
              />
            )}
          </div>

          <AnimatedButton
            onClick={handleSubmit}
            disabled={loading}
            className="w-full btn-career py-4 text-lg font-bold disabled:opacity-50"
          >
            {loading ? "Finding Pakistan jobs…" : "Get job apply links"}
          </AnimatedButton>
        </GlassCard>
      </div>
    </div>
  );
}

export default JobsBachelor;
