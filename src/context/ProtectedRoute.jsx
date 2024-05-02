import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext"; // Ensure the path is correct

const ProtectedRoute = () => {
  const { currentUser, isLoading } = useAuth();

  // Handle loading state: wait until loading is complete before deciding on navigation
  if (isLoading) {
    return <div>Loading...</div>; // Optionally render a loading indicator
  }

  // Navigate to login if no user is authenticated after loading is complete
  return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
