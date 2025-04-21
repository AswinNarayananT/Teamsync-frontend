import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const ISSUE_TYPES = {
  epic: "Epic",
  story: "Story",
  task: "Task",
  bug: "Bug",
};

const IssueModal = ({ isOpen, onClose, mode = "create", type = "task", defaultValues = {}, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  useEffect(() => {
    if (mode === "view" || mode === "edit") {
      setTitle(defaultValues?.title || "");
      setDescription(defaultValues?.description || "");
    } else {
      setTitle("");
      setDescription("");
    }
  }, [mode, defaultValues, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      toast.error("Title is required");
      return;
    }
    
    const payload = {
      title,
      description,
      type,
      ...(defaultValues?.parent && { parent: defaultValues.parent }),
    };
    
    try {
      await onSubmit(payload);
      toast.success(`${ISSUE_TYPES[type]} ${mode === "edit" ? "updated" : "created"} successfully`);
      onClose();
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-md shadow-lg w-full max-w-xl">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            {mode === "view"
              ? `View ${ISSUE_TYPES[type]}`
              : mode === "edit"
              ? `Edit ${ISSUE_TYPES[type]}`
              : `Create ${ISSUE_TYPES[type]}`}
          </h2>
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
        <form onSubmit={handleSubmit}>
          <div className="px-4 py-4">
            {/* Title Field */}
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                disabled={mode === "view"}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter title"
              />
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              {/* Toolbar - similar to Jira's description editor */}
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
                  disabled={mode === "view"}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 focus:outline-none border-none dark:bg-gray-700 dark:text-white"
                  placeholder="Type / for Atlassian Intelligence or @ to mention and notify someone."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 flex justify-between rounded-b-md">
            {mode !== "view" ? (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none"
                >
                  {mode === "edit" ? "Save" : "Create"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md focus:outline-none"
              >
                Close
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueModal;