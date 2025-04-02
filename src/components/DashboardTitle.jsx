import React, { useMemo } from "react";
import Dropdown from "./Dropdown";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentWorkspace } from "../redux/currentworkspace/currentWorkspaceThunk";

const DashboardTitle = ({ role }) => {
  const dispatch = useDispatch();
  const { workspaces } = useSelector((state) => state.workspace);
  const { projects, currentWorkspace } = useSelector((state) => state.currentWorkspace);


  // ✅ Get selected workspace or default to first one
  const selectedWorkspace = useMemo(
    () => workspaces.find(ws => ws.id === currentWorkspace?.id) || workspaces[0] || null,
    [currentWorkspace, workspaces]
  );

  // ✅ Get projects of the selected workspace
  const workspaceProjects = useMemo(
    () => projects.filter(project => project.workspaceId === selectedWorkspace?.id),
    [selectedWorkspace, projects]
  );

  // ✅ Handle workspace selection change
  const handleWorkspaceChange = (selected) => {
    dispatch(setCurrentWorkspace(selected));
  };

    // ✅ Handle workspace selection change
    const handleProjectChange = (selected) => {
      if (selected.id === "create") {
        alert("Open Create Project Modal"); // Replace with actual function
      }
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
                  placeholder="Workspaces"
                  noOption="No Workspace"
                  key={selectedWorkspace.id} // Ensure re-render when workspace changes
                />
              )}
            </div>
          </div>

         {/* Projects Dropdown */}
        {selectedWorkspace && (
          <div className="flex flex-col items-center">
            <span className="text-gray-400 text-xs">Projects</span>
            <div className="p-1">
              <Dropdown
                 options={[
                  ...workspaceProjects, // Existing projects
                  { id: "create", name: "➕ Create" }, // "Create Project" as the last option
                ]}
                selected={workspaceProjects[0] || null} 
                setSelected={handleProjectChange} 
                placeholder="Projects"
                noOption="No Projects"
                key={selectedWorkspace.id + "-projects"}
              />
            </div>
          </div>
        )}

        </div>
      )}
    </div>
  );
};

export default DashboardTitle;
