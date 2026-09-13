import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { id: "explore", label: "Explore", path: "/guidance" },
  { id: "study", label: "Study", path: "/study/goal" },
  { id: "careers", label: "Careers", path: "/education" },
  { id: "jobs", label: "Jobs", path: "/jobs-guidance" },
];

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const go = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <header className="gs-topbar">
      <nav className="gs-main-nav">
        <div className="gs-main-nav-inner">
          <button type="button" className="gs-logo" onClick={() => navigate("/")}>
            <span className="gs-logo-text">GrowSmart</span>
            <span className="gs-logo-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.8 7.2 17.9l.9-5.4L4.2 8.7l5.4-.8L12 3z"
                  fill="currentColor"
                />
              </svg>
            </span>
          </button>

          <div className="gs-nav-links">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`gs-nav-link ${isActive(item.path) ? "is-active" : ""}`}
                onClick={() => navigate(user ? item.path : "/login")}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="gs-nav-actions">
            {user ? (
              <div
                className={`gs-account ${menuOpen ? "is-open" : ""}`}
                ref={menuRef}
                onMouseEnter={() => setMenuOpen(true)}
                onMouseLeave={() => setMenuOpen(false)}
              >
                <button
                  type="button"
                  className="gs-account-btn"
                  aria-label="Account menu"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((open) => !open)}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z"
                      fill="currentColor"
                    />
                    <path
                      d="M4 20.5c0-3.59 3.582-6.5 8-6.5s8 2.91 8 6.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                <div className="gs-account-menu" role="menu">
                  <div className="gs-account-user">
                    <strong>{user}</strong>
                    <span>GrowSmart account</span>
                  </div>
                  <button type="button" role="menuitem" onClick={() => go("/guidance")}>
                    Guidance Hub
                  </button>
                  <button type="button" role="menuitem" onClick={() => go("/cv-maker")}>
                    CV Maker
                  </button>
                  <button type="button" role="menuitem" onClick={() => go("/history")}>
                    My History
                  </button>
                  <button type="button" role="menuitem" onClick={() => go("/")}>
                    Dashboard Home
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    className="gs-signout"
                    onClick={handleLogout}
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  className="gs-nav-text"
                  onClick={() => navigate("/login")}
                >
                  Log In
                </button>
                <button
                  type="button"
                  className="gs-nav-join"
                  onClick={() => navigate("/register")}
                >
                  Join for Free
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
