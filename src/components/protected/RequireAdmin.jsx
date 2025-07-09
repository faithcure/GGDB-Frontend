import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

const RequireAdmin = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) return null;

  const role = user?.role?.toLowerCase();

  if (role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RequireAdmin;
