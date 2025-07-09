import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

const RequireAuth = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RequireAuth;
