import React, { useState, useEffect } from "react";
import { fetchUserWorkspaces } from "../redux/workspace/workspaceThunks";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import Layout from "../components/Layout";
import { fetchWorkspaceStatus } from "../redux/currentworkspace/currentWorkspaceThunk";

const UserPanel = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const sessionId = new URLSearchParams(location.search).get("session_id");

  const { workspaces, loading } = useSelector((state) => state.workspace);
  const { currentWorkspace } = useSelector((state) => state.currentWorkspace);
  const [workspacesFetched, setWorkspacesFetched] = useState(false);

  useEffect(() => {
    if (sessionId) {
      const interval = setInterval(() => {
        console.log("🔁 Polling for workspace...");
        dispatch(fetchUserWorkspaces()).then((action) => {
          if (action.payload.length > 0) {
            clearInterval(interval);
            navigate("/dashboard");
          }
        });
      }, 2000);

      const timeout = setTimeout(() => {
        clearInterval(interval);
        console.warn("⏱️ Stopped polling after 20 seconds");
      }, 20000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    } else {
      if (workspaces.length === 0 && !loading) {
        dispatch(fetchUserWorkspaces()).then(() => setWorkspacesFetched(true));
      }
    }
  }, [dispatch, sessionId, workspaces.length, navigate]);

  useEffect(() => {
    if (!sessionId && !loading && workspacesFetched) {
      const isAtRoot = location.pathname === "/" || location.pathname === "/dashboard";
  
      if (workspaces.length > 0 && isAtRoot) {
        navigate("/dashboard", { replace: true });
      } else if (workspaces.length === 0 && isAtRoot) {
        navigate("/create-workspace", { replace: true });
      }
    }
  }, [loading, workspacesFetched, workspaces.length, navigate, sessionId, location.pathname]);

  useEffect(() => {
    if (currentWorkspace?.id) {
      dispatch(fetchWorkspaceStatus(currentWorkspace.id));
    }
  }, [dispatch, currentWorkspace?.id, location.pathname]);

  const isInactive = currentWorkspace && !currentWorkspace.is_active;
  const isOwner = currentWorkspace?.role === "owner";

  return (
    <Layout role="user" activeSection={activeSection} setActiveSection={setActiveSection}>
      {isInactive ? (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800 shadow-md p-6 sm:p-8 rounded-lg text-center w-full max-w-sm">
            <h1 className="text-xl font-semibold text-red-600 mb-3">Access Restricted</h1>
            <p className="text-gray-400 mb-4">
              Your current workspace has been deactivated due to a canceled plan.
            </p>
            {isOwner && (
              <button
                onClick={() => navigate("/pricing")}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full"
              >
                Choose New Plan
              </button>
            )}
          </div>
        </div>
      ) : (
        <Outlet />
      )}
    </Layout>
  );
};

export default UserPanel;
