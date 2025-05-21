import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateIssue } from "../../redux/currentworkspace/currentWorkspaceThunk";
import MoreHorizSharpIcon from "@mui/icons-material/MoreHorizSharp";

const IssueOptionsDropdown = ({ issue }) => {
  const dispatch = useDispatch();
  const sprints = useSelector((state) => state.currentWorkspace.sprints);
  const projectId = useSelector((state) => state.currentWorkspace.currentProject?.id);
  
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="text-gray-400 hover:text-gray-200"
      >
        <MoreHorizSharpIcon fontSize="small" />
      </button>

      {showOptions && (
        <div className="absolute right-0 top-8 w-36 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-20">
          <div className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer">
            ✏️ Edit
          </div>
          <div className="px-4 py-2 text-sm text-red-400 hover:bg-gray-700 cursor-pointer">
            🗑️ Delete
          </div>

          {/* Move Issue Section */}
          <div className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-default relative group">
            Move issue
            <div className="absolute right-full top-0 mr-2 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30 pointer-events-auto">
              
              {/* Move to Backlog */}
              {issue.sprint && (
                <div
                  className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-300"
                  onClick={() => handleMoveIssue(issue.id, null)}
                >
                  📋 Backlog
                </div>
              )}

              {/* Move to other sprints */}
              {sprints
                .filter((sprint) => sprint.id !== issue.sprint)
                .map((sprint) => (
                  <div
                    key={sprint.id}
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-300"
                    onClick={() => handleMoveIssue(issue.id, sprint.id)}
                  >
                    🏃 {sprint.name}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueOptionsDropdown;
