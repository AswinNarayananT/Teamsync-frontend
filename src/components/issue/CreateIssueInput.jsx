import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createIssue } from "../../redux/currentworkspace/currentWorkspaceThunk";

export default function CreateIssueInput({
  showCreateInput,
  setShowCreateInput,
  issueType,
  setIssueType,
  newIssueText,
  setNewIssueText,
  isSprintSection = false,
  sprintId = null,
  inputContainerRef
}) {
  const dispatch = useDispatch();
  const projectId = useSelector((state) => state.currentWorkspace.currentProject.id);
  const inputRef = useRef(null);

  useEffect(() => {
    if (showCreateInput) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [showCreateInput]);

  const handleSubmitIssue = () => {
    if (!newIssueText.trim()) return;

    const issueData = {
      title: newIssueText,
      type: issueType.toLowerCase(),
    };

    if (isSprintSection && sprintId) {
      issueData.sprint = sprintId;
    }

    dispatch(createIssue({ issueData, projectId }));

    setNewIssueText("");
    setShowCreateInput(false);
  };

  const handleCreateClick = () => {
    setShowCreateInput(true);
  };

  return (
    <div className="px-4 py-3 bg-gray-850" ref={inputContainerRef}>
      {showCreateInput ? (
        <div className="flex gap-2 items-center">
          <select
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            className="px-2 py-1.5 bg-gray-800 border border-gray-700 text-gray-100 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Task">✅ Task</option>
            <option value="Story">📘 Story</option>
            <option value="Bug">🐞 Bug</option>
          </select>

          <input
            ref={inputRef}
            type="text"
            className="flex-1 px-3 py-1.5 bg-gray-800 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 text-sm"
            placeholder={isSprintSection ? "Add issue to sprint..." : "Add issue to backlog..."}
            value={newIssueText}
            onChange={(e) => setNewIssueText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmitIssue();
              else if (e.key === "Escape") setShowCreateInput(false);
            }}
          />

          <button
            onClick={handleSubmitIssue}
            className="px-3 py-1.5 text-xs text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors font-medium shadow-sm disabled:opacity-50"
            disabled={!newIssueText.trim()}
          >
            Add
          </button>
        </div>
      ) : (
        <button
          onClick={handleCreateClick}
          className="text-sm font-medium text-blue-500 hover:text-blue-300 flex items-center transition-colors"
        >
          <span className="mr-1 text-lg">+</span> Create
        </button>
      )}
    </div>
  );
}
