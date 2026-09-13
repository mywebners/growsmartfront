import React, { useContext, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getHistoryItems } from "../utils/historyStorage";
import { AuthContext } from "../context/AuthContext";

const CAREER_QUOTES = [
  {
    text: "Start in minutes today. Build the skills that shape your future career.",
    author: "GrowSmart",
  },
  {
    text: "The best career path is the one that matches your strengths and curiosity.",
    author: "Career Guidance",
  },
  {
    text: "Learning with direction turns effort into opportunity.",
    author: "Study Insight",
  },
  {
    text: "Clear goals help you choose subjects, careers, and jobs with confidence.",
    author: "Guidance Tip",
  },
  {
    text: "Your next step matters more than a perfect plan — begin with guidance.",
    author: "GrowSmart AI",
  },
];

const DASHBOARD_TABS = [
  { id: "all", label: "All" },
  { id: "study", label: "Study" },
  { id: "career", label: "Career" },
  { id: "jobs", label: "Jobs" },
  { id: "tools", label: "Tools" },
];

const DASHBOARD_LINKS = [
  {
    id: "guidance",
    tab: "all",
    title: "Guidance Hub",
    desc: "Choose study, career, or jobs guidance in one place.",
    path: "/guidance",
    needsAuth: true,
    action: "hub",
  },
  {
    id: "study",
    tab: "study",
    title: "Study Guidance",
    desc: "Matric → Intermediate → Bachelor study path help.",
    path: "/study/goal",
    needsAuth: true,
    action: "study",
  },
  {
    id: "career",
    tab: "career",
    title: "Career Guidance",
    desc: "Find careers that fit your marks, stream, and skills.",
    path: "/education",
    needsAuth: true,
    action: "career",
  },
  {
    id: "jobs",
    tab: "jobs",
    title: "Jobs Guidance",
    desc: "Explore job ideas and Pakistan job portal suggestions.",
    path: "/jobs-guidance",
    needsAuth: true,
    action: "jobs",
  },
  {
    id: "insights",
    tab: "career",
    title: "Career Insights",
    desc: "Browse deeper insights about career directions.",
    path: "/career-insights",
    needsAuth: true,
    action: null,
  },
  {
    id: "scope",
    tab: "career",
    title: "Career Scope",
    desc: "See scope and growth areas for different careers.",
    path: "/career-scope",
    needsAuth: true,
    action: null,
  },
  {
    id: "skills",
    tab: "tools",
    title: "Skills Test",
    desc: "Check your skills and get matched recommendations.",
    path: "/skills",
    needsAuth: true,
    action: null,
  },
  {
    id: "cv",
    tab: "tools",
    title: "CV Maker",
    desc: "Fill your details and generate a professional US-based CV with AI.",
    path: "/cv-maker",
    needsAuth: true,
    action: null,
  },
  {
    id: "history",
    tab: "tools",
    title: "My History",
    desc: "Review your saved guidance results and progress.",
    path: "/history",
    needsAuth: true,
    action: null,
  },
];

const TRUST_ITEMS = [
  "Study Paths",
  "Career Matches",
  "Jobs Guidance",
  "Skills Test",
  "CV Maker",
  "AI Suggestions",
];

