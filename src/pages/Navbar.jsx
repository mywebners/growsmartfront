import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import LoginRequiredModal from "../components/LoginRequiredModal";
import EditProfileModal from "../components/EditProfileModal";

const NAV_ITEMS = [
  { id: "explore", label: "Explore", path: "/guidance", needsAuth: true },
  { id: "study", label: "Study", path: "/study/goal", needsAuth: true },
  { id: "careers", label: "Careers", path: "/education", needsAuth: true },
  { id: "jobs", label: "Jobs", path: "/jobs-guidance", needsAuth: true },
  { id: "history", label: "History", path: "/history", needsAuth: true },
];

function Navbar() {
  const { user, profile, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [authFrom, setAuthFrom] = useState("/");
  const menuRef = useRef(null);

  const displayName = profile?.name || user || "Account";
  const avatar = profile?.image || "";

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/", { replace: true });
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

  const goNav = (item) => {
    if (item.needsAuth && !user) {
      setAuthFrom(item.path);
      setAuthModalOpen(true);
      return;
    }
    navigate(item.path);
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <header className="gs-topbar">
      <LoginRequiredModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        fromPath={authFrom}
        title="Please sign up to continue"
        message="This feature uses your account (and AI / database where needed). Sign up so your results stay saved after logout."
      />
      <EditProfileModal open={editOpen} onClose={() => setEditOpen(false)} />

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
                onClick={() => goNav(item)}
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
                  {avatar ? (
                    <img className="gs-account-avatar" src={avatar} alt="" />
                  ) : (
                    <span className="gs-account-initial">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </button>

                <div className="gs-account-menu" role="menu">
                  <div className="gs-account-user">
                    <strong>{displayName}</strong>
                    <span>{profile?.email || "GrowSmart account"}</span>
                  </div>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      setEditOpen(true);
                    }}
                  >
                    Edit profile
                  </button>
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
