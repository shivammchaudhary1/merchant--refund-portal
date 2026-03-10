import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../app/store";
import type { ProtectedRouteProps } from "../types";

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // If user is not authenticated, redirect to login page
  if (!isAuthenticated) {
    // Save the attempted location so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
