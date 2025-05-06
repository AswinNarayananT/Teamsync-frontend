import React from "react";
import { useSelector } from "react-redux";
import {
  IconButton,
  Tooltip,
  Typography,
  Divider,
} from "@mui/material";
import { MdEdit, MdDelete } from "react-icons/md";

const ProjectList = () => {
  const projects = useSelector((state) => state.currentWorkspace.projects);
  const currentWorkspace = useSelector((state) => state.currentWorkspace.currentWorkspace);
  const isWorkspaceOwner = currentWorkspace?.role === "owner";

  const handleEdit = (project) => {
    console.log("Edit project:", project);
  };

  const handleDelete = (projectId) => {
    console.log("Delete project ID:", projectId);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white px-8 py-10">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Workspace Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-extrabold">
              {currentWorkspace?.name || "Workspace"} Projects
            </h1>
            <p className="text-gray-400 mt-1">
              Role: <span className="text-blue-400 font-medium">{currentWorkspace?.role || "Member"}</span>
            </p>
          </div>
        </div>

        <Divider className="bg-gray-700" />

        {/* Projects Section */}
        <div className="space-y-6 mt-4">
          {projects.length === 0 ? (
            <p className="text-center text-gray-500 text-lg mt-20">No projects available in this workspace.</p>
          ) : (
            projects.map((project, index) => (
              <div
                key={project.id}
                className="bg-[#1a1a1d] border border-[#2a2a2d] rounded-xl p-6 hover:shadow-xl hover:border-blue-500 transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <Typography variant="h6" className="text-white font-semibold">
                        {project.name}
                    </Typography>
                    <Typography variant="body2" className="text-gray-400">
                        Project created:{" "}
                        {new Date(project.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        })}
                    </Typography>
                    </div>

                  {isWorkspaceOwner && (
                    <div className="flex gap-2">
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleEdit(project)} className="text-blue-400 hover:text-blue-300">
                          <MdEdit size={22} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete(project.id)} className="text-red-400 hover:text-red-300">
                          <MdDelete size={22} />
                        </IconButton>
                      </Tooltip>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
