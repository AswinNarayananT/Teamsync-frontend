import React from "react";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";

const BacklogBoard = () => {
  const { epics, projects, currentProject, issues } = useSelector(
    (state) => state.currentWorkspace
  );

  if (!currentProject) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900 text-white">
        <div className="text-lg font-semibold">No project found. Please create a project.</div>
      </div>
    );
  }

  const sprints = [
    {
      id: 1,
      name: "Sprint 1",
      issues: issues["epic-authentication"] || [],
    },
  ];

  const backlogIssues = issues["no-epic"] || [];

  return (
    <div className="flex h-full p-4 gap-4 bg-gray-900 text-white">
      {/* Sidebar - Epics */}
      <div className="w-1/4 bg-gray-800 rounded-xl shadow-md p-4 border border-gray-700">
        <div className="font-semibold mb-2">Epic</div>
        <div className="mb-4 text-gray-400">Issues without epic</div>
        <div className="space-y-2">
          {epics.length === 0 ? (
            <div className="p-2 rounded bg-gray-700 text-gray-300">No epics available</div>
          ) : (
            epics.map((epic) => (
              <div key={epic.id} className="p-2 rounded bg-purple-800 text-white">
                {epic.name}
              </div>
            ))
          )}
        </div>
        <Button
          variant="contained"
          className="mt-4 w-full"
          style={{ backgroundColor: "#7e3af2", color: "#fff" }}
        >
          + Create epic
        </Button>
      </div>

      {/* Main Area - Sprints and Backlog */}
      <div className="flex-1 space-y-6">
        {/* Sprint section */}
        {sprints.length === 0 ? (
          <div className="bg-gray-800 rounded-xl shadow-md p-4 border border-gray-700">
            <div className="font-semibold">No Sprints Available</div>
            <Button variant="outlined" className="mt-2" style={{ color: "#fff", borderColor: "#fff" }}>
              Create Sprint
            </Button>
          </div>
        ) : (
          sprints.map((sprint) => (
            <div key={sprint.id} className="bg-gray-800 rounded-xl shadow-md p-4 border border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <div className="font-semibold">{sprint.name}</div>
                <Button variant="contained" style={{ backgroundColor: "#2563eb", color: "#fff" }}>
                  Start sprint
                </Button>
              </div>
              <div className="space-y-2">
                {sprint.issues.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} />
                ))}
              </div>
              <Button variant="outlined" className="mt-2" style={{ color: "#fff", borderColor: "#fff" }}>
                + Create issue
              </Button>
            </div>
          ))
        )}

        {/* Backlog section */}
        <div className="bg-gray-800 rounded-xl shadow-md p-4 border border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <div className="font-semibold">Backlog</div>
            <Button variant="outlined" style={{ color: "#fff", borderColor: "#fff" }}>
              Create sprint
            </Button>
          </div>
          <div className="space-y-2">
            {backlogIssues.length === 0 ? (
              <div className="text-gray-400">No issues in backlog</div>
            ) : (
              backlogIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))
            )}
          </div>
          <Button variant="outlined" className="mt-2" style={{ color: "#fff", borderColor: "#fff" }}>
            + Create issue
          </Button>
        </div>
      </div>
    </div>
  );
};

const IssueCard = ({ issue }) => (
  <div className="flex items-center justify-between p-2 border border-gray-700 rounded-md bg-gray-700 hover:bg-gray-600">
    <div>
      <div className="text-sm font-medium text-white">{issue.title || "No Title"}</div>
      <div className="text-xs text-gray-300">{issue.epicName || "No Epic"}</div>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xs bg-purple-700 text-white px-2 py-1 rounded-full">
        {issue.epicLabel || "No Label"}
      </span>
      <select className="text-xs border border-gray-600 bg-gray-800 text-white rounded px-1 py-0.5">
        <option>TO DO</option>
        <option>IN PROGRESS</option>
        <option>REVIEW</option>
        <option>DONE</option>
      </select>
    </div>
  </div>
);

export default BacklogBoard;
