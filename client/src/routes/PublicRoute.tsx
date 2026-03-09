import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/store";
import type { ReactNode } from "react";

interface PublicRouteProps {
  children: ReactNode;
}

/**
 * PublicRoute component for Login and Register pages
 * Redirects authenticated users to the home page
 */
const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // If user is already authenticated, redirect to home page
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If not authenticated, render the public component (Login/Register)
  return <>{children}</>;
};

export default PublicRoute;
