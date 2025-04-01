import React, { useMemo } from "react";
import Dropdown from "./Dropdown";
import { useSelector, useDispatch } from "react-redux";
import { switchWorkspace } from "../redux/workspace/workspaceThunks";

const DashboardTitle = ({ role }) => {
  const dispatch = useDispatch();
  const { workspaces, currentWorkspace } = useSelector((state) => state.workspace);

  // ✅ Get selected workspace or default to first one
  const selectedWorkspace = useMemo(() => currentWorkspace || workspaces[0] || null, [currentWorkspace, workspaces]);

  // ✅ Handle workspace selection change
  const handleWorkspaceChange = (selected) => {
    dispatch(switchWorkspace(selected.id)); // 🔹 Use `switchWorkspace` thunk instead of direct slice update
  };

  return (
    <div className="relative">
      {role === "admin" ? (
        <h1 className="text-white text-xl font-semibold">Admin Dashboard</h1>
      ) : (
        <div className="flex items-center space-x-4">
          {/* Workspace Dropdown */}
          <div className="flex flex-col items-center">
            <span className="text-gray-400 text-xs">Workspace</span>
            <div className="p-1">
              {workspaces.length > 0 && selectedWorkspace && (
                <Dropdown
                  options={workspaces}
                  selected={selectedWorkspace}
                  setSelected={handleWorkspaceChange}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardTitle;
