import React, { useRef, useState } from "react";
import { useDrag } from "react-dnd";
import EpicSelector from "./EpicSelector";
import AssigneeSelector from "./AssigneeSelector";
import IssueOptionsDropdown from "./IssueOptionsDropdown";
import IssueDetail from "./IssueDetail";

const SprintItem = ({ issue }) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "issue",
      item: { id: issue.id },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [issue.id]
  );

  // States for dropdowns
  const [showEpicDropdownFor, setShowEpicDropdownFor] = useState(null);
  const [showAssigneeDropdownFor, setShowAssigneeDropdownFor] = useState(null);
  const [showOptionsDropdownFor, setShowOptionsDropdownFor] = useState(null);

  // State for modal (Issue Detail)
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState(null);

  // Refs for dropdowns
  const epicDropdownRef = useRef(null);
  const assigneeDropdownRef = useRef(null);
  const optionsDropdownRef = useRef(null);

  // Open issue modal
  const openIssueModal = () => {
    setSelectedIssueId(issue.id);
    setIsIssueModalOpen(true);
  };

  return (
    <>
      {/* The modal component for issue detail */}
      {isIssueModalOpen && selectedIssueId && (
        <IssueDetail
          isOpen={isIssueModalOpen}
          onClose={() => setIsIssueModalOpen(false)}
          issueId={selectedIssueId}
        />
      )}

      <div
        ref={drag}
        className={`relative bg-[#3a3a3a] p-2 rounded shadow transition-colors text-sm ${
          isDragging ? "opacity-50" : "hover:bg-[#4a4a4a]"
        }`}
      >
        {/* Title and options */}
        <div 
          onClick={openIssueModal}  
          className="flex justify-between items-center mb-1 cursor-pointer"  // Added cursor-pointer here
        >
          <h3 className="font-medium truncate">{issue.title}</h3>
          <IssueOptionsDropdown
            issue={issue}
            showOptionsDropdownFor={showOptionsDropdownFor}
            setShowOptionsDropdownFor={setShowOptionsDropdownFor}
            optionsDropdownRef={optionsDropdownRef}
          />
        </div>

        {/* Type and Epic */}
        <div className="flex items-center justify-between mb-2 text-xs text-gray-400">
          <span className="capitalize">{issue.type}</span>
          <EpicSelector
            issue={issue}
            showEpicDropdownFor={showEpicDropdownFor}
            setShowEpicDropdownFor={setShowEpicDropdownFor}
            epicDropdownRef={epicDropdownRef}
          />
        </div>

        {/* Assignee at bottom right */}
        <div className="absolute bottom-2 right-2">
          <AssigneeSelector
            issue={issue}
            showAssigneeDropdownFor={showAssigneeDropdownFor}
            setShowAssigneeDropdownFor={setShowAssigneeDropdownFor}
            assigneeDropdownRef={assigneeDropdownRef}
          />
        </div>
      </div>
    </>
  );
};

export default SprintItem;
