import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { fetchUser } from "../redux/auth/authActions";

const PublicRoute = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user === undefined) {
      dispatch(fetchUser());
    }
  }, [user, dispatch]);

  if (loading) {
    return <div className="text-white p-4">Loading...</div>;
  }

  if (user) {
    if (user.is_superuser) {
      return <Navigate to="/adminpanel" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
