import { useState, useRef } from 'react';
import { useDrag } from 'react-dnd';
import EpicSelector from './EpicSelector';
import StatusDropdown from './StatusDropdown';
import AssigneeSelector from './AssigneeSelector';
import IssueOptionsDropdown from './IssueOptionsDropdown';
import IssueDetail from './IssueDetail';

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

  // Modal state for displaying the IssueModal
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState(null);

  const handleIssueTitleClick = (issue) => {
    setSelectedIssueId(issue.id);
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
          onClick={() => handleIssueTitleClick(issue)} 
        >
          {issue.title}
        </span>

        <div className="flex items-center gap-3 flex-shrink-0">
          <EpicSelector
            issue={issue}
          />
          <StatusDropdown
            issue={issue}
          />
          <span className="mx-1 text-gray-600">•</span>
          <AssigneeSelector
            issue={issue}
          />
          <IssueOptionsDropdown
            issue={issue}
          />
        </div>
      </div>

      {/* Issue Modal */}
      {isIssueModalOpen && selectedIssueId && (
        <IssueDetail
          isOpen={isIssueModalOpen}
          onClose={() => setIsIssueModalOpen(false)} 
          issueId={selectedIssueId}
        />
      )}
    </>
  );
};

export default IssueItem;
