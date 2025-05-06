import { useEffect, useRef, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useDispatch } from "react-redux";
import { updateIssueStatus } from "../../redux/currentworkspace/currentWorkspaceThunk";

export default function StatusDropdown({ issue }) {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleStatusDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleStatusChange = (issueId, status) => {
    dispatch(updateIssueStatus({ issueId, status }));
    setIsOpen(false); // close dropdown
  };

  // Detect click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const statusOptions = [
    { id: "todo", name: "To Do" },
    { id: "in_progress", name: "In Progress" },
    { id: "review", name: "In Review" },
    { id: "done", name: "Done" },
  ];

  const filteredOptions = statusOptions.filter(
    (option) => option.id !== issue.status.toLowerCase().replace(" ", "_")
  );

  return (
    <div className="relative w-32" ref={dropdownRef}>
      {/* Button */}
      <div
        onClick={toggleStatusDropdown}
        className="flex items-center justify-between bg-gray-800 text-gray-300 text-xs px-2.5 py-1 rounded-md hover:bg-gray-700 cursor-pointer transition-colors w-full"
      >
        <span className="truncate">{issue.status}</span>
        <ExpandMoreIcon className="w-3 h-3 ml-1" />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-20 mt-1 w-32 bg-gray-900 border border-gray-700 rounded-lg shadow-lg right-0 animate-fade-in">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.id}
                className="px-3 py-2 text-sm text-white hover:bg-gray-700 cursor-pointer border-b border-gray-800 last:border-0"
                onClick={() => handleStatusChange(issue.id, option.id)}
              >
                {option.name}
              </div>
            ))
          ) : (
            <div className="p-2 text-gray-400 text-sm text-center">No options</div>
          )}
        </div>
      )}
    </div>
  );
}
