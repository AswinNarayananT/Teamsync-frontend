import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedAdminRoute = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const location = useLocation(); // Get the current location

  if (loading) {
    console.log("⏳ Waiting for user data...");
    return <div className="text-white p-4">Loading...</div>;
  }
  console.log(user)
  if (!user) {
    console.warn("🚫 User not found, redirecting to login...");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!user.is_superuser) {
    console.warn("🚫 Access Denied: Not an Admin. Redirecting...");
    return <Navigate to={location.state?.from?.pathname || "/dashboard"} replace />;
  }

  console.log("✅ Access Granted: Admin Panel");
  return <Outlet />;
};

export default ProtectedAdminRoute;
