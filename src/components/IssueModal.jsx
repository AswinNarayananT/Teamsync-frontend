import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoMdClose } from 'react-icons/io';
import { createIssue, updateIssue,fetchIssueById } from '../redux/currentworkspace/currentWorkspaceThunk';
import { toast } from 'react-toastify';
import api from '../api';

const IssueModal = ({ isOpen, onClose, issueId, mode, projectId }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [issueType, setIssueType] = useState('task');
  const [assignee, setAssignee] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dateError, setDateError] = useState('');
  const [parentId, setParentId] = useState(null);

  const projectMembers = useSelector((state) => state.currentWorkspace.members);
  const epics = useSelector((state) => state.currentWorkspace.epics);

  const fetchIssueDetails = async () => {
    if (issueId && mode === 'edit') {
      setIsLoading(true);
      try {
        const issueData = await dispatch(fetchIssueById(issueId)).unwrap(); 
  
        setTitle(issueData.title);
        setDescription(issueData.description || '');
        setStatus(issueData.status);
        setIssueType(issueData.type);
        setAssignee(issueData.assignee);
        setStartDate(issueData.start_date || '');
        setEndDate(issueData.end_date || '');
        setParentId(issueData.parent || null);
      } catch (error) {
        toast.error("Failed to load issue details");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setTitle('');
      setDescription('');
      setStatus('todo');
      setIssueType('task');
      setAssignee(null);
      setStartDate('');
      setEndDate('');
      setDateError('');
      setParentId(null);
    }
  };

  useEffect(() => {

    if (isOpen) {
      fetchIssueDetails();
    }
  }, [issueId, mode, isOpen]);

  useEffect(() => {
    if (issueType === 'epic') {
      setParentId(null);
    }
  }, [issueType]);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end < start) {
        setDateError('End date cannot be before start date');
      } else {
        setDateError('');
      }
    } else {
      setDateError('');
    }
  }, [startDate, endDate]);

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);

    if (endDate && new Date(e.target.value) > new Date(endDate)) {
      setEndDate('');
    }
  };

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
      assignee,
      start_date: startDate || null,
      end_date: endDate || null,
      parent: parentId,
    };

    try {
      if (mode === 'create') {
        dispatch(createIssue({ issueData: formData, projectId }));
        toast.success('Issue created successfully!');
      } else if (mode === 'edit') {
        dispatch(updateIssue({ issueId, issueData: formData, projectId }));
        toast.success('Issue updated successfully!');
      }
      onClose();
    } catch (error) {
      toast.error('Failed to save the issue');
      console.error(error);
    }
  };

  const statusOptions = [
    { value: 'todo', label: 'To Do', color: 'bg-blue-500' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-yellow-500' },
    { value: 'review', label: 'Review', color: 'bg-purple-500' },
    { value: 'done', label: 'Done', color: 'bg-green-500' }
  ];

  const typeOptions = [
    { value: 'task', label: 'Task', icon: '📋' },
    { value: 'bug', label: 'Bug', icon: '🐞' },
    { value: 'story', label: 'Story', icon: '📝' },
    { value: 'epic', label: 'Epic', icon: '🏆' }
  ];

  const today = new Date().toISOString().split('T')[0];

  const minEndDate = startDate || today;

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-30 backdrop-blur-sm">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 bg-gray-800 border-b border-gray-700">
            <h2 className="text-xl font-bold tracking-tight">
              {mode === 'create' ? 'Create Issue' : mode === 'edit' ? 'Edit Issue' : 'View Issue'}
            </h2>
            <button onClick={onClose} className="hover:bg-gray-700 p-1 rounded-md transition-colors duration-200">
              <IoMdClose size={24} />
            </button>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left column - Main inputs */}
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={mode === 'view'}
                    placeholder="Issue title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                  <textarea
                    className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={mode === 'view'}
                    placeholder="Describe the issue in detail..."
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                    <input
                      type="date"
                      className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={startDate}
                      onChange={handleStartDateChange}
                      disabled={mode === 'view'}
                      min={today}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
                    <input
                      type="date"
                      className={`w-full p-2 border ${dateError ? 'border-red-500' : 'border-gray-600'} rounded-md bg-gray-800 text-white focus:ring-2 ${dateError ? 'focus:ring-red-500' : 'focus:ring-blue-500'} focus:border-transparent`}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      disabled={mode === 'view' || !startDate}
                      min={minEndDate}
                    />
                    {!startDate && endDate && (
                      <p className="text-yellow-400 text-xs mt-1">Please select a start date first</p>
                    )}
                    {dateError && (
                      <p className="text-red-500 text-xs mt-1">{dateError}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right column - Selections */}
              <div className="md:w-64 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                  <div className="relative">
                    <select
                      className="w-full p-2 pl-4 pr-8 border border-gray-600 rounded-md bg-gray-800 text-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      disabled={mode === 'view'}
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {/* Status indicator */}
                  <div className="mt-2 flex items-center">
                    <div className={`w-3 h-3 rounded-full ${statusOptions.find(o => o.value === status)?.color || 'bg-gray-500'} mr-2`}></div>
                    <span className="text-sm">{statusOptions.find(o => o.value === status)?.label}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Issue Type</label>
                  <div className="relative">
                    {mode === 'view' || mode === 'edit' ? (
                      <div className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white">
                        <span className="mr-2">{typeOptions.find(t => t.value === issueType)?.icon}</span>
                        {issueType.charAt(0).toUpperCase() + issueType.slice(1)}
                      </div>
                    ) : (
                      <div className="relative">
                        <select
                          className="w-full p-2 pl-4 pr-8 border border-gray-600 rounded-md bg-gray-800 text-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={issueType}
                          onChange={(e) => setIssueType(e.target.value)}
                        >
                          {typeOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.icon} {option.label}</option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-3 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Type indicator */}
                  <div className="mt-2 flex items-center">
                    <span className="text-lg mr-2">{typeOptions.find(t => t.value === issueType)?.icon}</span>
                    <span className="text-sm">{typeOptions.find(t => t.value === issueType)?.label}</span>
                  </div>
                </div>

                {/* Parent Epic Field - Show for all types except Epic */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Parent Epic
                    {issueType === 'epic' && <span className="text-gray-500 text-xs ml-2">(Not applicable)</span>}
                  </label>
                  <div className="relative">
                    {issueType === 'epic' ? (
                      <div className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-400 cursor-not-allowed">
                        Not applicable for Epics
                      </div>
                    ) : (
                      <>
                        <select
                          className="w-full p-2 pl-4 pr-8 border border-gray-600 rounded-md bg-gray-800 text-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={parentId || ''}
                          onChange={(e) => setParentId(e.target.value ? Number(e.target.value) : null)}
                          disabled={mode === 'view' || issueType === 'epic'}
                        >
                          <option value="">No parent epic</option>
                          {epics.map((epic) => (
                            <option key={epic.id} value={epic.id}>
                              {epic.title}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-3 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </>
                    )}
                  </div>
                  {/* Parent Epic indicator */}
                  {parentId && issueType !== 'epic' && (
                    <div className="mt-2 flex items-center">
                      <span className="text-lg mr-2">🏆</span>
                      <span className="text-sm truncate">
                        {epics.find(epic => epic.id === parentId)?.title || 'Selected Epic'}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Assignee</label>
                  <div className="relative">
                    <select
                      className="w-full p-2 pl-4 pr-8 border border-gray-600 rounded-md bg-gray-800 text-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={assignee || ''}
                      onChange={(e) => setAssignee(e.target.value ? Number(e.target.value) : null)}
                      disabled={mode === 'view'}
                    >
                      <option value="">Unassigned</option>
                      {projectMembers.map(member => (
                        <option key={member.user_id} value={member.user_id}>
                          {member.user_email}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {/* Assignee indicator */}
                  {assignee && (
                    <div className="mt-2 flex items-center">
                      <div className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">
                        {(projectMembers.find(m => m.user_id === assignee)?.user_email || '').charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm truncate">
                        {projectMembers.find(m => m.user_id === assignee)?.user_email || 'Selected User'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-700">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors duration-200"
              >
                Cancel
              </button>
              {mode !== 'view' && (
                <button
                  onClick={handleSubmit}
                  className={`px-4 py-2 ${dateError ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'} text-white rounded-md transition-colors duration-200 flex items-center`}
                  disabled={isLoading || !!dateError}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {mode === 'create' ? 'Creating...' : 'Updating...'}
                    </>
                  ) : (
                    mode === 'create' ? 'Create Issue' : 'Update Issue'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default IssueModal;