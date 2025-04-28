import { useState, useRef } from 'react';
import { useDrag } from 'react-dnd';
import EpicSelector from './EpicSelector';
import StatusDropdown from './StatusDropdown';
import AssigneeSelector from './AssigneeSelector';
import IssueOptionsDropdown from './IssueOptionsDropdown';
import IssueModal from '../IssueModal';

const IssueItem = ({
  issue,
  individualChecked,
  handleIndividualCheckboxChange,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'issue',
    item: { id: issue.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [showEpicDropdownFor, setShowEpicDropdownFor] = useState(null);
  const [showStatusDropdownFor, setShowStatusDropdownFor] = useState(null);
  const [showAssigneeDropdownFor, setShowAssigneeDropdownFor] = useState(null);
  const [showOptionsDropdownFor, setShowOptionsDropdownFor] = useState(null);
  
  // Modal state for displaying the IssueModal
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState(null);

  const epicDropdownRef = useRef(null);
  const statusDropdownRef = useRef(null);
  const assigneeDropdownRef = useRef(null);
  const optionsDropdownRef = useRef(null);

  const handleIssueTitleClick = (issueId) => {
    setSelectedIssueId(issueId);
    setIsIssueModalOpen(true); // Open the modal when the issue title is clicked
  };

  return (
    <>
      <div
        ref={drag}
        className={`flex items-center px-4 py-3 hover:bg-gray-800/70 transition-colors cursor-grab group ${isDragging ? 'opacity-50' : ''}`}
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
          onClick={() => handleIssueTitleClick(issue.id)} // Open modal on click
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

      {/* Issue Modal */}
      {isIssueModalOpen && selectedIssueId && (
        <IssueModal
          isOpen={isIssueModalOpen}
          onClose={() => setIsIssueModalOpen(false)} // Close the modal
          issueId={selectedIssueId}
          mode="edit"
        />
      )}
    </>
  );
};

export default IssueItem;
