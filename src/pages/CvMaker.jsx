import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";

const emptyEducation = () => ({
  school: "",
  degree: "",
  location: "",
  dates: "",
  details: "",
});

const emptyExperience = () => ({
  title: "",
  company: "",
  location: "",
  dates: "",
  bullets: "",
});

function CvMaker() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    portfolio: "",
    target_role: "",
    summary_notes: "",
    skills: "",
    projects: "",
    certifications: "",
    languages: "",
    achievements: "",
  });
  const [education, setEducation] = useState([emptyEducation()]);
  const [experience, setExperience] = useState([emptyExperience()]);

  const canSubmit = useMemo(
    () => form.full_name.trim() && form.email.trim() && form.target_role.trim(),
    [form.full_name, form.email, form.target_role]
  );

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateEducation = (index, key, value) => {
    setEducation((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  };

  const updateExperience = (index, key, value) => {
    setExperience((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) {
      alert("Please fill Full Name, Email, and Target Role.");
      return;
    }

    const payload = {
      ...form,
      education: education.filter((item) => item.school.trim() || item.degree.trim()),
      experience: experience
        .filter((item) => item.title.trim() || item.company.trim())
        .map((item) => ({
          ...item,
          bullets: item.bullets
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean),
        })),
    };

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/cv-maker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Could not generate CV.");
        return;
      }
      navigate("/cv/result", { replace: true, state: { result: data, payload } });
    } catch {
      alert("Cannot reach server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-8 sm:pt-10 pb-16 px-3 sm:px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-5xl mb-3">📄</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-career-gradient mb-2">
            AI CV Maker
          </h1>
          <p className="text-[#5b5b5b] max-w-2xl mx-auto">
            Enter your complete information. We will generate a professional{" "}
            <strong>US-based</strong> resume with AI.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <GlassCard className="p-6 sm:p-8 space-y-8">
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#1a1a1a]">Personal information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  className="input-field"
                  placeholder="Full name *"
                  value={form.full_name}
                  onChange={(e) => updateForm("full_name", e.target.value)}
                />
                <input
                  className="input-field"
                  type="email"
                  placeholder="Email *"
                  value={form.email}
                  onChange={(e) => updateForm("email", e.target.value)}
                />
                <input
                  className="input-field"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) => updateForm("phone", e.target.value)}
                />
                <input
                  className="input-field"
                  placeholder="Location (City, State / Country)"
                  value={form.location}
                  onChange={(e) => updateForm("location", e.target.value)}
                />
                <input
                  className="input-field"
                  placeholder="LinkedIn URL"
                  value={form.linkedin}
                  onChange={(e) => updateForm("linkedin", e.target.value)}
                />
                <input
                  className="input-field"
                  placeholder="Portfolio / GitHub"
                  value={form.portfolio}
                  onChange={(e) => updateForm("portfolio", e.target.value)}
                />
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#1a1a1a]">Career target</h2>
              <input
                className="input-field"
                placeholder="Target role / job title * (e.g. Software Engineer)"
                value={form.target_role}
                onChange={(e) => updateForm("target_role", e.target.value)}
              />
              <textarea
                className="input-field min-h-[100px]"
                placeholder="Short notes about your strengths, goals, or achievements"
                value={form.summary_notes}
                onChange={(e) => updateForm("summary_notes", e.target.value)}
              />
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-[#1a1a1a]">Education</h2>
                <button
                  type="button"
                  className="text-sm font-semibold text-[#0056d2]"
                  onClick={() => setEducation((prev) => [...prev, emptyEducation()])}
                >
                  + Add education
                </button>
              </div>
              {education.map((item, index) => (
                <div key={`edu-${index}`} className="grid sm:grid-cols-2 gap-3 p-4 rounded-xl border border-[#d9d9d9] bg-[#f8fbff]">
                  <input
                    className="input-field"
                    placeholder="School / University"
                    value={item.school}
                    onChange={(e) => updateEducation(index, "school", e.target.value)}
                  />
                  <input
                    className="input-field"
                    placeholder="Degree / Program"
                    value={item.degree}
                    onChange={(e) => updateEducation(index, "degree", e.target.value)}
                  />
                  <input
                    className="input-field"
                    placeholder="Location"
                    value={item.location}
                    onChange={(e) => updateEducation(index, "location", e.target.value)}
                  />
                  <input
                    className="input-field"
                    placeholder="Dates (e.g. 2021 – 2025)"
                    value={item.dates}
                    onChange={(e) => updateEducation(index, "dates", e.target.value)}
                  />
                  <input
                    className="input-field sm:col-span-2"
                    placeholder="Details (GPA, honors, coursework)"
                    value={item.details}
                    onChange={(e) => updateEducation(index, "details", e.target.value)}
                  />
                </div>
              ))}
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-[#1a1a1a]">Experience</h2>
                <button
                  type="button"
                  className="text-sm font-semibold text-[#0056d2]"
                  onClick={() => setExperience((prev) => [...prev, emptyExperience()])}
                >
                  + Add experience
                </button>
              </div>
              {experience.map((item, index) => (
                <div key={`exp-${index}`} className="grid sm:grid-cols-2 gap-3 p-4 rounded-xl border border-[#d9d9d9] bg-[#f8fbff]">
                  <input
                    className="input-field"
                    placeholder="Job title"
                    value={item.title}
                    onChange={(e) => updateExperience(index, "title", e.target.value)}
                  />
                  <input
                    className="input-field"
                    placeholder="Company"
                    value={item.company}
                    onChange={(e) => updateExperience(index, "company", e.target.value)}
                  />
                  <input
                    className="input-field"
                    placeholder="Location"
                    value={item.location}
                    onChange={(e) => updateExperience(index, "location", e.target.value)}
                  />
                  <input
                    className="input-field"
                    placeholder="Dates (e.g. Jun 2023 – Present)"
                    value={item.dates}
                    onChange={(e) => updateExperience(index, "dates", e.target.value)}
                  />
                  <textarea
                    className="input-field sm:col-span-2 min-h-[90px]"
                    placeholder="Key achievements (one bullet per line)"
                    value={item.bullets}
                    onChange={(e) => updateExperience(index, "bullets", e.target.value)}
                  />
                </div>
              ))}
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#1a1a1a]">Skills & extras</h2>
              <textarea
                className="input-field min-h-[80px]"
                placeholder="Skills (comma separated)"
                value={form.skills}
                onChange={(e) => updateForm("skills", e.target.value)}
              />
              <textarea
                className="input-field min-h-[80px]"
                placeholder="Projects"
                value={form.projects}
                onChange={(e) => updateForm("projects", e.target.value)}
              />
              <textarea
                className="input-field min-h-[70px]"
                placeholder="Certifications"
                value={form.certifications}
                onChange={(e) => updateForm("certifications", e.target.value)}
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  className="input-field"
                  placeholder="Languages"
                  value={form.languages}
                  onChange={(e) => updateForm("languages", e.target.value)}
                />
                <input
                  className="input-field"
                  placeholder="Achievements / awards"
                  value={form.achievements}
                  onChange={(e) => updateForm("achievements", e.target.value)}
                />
              </div>
            </section>

            <div className="flex flex-col sm:flex-row gap-3">
              <AnimatedButton
                type="submit"
                disabled={loading || !canSubmit}
                className="btn-career flex-1 py-4 text-lg font-bold disabled:opacity-50"
              >
                {loading ? "Generating US CV…" : "Generate US-based CV"}
              </AnimatedButton>
              <button
                type="button"
                className="glass-card px-6 py-4 font-semibold hover:bg-[#0056d2]/10"
                onClick={() => navigate("/")}
              >
                Back to dashboard
              </button>
            </div>
          </GlassCard>
        </form>
      </div>
    </div>
  );
}

export default CvMaker;
