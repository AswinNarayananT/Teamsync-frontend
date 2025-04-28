import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CreateIssueInput from "./issue/CreateIssueInput";
import IssueItem from "./issue/IssueItem";
import { useDrop } from 'react-dnd';
import { updateIssue,createSprintInProject } from "../redux/currentworkspace/currentWorkspaceThunk";

function IssueSection({
  title,
  dateRange,
  issues,
  isSprintSection,
  sprintId,
}) {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(true);
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [checked, setChecked] = useState(false);
  const [individualChecked, setIndividualChecked] = useState({});
  
  const projectId = useSelector((state) => state.currentWorkspace.currentProject.id);
  const inputContainerRef = useRef(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "issue",
    drop: async (item) => {
      try {
        await dispatch(updateIssue({
          issueId: item.id,
          projectId: projectId,
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
      if (inputContainerRef.current && !inputContainerRef.current.contains(event.target)) {
        setShowCreateInput(false);
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

  const handleActionClick = () => {
    if (isSprintSection) {
      // This is an actual sprint — Start the sprint
      onStartSprint?.();
    } else {
      if (projectId) { 
        dispatch(createSprintInProject({ projectId, sprintData: {} }));
      }
    }
  };
  

 
  const visibleItems = issues.length;
  const totalItems = issues.length;

  return (
    <div
      ref={drop}
      className={` bg-[#202020] rounded-2xl shadow-md mb-6 border border-gray-700 ${isOver ? "bg-gray-800" : ""}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-850">
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

        <div className="flex items-center gap-3">
          <button
            onClick={handleActionClick}
            className="text-sm px-3 py-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            {isSprintSection ? "Start Sprint" : "Create Sprint"}
          </button>
          <button className="text-gray-400 hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-800">
            <MoreHorizIcon className="w-5 h-5" />
          </button>
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

          {/* Create Input / Button */}
          <CreateIssueInput
            showCreateInput={showCreateInput}
            setShowCreateInput={setShowCreateInput}
            isSprintSection={isSprintSection}
            sprintId={sprintId}
            inputContainerRef={inputContainerRef}
          />
        </>
      )}
    </div>
  );
}

export default IssueSection;
