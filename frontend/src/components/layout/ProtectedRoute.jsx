import React from "react";
import { Navigate } from "../../router.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { Loader } from "../ui/Feedback.jsx";

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader label="Checking session" />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;

  return children;
};

export default ProtectedRoute;
