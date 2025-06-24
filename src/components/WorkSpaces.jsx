import React, { useEffect, useState } from "react";
import api from "../api"; // Axios instance with auth headers
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const WorkSpaces = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await api.get("/api/v1/adminpanel/workspaces/");
        setWorkspaces(response.data);
      } catch (err) {
        setError("Failed to fetch workspaces");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, []);

  const handleDialogOpen = (workspace) => {
    setSelectedWorkspace(workspace);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedWorkspace(null);
  };

  const confirmToggle = async () => {
    if (!selectedWorkspace) return;

    try {
      const response = await api.post(
        `/api/v1/adminpanel/workspaces/${selectedWorkspace.id}/toggle-block/`
      );
      const updatedStatus = response.data.is_blocked_by_admin;

      setWorkspaces((prev) =>
        prev.map((w) =>
          w.id === selectedWorkspace.id
            ? {
                ...w,
                is_blocked_by_admin: updatedStatus,
              }
            : w
        )
      );
    } catch (err) {
      alert("Failed to toggle block status");
    } finally {
      handleDialogClose();
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) return <p className="text-white">Loading workspaces...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="h-screen flex flex-col items-center bg-gray-900 text-white p-6 overflow-auto">
      <h1 className="text-2xl font-bold mb-6">All Workspaces</h1>

      {workspaces.length === 0 ? (
        <p className="text-gray-400">No workspaces found</p>
      ) : (
        <div className="w-full max-w-6xl overflow-x-auto">
          <table className="w-full border border-gray-700 rounded-lg overflow-hidden text-sm">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-3 border border-gray-700">#</th>
                <th className="p-3 border border-gray-700 text-left">Name</th>
                <th className="p-3 border border-gray-700">Plan</th>
                <th className="p-3 border border-gray-700">Expiry</th>
                <th className="p-3 border border-gray-700">Members</th>
                <th className="p-3 border border-gray-700">Status</th>
                <th className="p-3 border border-gray-700">Blocked</th>
                <th className="p-3 border border-gray-700">Subscription</th>
                <th className="p-3 border border-gray-700 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {workspaces.map((workspace, index) => (
                <tr
                  key={workspace.id}
                  className="bg-gray-700 hover:bg-gray-600 transition"
                >
                  <td className="p-3 border border-gray-700 text-center">
                    {index + 1}
                  </td>
                  <td className="p-3 border border-gray-700">
                    {workspace.name}
                  </td>
                  <td className="p-3 border border-gray-700 text-center">
                    {workspace.plan_name || "N/A"}
                  </td>
                  <td className="p-3 border border-gray-700 text-center">
                    {formatDate(workspace.formatted_plan_expiry)}
                  </td>
                  <td className="p-3 border border-gray-700 text-center">
                    {workspace.member_count}
                  </td>
                  <td className="p-3 border border-gray-700 text-center">
                    {workspace.is_active ? (
                      <span className="text-green-400 font-medium">Active</span>
                    ) : (
                      <span className="text-yellow-400 font-medium">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="p-3 border border-gray-700 text-center">
                    {workspace.is_blocked_by_admin ? (
                      <span className="text-red-500 font-medium">Blocked</span>
                    ) : (
                      <span className="text-green-500 font-medium">No</span>
                    )}
                  </td>
                  <td className="p-3 border border-gray-700 text-center">
                    {workspace.subscription_status || "N/A"}
                  </td>
                  <td className="p-3 border border-gray-700 text-center">
                    <button
                      onClick={() => handleDialogOpen(workspace)}
                      className={`px-3 py-1 rounded text-sm ${
                        workspace.is_blocked_by_admin
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      {workspace.is_blocked_by_admin ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Material UI Dialog for Confirmation */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>
          {selectedWorkspace?.is_blocked_by_admin
            ? "Unblock Workspace"
            : "Block Workspace"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to{" "}
            {selectedWorkspace?.is_blocked_by_admin ? "unblock" : "block"} the
            workspace <strong>{selectedWorkspace?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={confirmToggle}
            color={
              selectedWorkspace?.is_blocked_by_admin ? "success" : "error"
            }
            variant="contained"
          >
            {selectedWorkspace?.is_blocked_by_admin ? "Unblock" : "Block"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default WorkSpaces;
