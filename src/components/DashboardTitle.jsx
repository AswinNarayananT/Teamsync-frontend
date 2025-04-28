import React, { useMemo, useState } from "react";
import Dropdown from "./Dropdown";
import { useSelector, useDispatch } from "react-redux";
import {
  setCurrentWorkspace,
  setCurrentProject,
  createProject,
} from "../redux/currentworkspace/currentWorkspaceThunk";
import CreateProjectModal from "./CreateProjectModal";
import { toast } from "react-toastify";

const DashboardTitle = ({ role }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { workspaces } = useSelector((state) => state.workspace);
  const { projects, currentWorkspace, currentProject } = useSelector(
    (state) => state.currentWorkspace
  );

  const selectedWorkspace = useMemo(
    () =>
      workspaces.find((ws) => ws.id === currentWorkspace?.id) ||
      workspaces[0] ||
      null,
    [currentWorkspace, workspaces]
  );

  const handleWorkspaceChange = (selected) => {
    dispatch(setCurrentWorkspace(selected));
    dispatch(setCurrentProject(null));
    setMobileMenuOpen(false);
  };

  const handleProjectChange = (selected) => {
    if (selected.id === "create") {
      setShowModal(true);
    } else {
      dispatch(setCurrentProject(selected));
    }
    setMobileMenuOpen(false);
  };

  const handleCreateProject = async (projectData) => {
    if (!selectedWorkspace) return;
  
    try {
      const newProject = await dispatch(
        createProject({
          ...projectData,
          currentWorkspaceId: selectedWorkspace.id,
        })
      ).unwrap();
  
      dispatch(setCurrentProject(newProject)); // move it here
  
      toast.success("Project created successfully!");
      setShowModal(false);
    } catch (err) {
      console.error("Project creation failed:", err);
      const errorMessage =
      err?.response?.data?.detail || err?.detail || err?.message || "Failed to create project.";
  
    toast.error(errorMessage);
    }
  };

  // Always show the project dropdown, even when empty
  const projectOptions = projects.length > 0
    ? [
        ...projects.map((project) => ({
          ...project,
          name: `${project.name}`,
        })),
        { id: "create", name: "➕ New Project" }
      ]
    : [{ id: "create", name: "🗂️ Create New project" }];
    
  // Current selections for mobile display
  const currentWorkspaceName = selectedWorkspace?.name || "No Workspace";
  const currentProjectName = currentProject?.name || "No Project";

  return (
    <div className="relative w-full">
      {role === "admin" ? (
        <h1 className="text-white text-xl font-semibold">Admin Dashboard</h1>
      ) : (
        <>
          {/* Mobile View with Hamburger Menu */}
          <div className="md:hidden w-full">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-white font-semibold truncate max-w-[180px]">
                  {currentWorkspaceName}
                </span>
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-white truncate max-w-[180px]">
                  {currentProjectName}
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-white focus:outline-none"
              >
                {/* Hamburger Icon */}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
            
            {/* Mobile Dropdown Menu */}
            {mobileMenuOpen && (
              <div className="absolute z-50 mt-2 w-full bg-gray-800 rounded-md shadow-lg py-2 px-3">
                <div className="mb-4">
                  <span className="text-gray-400 text-xs mb-1 block">
                    <span className="inline-block mr-1">🏢</span> Workspace
                  </span>
                  {workspaces.length > 0 && selectedWorkspace && (
                    <Dropdown
                      options={workspaces}
                      selected={selectedWorkspace}
                      setSelected={handleWorkspaceChange}
                      placeholder="Workspaces"
                      noOption="No Workspace"
                      key={selectedWorkspace.id}
                    />
                  )}
                </div>
                
                <div>
                  <span className="text-gray-400 text-xs mb-1 block">
                    <span className="inline-block mr-1">📋</span> Projects
                  </span>
                  <Dropdown
                    options={projectOptions}
                    selected={currentProject || null}
                    setSelected={handleProjectChange}
                    placeholder="Select Project"
                    noOption="No Projects"
                    key={"projects-dropdown"}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Desktop View - Original Layout */}
          <div className="hidden md:flex flex-wrap items-start md:items-center gap-4 md:flex-row">
            {/* Workspace Dropdown */}
            <div className="flex flex-col w-full sm:w-1/2 md:w-auto max-w-xs">
              <span className="text-gray-400 text-xs mb-1">
                <span className="inline-block mr-1">🏢</span> Workspace
              </span>
              <div>
                {workspaces.length > 0 && selectedWorkspace && (
                  <Dropdown
                    options={workspaces}
                    selected={selectedWorkspace}
                    setSelected={handleWorkspaceChange}
                    placeholder="Workspaces"
                    noOption="No Workspace"
                    key={selectedWorkspace.id}
                  />
                )}
              </div>
            </div>

            {/* Projects Dropdown - Always show */}
            <div className="flex flex-col w-full sm:w-1/2 md:w-auto max-w-xs">
              <span className="text-gray-400 text-xs mb-1">
                <span className="inline-block mr-1">📋</span> Projects
              </span>
              <div>
                <Dropdown
                  options={projectOptions}
                  selected={currentProject || null}
                  setSelected={handleProjectChange}
                  placeholder="Select Project"
                  noOption="No Projects"
                  key={"projects-dropdown"}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Project Create Modal */}
      <CreateProjectModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreateProject}
      />
    </div>
  );
};

export default DashboardTitle;