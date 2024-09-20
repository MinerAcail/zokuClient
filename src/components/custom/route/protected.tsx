import React from "react";
import { useAuth } from "@/middleware/context/authContext";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  element: React.ReactNode;
  expectedTypes?: string[]; // The expected user types for this route
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, expectedTypes }) => {
  const { isAuthenticated, user } = useAuth();
  const userTypes = user?.type || [];

  // Check if the user is authenticated and has at least one of the expected types
  const hasExpectedTypes = isAuthenticated && expectedTypes?.some(type => userTypes.includes(type));



  if (!isAuthenticated || !hasExpectedTypes) {
    return <Navigate to="/login" replace />;
  }

  return <>{element}</>;
};

export default ProtectedRoute;
