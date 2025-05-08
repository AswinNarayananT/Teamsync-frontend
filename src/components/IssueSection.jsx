import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CreateIssueInput from "./issue/CreateIssueInput";
import IssueItem from "./issue/IssueItem";
import SprintEditModal from "./sprint/SprintEditModal";
import { useDrop } from 'react-dnd';
import {
  updateIssue,
  createSprintInProject,
  deleteSprint,
  editSprint,
} from "../redux/currentworkspace/currentWorkspaceThunk";

function IssueSection({
  title,
  dateRange,
  issues,
  isSprintSection,
  sprint,
}) {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(true);
  const [checked, setChecked] = useState(false);
  const [individualChecked, setIndividualChecked] = useState({});
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [sprintEditMode, setSprintEditMode] = useState("edit"); // "edit" | "start"

  const menuRef = useRef(null);
  const inputContainerRef = useRef(null);
  const projectId = useSelector((state) => state.currentWorkspace.currentProject.id);
  const sprintId = isSprintSection && sprint ? sprint.id : null;

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "issue",
    drop: async (item) => {
      try {
        await dispatch(updateIssue({
          issueId: item.id,
          projectId,
          issueData: { sprint: isSprintSection ? sprintId : null },
        })).unwrap();
      } catch (error) {
        console.error("Failed to move issue:", error);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputContainerRef.current &&
        !inputContainerRef.current.contains(event.target)
      ) {
        // Close inputs if needed in future
      }

      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMainCheckboxChange = (e) => {
    const newCheckedState = e.target.checked;
    setChecked(newCheckedState);
    setIndividualChecked(
      issues.reduce((acc, issue) => {
        acc[issue.id] = newCheckedState;
        return acc;
      }, {})
    );
  };

  const handleIndividualCheckboxChange = (e, issueId) => {
    setIndividualChecked({
      ...individualChecked,
      [issueId]: e.target.checked,
    });
  };

  const handleMoreClick = () => {
    if (isSprintSection) {
      setShowMenu((prev) => !prev);
    }
  };

  const handleEdit = () => {
    setSprintEditMode("edit");
    setShowEditModal(true);
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (sprintId && projectId) {
      dispatch(deleteSprint({ sprintId, projectId }));
    }
    setShowMenu(false);
  };

  const handleStartOrCompleteSprint = () => {
    if (!projectId || !sprintId) return;

    if (sprint.is_active) {
      dispatch(editSprint({ sprintId: sprint.id, sprintData: { is_complete: true } }));
    } else {
      setSprintEditMode("start");
      setShowEditModal(true);
    }
  };

  const handleCreateSprint = () => {
    if (projectId) {
      dispatch(createSprintInProject({ projectId, sprintData: {} }));
    }
  };

  const visibleItems = issues.length;
  const totalItems = issues.length;

  return (
    <div
      ref={drop}
      className={`bg-[#202020] rounded-2xl shadow-md mb-6 border border-gray-700 ${isOver ? "bg-gray-800" : ""}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-850 relative">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-800"
            checked={checked}
            onChange={handleMainCheckboxChange}
          />
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <ExpandMoreIcon className={`w-4 h-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
          </button>
          <h2 className="text-base font-semibold text-gray-100">{title}</h2>
          {dateRange && <span className="text-sm text-gray-400 ml-2">{dateRange}</span>}
          <span className="text-xs text-gray-500">({visibleItems} of {totalItems} visible)</span>
        </div>

        <div className="flex items-center gap-3 relative">
          <button
            onClick={isSprintSection ? handleStartOrCompleteSprint : handleCreateSprint}
            disabled={
              isSprintSection &&
              !sprint?.is_active &&
              (!issues || issues.length === 0)
            }
            className={`text-sm px-3 py-1.5 rounded-xl text-white font-medium shadow-sm transition-colors ${
              isSprintSection &&
              !sprint?.is_active &&
              (!issues || issues.length === 0)
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSprintSection
              ? sprint?.is_active
                ? "Complete Sprint"
                : "Start Sprint"
              : "Create Sprint"}
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={handleMoreClick}
              className="text-gray-400 hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-800"
            >
              <MoreHorizIcon className="w-5 h-5" />
            </button>

            {isSprintSection && showMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-10">
                <button
                  onClick={handleEdit}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {expanded && (
        <>
          {/* Issue List */}
          <div className="divide-y divide-gray-800">
            {issues.length > 0 ? (
              issues.map((issue) => (
                <IssueItem
                  key={issue.id}
                  issue={issue}
                  individualChecked={individualChecked}
                  handleIndividualCheckboxChange={handleIndividualCheckboxChange}
                />
              ))
            ) : (
              <div className="py-8 text-center text-gray-500 border-b border-gray-800 italic">
                This section is empty
              </div>
            )}
          </div>

          {/* Create Input */}
          <CreateIssueInput
            isSprintSection={isSprintSection}
            sprintId={sprintId}
          />
        </>
      )}

      {/* Sprint Edit Modal */}
      {showEditModal && sprint && (
        <SprintEditModal
          sprint={sprint}
          mode={sprintEditMode}
          onClose={() => setShowEditModal(false)}
          onSubmit={(updatedSprintData) => {
            const finalData = sprintEditMode === "start"
              ? { ...updatedSprintData, is_active: true }
              : updatedSprintData;

            dispatch(editSprint({ projectId, sprintId: sprint.id, sprintData: finalData }));
            setShowEditModal(false);
          }}
        />
      )}
    </div>
  );
}

export default IssueSection;