function Home() {
  const navigate = useNavigate();
  const {
    resetAssessment,
    setGuidanceType,
    setStudyGoal,
    setJobsGoal,
  } = useContext(AuthContext);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("all");

  const userData = localStorage.getItem("user");
  let user = userData || null;

  if (userData && userData.startsWith("{")) {
    try {
      const parsedUser = JSON.parse(userData);
      user = parsedUser?.firstName || parsedUser?.name || userData;
    } catch (e) {
      console.error("Invalid user data in localStorage:", e);
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % CAREER_QUOTES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const hasHistory = user ? getHistoryItems(user).length > 0 : false;

  const visibleLinks = useMemo(() => {
    const filtered =
      activeTab === "all"
        ? DASHBOARD_LINKS
        : DASHBOARD_LINKS.filter(
            (item) => item.tab === activeTab || item.id === "guidance"
          );

    return filtered.filter((item) => {
      if (item.id === "history" && !hasHistory) return false;
      return true;
    });
  }, [activeTab, hasHistory]);

  const requireAuth = () => {
    if (!user) {
      alert("Please login first to start guidance");
      navigate("/login");
      return false;
    }
    return true;
  };

  const handleStart = () => {
    if (!requireAuth()) return;
    resetAssessment();
    navigate("/guidance", { replace: true });
  };

  const handleLink = (item) => {
    if (item.needsAuth && !requireAuth()) return;

    if (item.action === "hub") {
      resetAssessment();
      navigate(item.path);
      return;
    }

    if (item.action === "study" || item.action === "career" || item.action === "jobs") {
      resetAssessment();
      setGuidanceType(item.action);
      if (item.action !== "study") setStudyGoal(null);
      if (item.action !== "jobs") setJobsGoal(null);
      navigate(item.path);
      return;
    }

    navigate(item.path);
  };

  const activeQuote = CAREER_QUOTES[quoteIndex];

  return (
    <div className="gs-home">
      <section className="gs-hero">
        <div className="gs-hero-inner">
          <div className="gs-hero-copy">
            <p className="gs-hero-badge">GrowSmart AI Guidance</p>
            <h1 className="gs-hero-title">
              {user ? `Welcome back, ${user}` : "Start in minutes today."}
              <span> Build skills this week.</span>
            </h1>
            <p className="gs-hero-text">
              Get clear study, career, and jobs guidance based on your education
              level, strengths, and goals — designed for Pakistani students.
            </p>

            <div className="gs-hero-actions">
              {user ? (
                <button className="gs-btn-white" onClick={handleStart}>
                  Start guidance
                </button>
              ) : (
                <button className="gs-btn-white" onClick={() => navigate("/register")}>
                  Join for free
                </button>
              )}
              {!user ? (
                <button className="gs-btn-ghost" onClick={() => navigate("/login")}>
                  Log in
                </button>
              ) : hasHistory ? (
                <button className="gs-btn-ghost" onClick={() => navigate("/history")}>
                  View history
                </button>
              ) : null}
            </div>

            <p className="gs-hero-note">
              Free to start · Personalized paths · AI-powered suggestions
            </p>
          </div>

          <div className="gs-hero-visual" aria-hidden="true">
            <div className="gs-hero-shape">
              <div className="gs-hero-panel">
                <p className="gs-hero-panel-label">Career quote</p>
                <AnimatePresence mode="wait">
                  <motion.blockquote
                    key={quoteIndex}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4 }}
                    className="gs-hero-quote"
                  >
                    <p>“{activeQuote.text}”</p>
                    <footer>— {activeQuote.author}</footer>
                  </motion.blockquote>
                </AnimatePresence>
                <div className="gs-quote-dots">
                  {CAREER_QUOTES.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Show quote ${i + 1}`}
                      className={`gs-quote-dot ${i === quoteIndex ? "is-active" : ""}`}
                      onClick={() => setQuoteIndex(i)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="gs-trust">
        <div className="gs-section-inner">
          <h2>Guidance built for your next step</h2>
          <div className="gs-trust-row">
            {TRUST_ITEMS.map((item) => (
              <div key={item} className="gs-trust-pill">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="gs-dashboard">
        <div className="gs-section-inner">
          <div className="gs-dashboard-head">
            <h2>Explore GrowSmart</h2>
            <p>Open any path below — your personal guidance dashboard.</p>
          </div>

          <div className="gs-tabs" role="tablist" aria-label="Dashboard categories">
            {DASHBOARD_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`gs-tab ${activeTab === tab.id ? "is-active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="gs-link-grid">
            {visibleLinks.map((item, index) => (
              <motion.button
                key={item.id}
                type="button"
                className="gs-link-card"
                onClick={() => handleLink(item)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <span className="gs-link-title">{item.title}</span>
                <span className="gs-link-desc">{item.desc}</span>
                <span className="gs-link-cta">Open →</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <section className="gs-quotes">
        <div className="gs-section-inner gs-quotes-inner">
          <h2>Career thoughts to keep you moving</h2>
          <div className="gs-quotes-grid">
            {CAREER_QUOTES.slice(0, 3).map((quote) => (
              <figure key={quote.text} className="gs-quote-card">
                <blockquote>“{quote.text}”</blockquote>
                <figcaption>— {quote.author}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <footer className="gs-home-footer">
        GrowSmart AI · Study · Career · Jobs guidance
      </footer>
    </div>
  );
}

export default Home;
