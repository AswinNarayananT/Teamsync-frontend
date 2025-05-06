import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createIssue } from "../../redux/currentworkspace/currentWorkspaceThunk";

export default function CreateIssueInput({
  isSprintSection = false,
  sprintId = null,
  parentId = null,            // ← new prop
}) {
  const dispatch = useDispatch();
  const projectId = useSelector(
    (state) => state.currentWorkspace.currentProject.id
  );

  const [open, setOpen] = useState(false);
  const [issueType, setIssueType] = useState("Task");
  const [newIssueText, setNewIssueText] = useState("");
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (open && containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setNewIssueText("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Auto-focus when opened
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const handleCreate = async () => {
    const title = newIssueText.trim();
    if (!title) return;

    const issueData = {
      title,
      type: issueType.toLowerCase(),
    };

    if (isSprintSection && sprintId) {
      issueData.sprint = sprintId;
    }

    // include parent if provided
    if (parentId != null) {
      issueData.parent = parentId;
    }

    await dispatch(createIssue({ issueData, projectId })).unwrap();

    setNewIssueText("");
    setIssueType("Task");
    setOpen(false);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCreate();
    } else if (e.key === "Escape") {
      setOpen(false);
      setNewIssueText("");
    }
  };

  return (
    <div className="px-4 py-3 bg-gray-850" ref={containerRef}>
      {open ? (
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
            placeholder={
              isSprintSection
                ? "Add issue to sprint..."
                : parentId != null
                ? "Add sub-issue..."
                : "Add issue to backlog..."
            }
            value={newIssueText}
            onChange={(e) => setNewIssueText(e.target.value)}
            onKeyDown={onKeyDown}
          />

          <button
            onClick={handleCreate}
            className="px-3 py-1.5 text-xs text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors font-medium shadow-sm disabled:opacity-50"
            disabled={!newIssueText.trim()}
          >
            Add
          </button>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="text-sm font-medium text-blue-500 hover:text-blue-300 flex items-center transition-colors"
        >
          <span className="mr-1 text-lg">+</span> Create
        </button>
      )}
    </div>
  );
}
