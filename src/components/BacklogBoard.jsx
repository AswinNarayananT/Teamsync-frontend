// src/components/BacklogBoard.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import BacklogIssues from "./backlog/BacklogIssues";
import CompletedIssues from "./backlog/CompletedIssues";
import IssueCreateModal from "./issue/IssueCreateModal";

const BacklogBoard = () => {
  const currentProject = useSelector((state) => state.currentWorkspace.currentProject);
  const [view, setView] = useState("backlog"); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openCreateIssueModal = () => setIsModalOpen(true);
  const closeCreateIssueModal = () => setIsModalOpen(false);

  if (!currentProject) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900 text-white">
        <div className="text-lg font-semibold">No project found. Please create a project.</div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      {/* Tabs */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setView("backlog")}
            className={`px-4 py-2 rounded ${view === "backlog" ? "bg-blue-600" : "bg-gray-700"}`}
          >
            Backlog
          </button>
          <button
            onClick={() => setView("completed")}
            className={`px-4 py-2 rounded ${view === "completed" ? "bg-blue-600" : "bg-gray-700"}`}
          >
            Completed
          </button>
        </div>

        {/* Add Task Button */}
        {view === "backlog" && (
          <button
            onClick={openCreateIssueModal}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
          >
            Add Task
          </button>
        )}
      </div>

      {/* Views */}
      {view === "backlog" ? (
        <BacklogIssues currentProject={currentProject} />
      ) : (
        <CompletedIssues />
      )}

      {/* Modal */}
      <IssueCreateModal
        isOpen={isModalOpen}
        onClose={closeCreateIssueModal}
        projectId={currentProject.id}
      />
    </div>
  );
};

export default BacklogBoard;
