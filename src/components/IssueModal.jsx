import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoMdClose } from 'react-icons/io';
import { toast } from 'react-toastify';
import {
  createIssue,
  updateIssue
} from '../redux/currentworkspace/currentWorkspaceThunk';
import StatusDropdown from './issue/StatusDropdown';
import EpicSelector from './issue/EpicSelector';
import AssigneeSelector from './issue/AssigneeSelector';

export default function IssueModal({
  isOpen,
  onClose,
  issueId,
  mode,
  projectId
}) {
  const dispatch = useDispatch();

  // Grab both lists
  const epics = useSelector((s) => s.currentWorkspace.epics) || [];
  const issues = useSelector((s) => s.currentWorkspace.issues) || [];
  const members = useSelector((s) => s.currentWorkspace.members) || [];

  // Find the “issue” by ID, falling back to the epics list
  const issue = useSelector((s) => {
    const fromIssues = issues.find((i) => i.id === issueId);
    if (fromIssues) return fromIssues;
    return epics.find((e) => e.id === issueId);
  });

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

  // Initialize whenever modal opens, or the issue/epics change
  useEffect(() => {
    if (!isOpen) return;
    if (mode === 'edit' && issue) {
      setTitle(issue.title || '');
      setDescription(issue.description || '');
      setStatus(issue.status || 'todo');
      setIssueType(issue.type || 'task');
      setAssignee(issue.assignee || '');
      setParentId(issue.parent || '');
      setStartDate(issue.start_date || '');
      setEndDate(issue.end_date || '');
    } else {
      // create-mode defaults
      setTitle('');
      setDescription('');
      setStatus('todo');
      setIssueType('task');
      setAssignee('');
      setParentId('');
      setStartDate('');
      setEndDate('');
      setDateError('');
    }
  }, [isOpen, mode, issue, epics]);

  // If user selects “epic” type, clear parent
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
      if (mode === 'create') {
        await dispatch(createIssue({ issueData: formData, projectId })).unwrap();
        toast.success('Issue created!');
      } else {
        await dispatch(
          updateIssue({ issueId: issue.id, issueData: formData, projectId })
        ).unwrap();
        toast.success('Issue updated!');
      }
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Save failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;
  const today = new Date().toISOString().split('T')[0];
  const minEnd = startDate || today;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white rounded-lg shadow-xl w-full max-w-3xl overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">
            {mode === 'create' ? 'Create Issue' : 'Edit Issue'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded">
            <IoMdClose size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded h-32"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left */}
            <div className="space-y-4">
              {/* Issue Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Issue Type
                </label>
                <select
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                >
                  <option value="task">Task</option>
                  <option value="bug">Bug</option>
                  <option value="story">Story</option>
                  <option value="epic">Epic</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Status
                </label>
                {mode === 'edit' ? (
                  <StatusDropdown issue={{ id: issue.id, status }} />
                ) : (
                  <>
                    <div className="relative">
                      <select
                        className="w-full p-2 pl-4 pr-8 border border-gray-600 rounded bg-gray-800 text-white"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        {statusOptions.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-3 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          statusOptions.find((o) => o.value === status)?.color
                        } mr-2`}
                      />
                      <span className="text-sm">
                        {statusOptions.find((o) => o.value === status)?.label}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={today}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    className={`w-full p-2 bg-gray-800 border ${
                      dateError ? 'border-red-500' : 'border-gray-600'
                    } rounded`}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={minEnd}
                  />
                </div>
              </div>
              {dateError && <p className="text-red-500 text-sm">{dateError}</p>}
            </div>

            {/* Right */}
            <div className="space-y-4">
              {/* Parent Epic */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Parent Epic
                  {issueType === 'epic' && (
                    <span className="text-gray-500 text-xs ml-2">(N/A)</span>
                  )}
                </label>
                {issueType === 'epic' ? (
                  <div className="p-2 bg-gray-800 border border-gray-600 rounded text-gray-400">
                    N/A for Epic
                  </div>
                ) : mode === 'edit' ? (
                  <EpicSelector issue={issue} />
                ) : (
                  <select
                    className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
                    value={parentId}
                    onChange={(e) => setParentId(e.target.value)}
                  >
                    <option value="">No parent epic</option>
                    {epics.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Assignee */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Assignee
                </label>
                {mode === 'edit' ? (
                  <AssigneeSelector issue={issue} />
                ) : (
                  <select
                    className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {members.map((m) => (
                      <option key={m.user_id} value={m.user_id}>
                        {m.user_email}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center px-6 py-4 bg-gray-800 border-t border-gray-700 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 rounded text-white ${
              dateError || isLoading
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500'
            }`}
            disabled={!!dateError || isLoading}
          >
            {isLoading
              ? mode === 'create'
                ? 'Creating…'
                : 'Updating…'
              : mode === 'create'
              ? 'Create Issue'
              : 'Update Issue'}
          </button>
        </div>
      </div>
    </div>
  );
}
