import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateIssue, deleteIssue } from "../../redux/currentworkspace/currentWorkspaceThunk";
import MoreHorizSharpIcon from "@mui/icons-material/MoreHorizSharp";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

const IssueOptionsDropdown = ({ issue }) => {
  const dispatch = useDispatch();
  const sprints = useSelector((state) => state.currentWorkspace.sprints);
  const projectId = useSelector((state) => state.currentWorkspace.currentProject?.id);

  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [openLeft, setOpenLeft] = useState(false);

  const dropdownRef = useRef(null);
  const moveRef = useRef(null);

  const toggleDropdown = () => {
    setShowOptions((prev) => !prev);
  };

  const handleMoveIssue = async (issueId, sprintId) => {
    try {
      await dispatch(updateIssue({
        issueId,
        projectId,
        issueData: { sprint: sprintId },
      })).unwrap();
      setShowOptions(false);
    } catch (error) {
      console.error("Failed to move issue:", error);
    }
  };

  const handleDeleteIssue = async () => {
    try {
      await dispatch(deleteIssue({ issueId: issue.id })).unwrap();
      setShowDeleteConfirm(false);
      setShowOptions(false);
    } catch (error) {
      console.error("Failed to delete issue:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useLayoutEffect(() => {
    if (showOptions && moveRef.current) {
      const rect = moveRef.current.getBoundingClientRect();
      const spaceRight = window.innerWidth - rect.right;
      const submenuWidth = 176; // Approx 11rem (44 * 4)
      setOpenLeft(spaceRight < submenuWidth);
    }
  }, [showOptions]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="text-gray-400 hover:text-gray-200"
      >
        <MoreHorizSharpIcon fontSize="small" />
      </button>

      {showOptions && (
        <div className="absolute right-0 mt-2 w-44 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-20 text-sm text-gray-300">
          {/* Delete Option */}
          <div
            className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-red-400"
            onClick={() => setShowDeleteConfirm(true)}
          >
            🗑️ Delete
          </div>

          {/* Move Issue */}
          <div
            ref={moveRef}
            className="relative group px-4 py-2 hover:bg-gray-700 cursor-default"
          >
            <span className="text-gray-300">🧭 Move issue</span>

            <div
              className={`absolute ${
                openLeft ? "right-full mr-1" : "left-full ml-1"
              } top-0 w-44 bg-gray-800 border border-gray-700 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30`}
            >
              {issue.sprint && (
                <div
                  className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-300"
                  onClick={() => handleMoveIssue(issue.id, null)}
                >
                  📋 Backlog
                </div>
              )}
              {sprints
                .filter((sprint) => sprint.id !== issue.sprint)
                .map((sprint) => (
                  <div
                    key={sprint.id}
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-300"
                    onClick={() => handleMoveIssue(issue.id, sprint.id)}
                  >
                  {sprint.name}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
      >
        <DialogTitle>Delete Issue</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the issue "<strong>{issue.title}</strong>"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteConfirm(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteIssue} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default IssueOptionsDropdown;
