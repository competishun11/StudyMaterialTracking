import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page with the current location saved in state
    return <Navigate to="/auth/login" state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
