import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoMdClose } from 'react-icons/io';
import { createIssue, updateIssue } from '../redux/currentworkspace/currentWorkspaceThunk';
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

  const projectMembers = useSelector((state) => state.currentWorkspace.members);
  console.log(projectMembers)

  useEffect(() => {
    const fetchIssueDetails = async () => {
      if (issueId && mode === 'edit') {
        setIsLoading(true);
        try {
          const response = await api.get(`/api/v1/project/issue/${issueId}/`);
          const issueData = response.data;

          setTitle(issueData.title);
          setDescription(issueData.description || '');
          setStatus(issueData.status);
          setIssueType(issueData.type);
          setAssignee(issueData.assignee); // set the assignee user_id
          setStartDate(issueData.start_date || '');
          setEndDate(issueData.end_date || '');
        } catch (error) {
          toast.error('Failed to load issue details');
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      } else {
        // Reset the form when the modal opens in "create" mode
        setTitle('');
        setDescription('');
        setStatus('todo');
        setIssueType('task');
        setAssignee(null);
        setStartDate('');
        setEndDate('');
      }
    };

    if (isOpen) {
      fetchIssueDetails();
    }
  }, [issueId, mode, isOpen]);

  const handleSubmit = async () => {
    const formData = {
      title,
      description,
      status,
      type: issueType,
      assignee,
      start_date: startDate || null,
      end_date: endDate || null,
    };

    try {
      if (mode === 'create') {
        await dispatch(createIssue({ issueData: formData, projectId }));
        toast.success('Issue created successfully!');
      } else if (mode === 'edit') {
        await dispatch(updateIssue({ issueId, issueData: formData, projectId }));
        toast.success('Issue updated successfully!');
      }
      onClose(); // Close the modal after successful submission
    } catch (error) {
      toast.error('Failed to save the issue');
      console.error(error);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-20">
        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-96">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {mode === 'create' ? 'Create Issue' : mode === 'edit' ? 'Edit Issue' : 'View Issue'}
            </h2>
            <button onClick={onClose}>
              <IoMdClose size={24} />
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded bg-gray-700 text-white"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={mode === 'view'}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Description</label>
            <textarea
              className="w-full p-2 border rounded bg-gray-700 text-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={mode === 'view'}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Status</label>
            <select
            className="w-full p-2 border rounded bg-gray-700 text-white"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={mode === 'view'}
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Issue Type</label>
            {mode === 'view' || mode === 'edit' ? (
              <div className="w-full p-2 border rounded bg-gray-700 text-white">
                {issueType} {/* Display issue type as a label */}
              </div>
            ) : (
              <select
                className="w-full p-2 border rounded bg-gray-700 text-white"
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                disabled={mode === 'view'}
              >
                <option value="task">Task</option>
                <option value="bug">Bug</option>
                <option value="epic">Epic</option>
              </select>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Assignee</label>
            <select
  className="w-full p-2 border rounded bg-gray-700 text-white"
  value={assignee || ''}
  onChange={(e) => setAssignee(Number(e.target.value))}
  disabled={mode === 'view'}
>
  {/* Show 'Select Assignee' only when there's no current assignee */}
  {!assignee && <option value="">Select Assignee</option>}

  {/* If there's a current assignee, show it as selected */}
  {assignee && (
    <option value={assignee}>
      {projectMembers.find((member) => member.user_id === assignee)?.user_email || 'Selected User'}
    </option>
  )}

  {/* Show the rest of the members (excluding current assignee) */}
  {projectMembers
    .filter((member) => member.user_id !== assignee)
    .map((member) => (
      <option key={member.user_id} value={member.user_id}>
        {member.user_email}
      </option>
    ))}
</select>
          </div>

          <div className="mb-4 flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium">Start Date</label>
              <input
                type="date"
                className="w-full p-2 border rounded bg-gray-700 text-white"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={mode === 'view'}
              />
            </div>

            <div className="w-1/2">
              <label className="block text-sm font-medium">End Date</label>
              <input
                type="date"
                className="w-full p-2 border rounded bg-gray-700 text-white"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={mode === 'view'}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
            {mode !== 'view' && (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded"
                disabled={isLoading}
              >
                {isLoading ? (mode === 'create' ? 'Creating...' : 'Updating...') : mode === 'create' ? 'Create Issue' : 'Update Issue'}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default IssueModal;
