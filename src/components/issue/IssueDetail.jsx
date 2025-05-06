import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { updateIssue } from '../../redux/currentworkspace/currentWorkspaceThunk';
import StatusDropdown from './StatusDropdown';
import EpicSelector from './EpicSelector';
import AssigneeSelector from './AssigneeSelector';
import IssueItem from './IssueItem';
import CreateIssueInput from './CreateIssueInput';
import AttachmentsSection from './AttachmentsSection';

export default function IssueDetail({ isOpen, onClose, issueId, projectId }) {
  const dispatch = useDispatch();

  // Selector data
  const epics = useSelector((s) => s.currentWorkspace.epics) || [];
  const issues = useSelector((s) => s.currentWorkspace.issues) || [];
  const members = useSelector((s) => s.currentWorkspace.members) || [];

  // Find the current issue
  const issue = useSelector((s) => {
    const fromIssues = issues.find((i) => i.id === issueId);
    if (fromIssues) return fromIssues;
    return epics.find((e) => e.id === issueId);
  });

  // Find child issues for epics
  const childItems = issues.filter(i => i.parent === issueId);
  const completedItems = childItems.filter(i => i.status === 'done').length;
  const progressPercentage = childItems.length > 0 ? (completedItems / childItems.length) * 100 : 0;
  
  const statusOptions = [
    { value: 'todo', label: 'To Do', color: 'bg-blue-500' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-yellow-500' },
    { value: 'review', label: 'Review', color: 'bg-purple-500' },
    { value: 'done', label: 'Done', color: 'bg-green-500' }
  ];

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [issueType, setIssueType] = useState('task');
  const [assignee, setAssignee] = useState('');
  const [parentId, setParentId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateError, setDateError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [individualChecked, setIndividualChecked] = useState({});

  // Initialize form data when modal opens or issue changes
  useEffect(() => {
    if (!isOpen || !issue) return;
    
    setTitle(issue.title || '');
    setDescription(issue.description || '');
    setStatus(issue.status || 'todo');
    setIssueType(issue.type || 'task');
    setAssignee(issue.assignee || '');
    setParentId(issue.parent || '');
    setStartDate(issue.start_date || '');
    setEndDate(issue.end_date || '');
  }, [isOpen, issue]);

  // Reset parent if type is epic
  useEffect(() => {
    if (issueType === 'epic') setParentId('');
  }, [issueType]);

  // Validate dates
  useEffect(() => {
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      setDateError('End date cannot be before start date');
    } else {
      setDateError('');
    }
  }, [startDate, endDate]);

  const handleSubmit = async () => {
    if (dateError) {
      toast.error(dateError);
      return;
    }
    
    const formData = {
      title,
      description,
      status,
      type: issueType,
      assignee: assignee || null,
      parent: parentId || null,
      start_date: startDate || null,
      end_date: endDate || null
    };
    
    try {
      setIsLoading(true);
      await dispatch(
        updateIssue({ issueId: issue.id, issueData: formData, projectId })
      ).unwrap();
      toast.success('Issue updated successfully');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update issue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleIndividualCheckboxChange = (e, issueId) => {
    setIndividualChecked({
      ...individualChecked,
      [issueId]: e.target.checked,
    });
  };

  if (!isOpen) return null;
  
  const today = new Date().toISOString().split('T')[0];
  const minEnd = startDate || today;
  const currentStatus = statusOptions.find(s => s.value === status) || statusOptions[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-900 text-gray-200 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-auto border border-gray-700">
        {/* Header */}
        <div className="flex items-center px-5 py-3 border-b border-gray-700 bg-gray-800">
          <span className="text-purple-400 font-medium mr-2">ECOM-{issue?.id || '8'}</span>
          
          <div className="ml-auto flex items-center gap-3">
            <button className="p-2 rounded hover:bg-gray-700 text-gray-400 hover:text-gray-200 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
            <span className="text-gray-500">1</span>
            
            <button className="p-2 rounded hover:bg-gray-700 text-gray-400 hover:text-gray-200 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"></path>
                <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
              </svg>
            </button>
            
            <button className="p-2 rounded hover:bg-gray-700 text-gray-400 hover:text-gray-200 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
            </button>
            
            <button className="p-2 rounded hover:bg-gray-700 text-gray-400 hover:text-gray-200 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </button>
            
            <button 
              onClick={onClose} 
              className="p-2 rounded hover:bg-gray-700 text-gray-400 hover:text-gray-200 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Title card */}
        <div className="p-5 flex flex-col">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded bg-purple-900 flex items-center justify-center mr-3 text-purple-300">
              <span className="text-lg font-bold">
                {(title || "I").charAt(0).toUpperCase()}
              </span>
            </div>
            <input
              type="text"
              className="text-xl font-medium bg-transparent border-0 outline-none focus:ring-1 focus:ring-purple-500 rounded px-2 py-1 w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Issue title"
            />
          </div>
          
          <div className="flex items-center mb-4">
            <StatusDropdown issue={{ id: issue?.id, status }} />
          </div>
        </div>
        
        {/* Description section */}
        <div className="px-5 py-3 border-t border-gray-800">
          <h3 className="font-medium text-gray-300 mb-2">Description</h3>
          <textarea
            className="w-full p-3 mt-1 text-gray-300 bg-gray-800 border border-gray-700 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description..."
            rows={3}
          />
        </div>

        {issueType === 'epic' && (
            <div className="px-5 py-3 border-t border-gray-800">
                {/* Child work items section */}
                <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-300">Child work items</h3>
                <span className="text-sm text-gray-500">
                    {completedItems}/{childItems.length} completed
                </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-gray-800 rounded-full mb-3">
                <div
                    className="h-full bg-purple-600 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                />
                </div>

                {/* Child items list */}
                {childItems.length > 0 ? (
                <div className="mb-4 bg-gray-800 rounded-lg overflow-hidden">
                    <div className="divide-y divide-gray-700">
                    {childItems.map((item) => (
                        <IssueItem
                        key={item.id}
                        issue={item}
                        individualChecked={individualChecked}
                        handleIndividualCheckboxChange={handleIndividualCheckboxChange}
                        />
                    ))}
                    </div>
                </div>
                ) : (
                <div className="py-6 text-center text-gray-500 bg-gray-800 rounded-lg mb-4 italic">
                    No child items yet
                </div>
                )}

                {/* Create sub-issue input */}
                <div className="mb-4">
                <CreateIssueInput parentId={issueId} />
                </div>
            </div>
            )}

        
        {/* Details section */}
        <div className="px-5 py-3 border-t border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-300">Details</h3>
            <div className="flex">
              <button className="p-1 text-gray-400 hover:text-gray-200">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
              </button>
              <button className="p-1 ml-2 text-gray-400 hover:text-gray-200">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Assignee */}
          <div className="mb-5">
            <h4 className="text-sm text-gray-400 mb-2">Assignee</h4>
            <AssigneeSelector issue={issue} />
            <button 
              className="text-purple-400 text-sm mt-2 hover:text-purple-300 transition-colors"
              onClick={() => {
                // Find the first member (assuming it's the current user)
                const firstMember = members[0];
                if (firstMember) {
                  setAssignee(firstMember.user_id);
                }
              }}
            >
              Assign to me
            </button>
          </div>
          
          {/* Parent Epic */}
          <div className="mb-5">
            <h4 className="text-sm text-gray-400 mb-2">
              Parent 
              {issueType === 'epic' && (
                <span className="text-gray-500 text-xs ml-2">(Not applicable)</span>
              )}
            </h4>
            {issueType === 'epic' ? (
              <div className="p-3 bg-gray-800 border border-gray-700 rounded text-gray-500">
                Epic Type cannot have parent
              </div>
            ) : (
              <EpicSelector issue={issue} />
            )}
          </div>
          
          {/* Dates */}
          <div className="mb-5">
            <h4 className="text-sm text-gray-400 mb-2">Due date</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Start</label>
                <input
                  type="date"
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-gray-300"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={today}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">End</label>
                <input
                  type="date"
                  className={`w-full p-2 bg-gray-800 border ${
                    dateError ? 'border-red-500' : 'border-gray-700'
                  } rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-gray-300`}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={minEnd}
                />
              </div>
            </div>
            {dateError && <p className="text-red-400 text-sm mt-2">{dateError}</p>}
          </div>

          <AttachmentsSection issueId={issue.id} />
          
        </div>
        
        {/* Footer with buttons */}
        <div className="flex justify-end items-center px-5 py-4 bg-gray-800 border-t border-gray-700 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 rounded text-white ${
              dateError || isLoading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-500'
            } transition-colors flex items-center`}
            disabled={!!dateError || isLoading}
          >
            {isLoading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isLoading ? 'Updating...' : 'Update Issue'}
          </button>
        </div>
      </div>
    </div>
  );
}