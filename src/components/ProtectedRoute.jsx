import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LoginRequiredModal from "./LoginRequiredModal";

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  const location = useLocation();

  if (!token) {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
        <div className="glass-card p-8 max-w-md text-center opacity-60">
          <p className="text-[#5b5b5b]">This feature needs a GrowSmart account.</p>
        </div>
        <LoginRequiredModal
          open
          fromPath={location.pathname}
          title="Please sign up to continue"
          message="CV Maker, Jobs guidance, Career prediction, Insights, and History need login so your results stay on your account after logout."
        />
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
