import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { createIssue } from "../redux/currentworkspace/currentWorkspaceThunk";
import { HiX } from "react-icons/hi";
import api from "../api";

const ISSUE_TYPES = {
  epic: "Epic",
  story: "Story",
  task: "Task",
  bug: "Bug",
};

const STATUS_CHOICES = {
  todo: "To Do",
  in_progress: "In Progress",
  review: "In Review",
  done: "Done"
};

const IssueModal = ({ 
  isOpen, 
  onClose, 
  mode = "create", 
  issueId = null,
  type = "task", 
  defaultValues = {}, 
  projectId,
}) => {
  // Form states
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [issueType, setIssueType] = useState(type);
  const [parentIssue, setParentIssue] = useState(null);
  const [assignee, setAssignee] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [availableParents, setAvailableParents] = useState([]);
  
  // File upload states
  const [attachments, setAttachments] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const epics = useSelector((state) => state.currentWorkspace.epics);
  const members = useSelector((state) => state.currentWorkspace.members)
  
  
  useEffect(() => {
    if (issueType === "epic") {
      setParentIssue(null);
    }
  }, [issueType]);

  // Fetch issue details if editing or viewing
  useEffect(() => {
    const fetchIssueDetails = async () => {
      if (issueId && (mode === "edit" || mode === "view")) {
        setIsLoading(true);
        try {
          const response = await api.get(`/api/v1/project/issue/${issueId}/`);
          const issueData = response.data;
          
          setTitle(issueData.title);
          setDescription(issueData.description || "");
          setStatus(issueData.status);
          setIssueType(issueData.type);
          setParentIssue(issueData.parent);
          setAssignee(issueData.assignee);
          setStartDate(issueData.start_date || "");
          setEndDate(issueData.end_date || "");
          
          // Load attachments if they exist
          if (issueData.attachments) {
            setUploadedFiles(issueData.attachments);
          }
        } catch (error) {
          toast.error("Failed to load issue details");
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      } else {
        resetForm();
      }
    };

    if (isOpen) {
      fetchIssueDetails();
    }
  }, [issueId, mode, isOpen, projectId]);

  const resetForm = () => {
    setTitle(defaultValues?.title || "");
    setDescription(defaultValues?.description || "");
    setStatus(defaultValues?.status || "todo");
    setIssueType(defaultValues?.type || type);
    setParentIssue(defaultValues?.parent || null);
    setAssignee(defaultValues?.assignee || null);
    setStartDate(defaultValues?.start_date || "");
    setEndDate(defaultValues?.end_date || "");
    setAttachments([]);
    setUploadedFiles([]);
  };

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments([...attachments, ...newFiles]);
    }
  };

  const removeAttachment = (index) => {
    const updatedAttachments = [...attachments];
    updatedAttachments.splice(index, 1);
    setAttachments(updatedAttachments);
  };

  const removeUploadedFile = async (fileId) => {
    try {
      setUploadedFiles(uploadedFiles.filter(file => file.id !== fileId));
      toast.success("Attachment removed");
    } catch (error) {
      toast.error("Failed to remove attachment");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!title) {
      toast.error("Title is required");
      return;
    }
  
    setIsLoading(true);
  
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("type", issueType);
    formData.append("status", status);
    formData.append("project", projectId);
  
    if (parentIssue) formData.append("parent", parentIssue);
    if (assignee) formData.append("assignee", assignee);
    if (startDate) formData.append("start_date", startDate);
    if (endDate) formData.append("end_date", endDate);
  
    attachments.forEach(file => {
      formData.append("attachments", file);
    });
  
    try {
      const resultAction = await dispatch(createIssue({ issueData: formData, projectId }));
  
      if (createIssue.fulfilled.match(resultAction)) {
        toast.success(`${ISSUE_TYPES[issueType]} created successfully`);
        onClose();
      } else {
        throw resultAction.payload;
      }
    } catch (error) {
      console.error(error);
      toast.error(typeof error === "string" ? error : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {mode === "view"
                ? `View ${ISSUE_TYPES[issueType]}`
                : mode === "edit"
                ? `Edit ${ISSUE_TYPES[issueType]}`
                : `Create ${ISSUE_TYPES[issueType]}`}
            </span>
            {issueId && <span className="text-sm text-gray-500 dark:text-gray-400">#{issueId}</span>}
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
          <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Content - Left 2/3 */}
            <div className="md:col-span-2 space-y-6">
              {/* Title Field */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  disabled={mode === "view" || isLoading}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter title"
                  required
                />
              </div>

              {/* Description Field */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                {/* Toolbar */}
                <div className="border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                  <div className="flex items-center bg-gray-50 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600 p-1">
                    <div className="flex space-x-1">
                      <button type="button" className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
                        <span className="font-bold">B</span>
                      </button>
                      <button type="button" className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
                        <span className="italic">I</span>
                      </button>
                      <span className="border-r border-gray-300 dark:border-gray-600 mx-1"></span>
                      <button type="button" className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5.5 4a.5.5 0 000 1h9a.5.5 0 000-1h-9zM5 7.5a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zM5.5 10a.5.5 0 000 1h9a.5.5 0 000-1h-9z"></path>
                        </svg>
                      </button>
                      <button type="button" className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6 7.5a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zM6.5 10a.5.5 0 000 1h9a.5.5 0 000-1h-9z"></path>
                          <circle cx="3.5" cy="8" r="1"></circle>
                          <circle cx="3.5" cy="10.5" r="1"></circle>
                        </svg>
                      </button>
                      <span className="border-r border-gray-300 dark:border-gray-600 mx-1"></span>
                      <button type="button" className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 3a1 1 0 011 1v4h4a1 1 0 110 2H9v4a1 1 0 11-2 0v-4H3a1 1 0 110-2h4V4a1 1 0 011-1z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <textarea
                    id="description"
                    value={description}
                    disabled={mode === "view" || isLoading}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 focus:outline-none border-none dark:bg-gray-700 dark:text-white resize-y"
                    placeholder="Type / for commands or @ to mention someone."
                  ></textarea>
                </div>
              </div>

              {/* Attachments Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Attachments
                </label>
                <div className="border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-gray-50 dark:bg-gray-700">
                  {/* Already uploaded files */}
                  {uploadedFiles.length > 0 && (
                    <div className="mb-3 space-y-2">
                      <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Current files</h4>
                      <div className="space-y-2">
                        {uploadedFiles.map((file) => (
                          <div key={file.id} className="flex items-center justify-between bg-white dark:bg-gray-800 rounded p-2 text-sm">
                            <div className="flex items-center space-x-2">
                              <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                              </svg>
                              <span className="text-gray-700 dark:text-gray-300 truncate max-w-xs">{file.filename}</span>
                            </div>
                            {mode !== "view" && (
                              <button 
                                type="button" 
                                onClick={() => removeUploadedFile(file.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* New attachments */}
                  {attachments.length > 0 && (
                    <div className="mb-3 space-y-2">
                      <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">New files to upload</h4>
                      <div className="space-y-2">
                        {attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-white dark:bg-gray-800 rounded p-2 text-sm">
                            <div className="flex items-center space-x-2">
                              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                              <span className="text-gray-700 dark:text-gray-300 truncate max-w-xs">{file.name}</span>
                            </div>
                            <button 
                              type="button" 
                              onClick={() => removeAttachment(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload button */}
                  {mode !== "view" && (
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        multiple
                      />
                      <button
                        type="button"
                        onClick={triggerFileInput}
                        disabled={isLoading}
                        className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Files
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar - Right 1/3 */}
            <div className="space-y-6">
              {/* Status Field */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  disabled={mode === "view" || isLoading}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                >
                  {Object.entries(STATUS_CHOICES).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Issue Type Field */}
              <div>
                <label htmlFor="issueType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Issue Type
                </label>
                <select
                  id="issueType"
                  value={issueType}
                  disabled={mode === "view" || isLoading}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                >
                  {Object.entries(ISSUE_TYPES).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Parent Issue Field */}
              <div>
                <label htmlFor="parent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Parent Issue
                </label>
                <div className="relative">
                  <select
                    id="parent"
                    value={parentIssue || ""}
                    disabled={mode === "view" || isLoading || issueType === "epic"}
                    onChange={(e) => setParentIssue(e.target.value || null)}
                    className={`w-full pr-8 px-3 py-2 border rounded-md shadow-sm focus:outline-none 
                      focus:ring-blue-500 focus:border-blue-500 
                      ${issueType === "epic" ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-400" : "bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"}`}
                  >
                    {!parentIssue && <option value="">Select parent</option>}

                    {parentIssue && !epics?.find((epic) => epic.id === parseInt(parentIssue)) && (
                      <option value={parentIssue}>{parentIssue}</option>
                    )}

                    {epics
                      ?.filter((epic) => epic.id !== issueId)
                      .map((epic) => (
                        <option key={epic.id} value={epic.id}>
                          {epic.title}
                        </option>
                      ))}
                  </select>

                  {parentIssue && issueType !== "epic" && (
                    <HiX
                      onClick={() => setParentIssue(null)}
                      className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 cursor-pointer text-sm"
                    />
                  )}
                </div>
              </div>

              {/* Assignee Field */}
              <div>
                <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Assignee
                </label>
                <div className="relative">
                  <select
                    id="assignee"
                    value={assignee || ""}
                    disabled={mode === "view" || isLoading}
                    onChange={(e) => setAssignee(e.target.value || null)}
                    className="w-full pr-8 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                  >
                    {!assignee && <option value="">Unassigned</option>}

                    {assignee && !members?.find((m) => m.id === parseInt(assignee)) && (
                      <option value={assignee}>{assignee}</option>
                    )}

                    {members?.map((member) => (
                      <option key={member.id} value={member.user_id}>
                        {member.user_email || member.user_name}
                      </option>
                    ))}
                  </select>

                  {assignee && (
                    <HiX
                    onClick={() => setParentIssue(null)}
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 cursor-pointer text-sm"
                  />
                  )}
                </div>
              </div>

            {/* Date Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  disabled={mode === "view" || isLoading}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]} // Prevent selecting past dates
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  disabled={mode === "view" || isLoading}
                  onChange={(e) => {
                    // Ensure end date is after start date
                    const selectedEndDate = e.target.value;
                    if (selectedEndDate >= startDate) {
                      setEndDate(selectedEndDate);
                    }
                  }}
                  min={startDate || new Date().toISOString().split('T')[0]} // Prevent selecting end date before start date
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 sticky bottom-0">
          {mode !== "view" ? (
            <>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md focus:outline-none transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none transition-colors flex items-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : mode === "edit" ? "Save Changes" : "Create Issue"}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  // Implement edit functionality when in view mode
                  // This could be a prop like onEdit(issueId)
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none transition-colors"
              >
                Edit Issue
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md focus:outline-none transition-colors"
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default IssueModal;