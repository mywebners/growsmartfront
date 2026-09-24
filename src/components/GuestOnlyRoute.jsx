import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

/**
 * Guest-only pages: login / register / forgot-password.
 * If already signed in (token in AuthContext/localStorage), redirect home.
 */
const GuestOnlyRoute = ({ children }) => {
  const { token } = useContext(AuthContext);

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default GuestOnlyRoute;
