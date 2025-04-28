import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import IssueModal from "./IssueModal";
import AssigneeSelector from "./issue/AssigneeSelector";
import EpicSelector from "./issue/EpicSelector";
import StatusDropdown from "./issue/StatusDropdown";
import CreateIssueInput from "./issue/CreateIssueInput";
import IssueOptionsDropdown from "./issue/IssueOptionsDropdown";
import { updateIssue } from "../redux/currentworkspace/currentWorkspaceThunk";

function IssueSection({
  title,
  dateRange,
  visibleItems,
  totalItems,
  issues,
  isSprintSection,
  onAddIssue,
  onStartSprint,
  onDropIssue
}) {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(true);
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [newIssueText, setNewIssueText] = useState("");
  const [issueType, setIssueType] = useState("Task");
  const [checked, setChecked] = useState(false);
  const [individualChecked, setIndividualChecked] = useState({});
  const [showEpicDropdownFor, setShowEpicDropdownFor] = useState(null);
  const [showAssigneeDropdownFor, setShowAssigneeDropdownFor] = useState(null);
  const [showStatusDropdownFor, setShowStatusDropdownFor] = useState(null);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [showOptionsDropdownFor, setShowOptionsDropdownFor] = useState(null);

  const projectId = useSelector((state) => state.currentWorkspace.currentProject?.id);

  const inputContainerRef = useRef(null);
  const assigneeDropdownRef = useRef(null);
  const epicDropdownRef = useRef(null);
  const statusDropdownRef = useRef(null);
  const optionsDropdownRef = useRef(null);

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    const issueId = e.dataTransfer.getData('text/plain');
    onDropIssue?.(issueId, isSprintSection);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputContainerRef.current && !inputContainerRef.current.contains(event.target)) {
        setShowCreateInput(false);
        setNewIssueText("");
      }
      if (epicDropdownRef.current && !epicDropdownRef.current.contains(event.target)) {
        setShowEpicDropdownFor(null);
      }
      if (assigneeDropdownRef.current && !assigneeDropdownRef.current.contains(event.target)) {
        setShowAssigneeDropdownFor(null);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setShowStatusDropdownFor(null);
      }
      if (optionsDropdownRef.current && !optionsDropdownRef.current.contains(event.target)) {
        setShowOptionsDropdownFor(null);
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

  const handleIssueTitleClick = (issueId) => {
    setSelectedIssueId(issueId);
    setIsIssueModalOpen(true);
  };

  return (
    <div
      className="bg-gray-900 rounded-2xl shadow-md mb-6 border border-gray-700"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
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
            <ExpandMoreIcon className={`w-4 h-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
          </button>
          <h2 className="text-base font-semibold text-gray-100">{title}</h2>
          {dateRange && <span className="text-sm text-gray-400 ml-2">{dateRange}</span>}
          <span className="text-xs text-gray-500">({visibleItems} of {totalItems} visible)</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onStartSprint?.()}
            className="text-sm px-3 py-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            {isSprintSection ? 'Start Sprint' : 'Create Sprint'}
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
                <div
                  key={issue.id}
                  className="flex items-center px-4 py-3 hover:bg-gray-800/70 transition-colors cursor-grab group"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', issue.id)}
                >
                  <input
                    type="checkbox"
                    className="mr-3 w-4 h-4 rounded border-gray-600 text-blue-500 bg-gray-800"
                    checked={individualChecked[issue.id] || false}
                    onChange={(e) => handleIndividualCheckboxChange(e, issue.id)}
                  />
                  <span className="mr-3 text-gray-300 flex-shrink-0">
                    {issue.type === "task" && "✅"}
                    {issue.type === "story" && "📘"}
                    {issue.type === "bug" && "🐞"}
                  </span>
                  <span
                    className="flex-1 font-medium text-gray-100 truncate"
                    onClick={() => handleIssueTitleClick(issue.id)}
                  >
                    {issue.title}
                  </span>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <EpicSelector
                      issue={issue}
                      showEpicDropdownFor={showEpicDropdownFor}
                      setShowEpicDropdownFor={setShowEpicDropdownFor}
                      epicDropdownRef={epicDropdownRef}
                    />
                    <StatusDropdown
                      issue={issue}
                      showStatusDropdownFor={showStatusDropdownFor}
                      setShowStatusDropdownFor={setShowStatusDropdownFor}
                      statusDropdownRef={statusDropdownRef}
                    />
                    <span className="mx-1 text-gray-600">•</span>
                    <AssigneeSelector
                      issue={issue}
                      showAssigneeDropdownFor={showAssigneeDropdownFor}
                      setShowAssigneeDropdownFor={setShowAssigneeDropdownFor}
                      assigneeDropdownRef={assigneeDropdownRef}
                    />
                    <IssueOptionsDropdown
                      issue={issue}
                      showOptionsDropdownFor={showOptionsDropdownFor}
                      setShowOptionsDropdownFor={setShowOptionsDropdownFor}
                      optionsDropdownRef={optionsDropdownRef}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-gray-500 border-b border-gray-800 italic">
                This section is empty
              </div>
            )}
          </div>

          {isIssueModalOpen && selectedIssueId && (
            <IssueModal
              isOpen={isIssueModalOpen}
              onClose={() => setIsIssueModalOpen(false)}
              issueId={selectedIssueId}
              projectId={projectId}
              mode="edit"
            />
          )}

          {/* Create Input / Button */}
          <CreateIssueInput
            showCreateInput={showCreateInput}
            setShowCreateInput={setShowCreateInput}
            issueType={issueType}
            setIssueType={setIssueType}
            newIssueText={newIssueText}
            setNewIssueText={setNewIssueText}
            onAddIssue={onAddIssue}
            isSprintSection={isSprintSection}
            inputContainerRef={inputContainerRef}
          />
        </>
      )}
    </div>
  );
}

export default IssueSection;
