import { useState } from 'react';
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

  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState(null);

  const handleIssueTitleClick = (issue) => {
    setSelectedIssueId(issue.id);
    setIsIssueModalOpen(true);
  };

  return (
    <>
      <div
        ref={drag}
        className={`grid grid-cols-[1fr_1fr_1fr_1fr_auto] items-center px-4 py-3 hover:bg-gray-800/70 transition-colors cursor-grab group ${
          isDragging ? 'opacity-50' : ''
        }`}
      >
        {/* Title with checkbox and icon */}
        <div className="flex items-center gap-2 overflow-hidden">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-gray-600 text-blue-500 bg-gray-800"
            checked={individualChecked[issue.id] || false}
            onChange={(e) => handleIndividualCheckboxChange(e, issue.id)}
          />
          <span className="text-gray-300">
            {issue.type === 'task' && '✅'}
            {issue.type === 'story' && '📘'}
            {issue.type === 'bug' && '🐞'}
          </span>
          <span
            className="text-gray-100 truncate cursor-pointer"
            onClick={() => handleIssueTitleClick(issue)}
          >
            {issue.title}
          </span>
        </div>

        {/* Epic */}
        <div>
          <EpicSelector issue={issue} />
        </div>

        {/* Status */}
        <div>
          <StatusDropdown issue={issue} />
        </div>

        {/* Assignee */}
        <div>
          <AssigneeSelector issue={issue} />
        </div>

        {/* Action */}
        <div>
          <IssueOptionsDropdown issue={issue} />
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
