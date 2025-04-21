import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { createIssue } from "../redux/currentworkspace/currentWorkspaceThunk";
import api from "../api";

function IssueSection({
  title,
  dateRange,
  visibleItems,
  totalItems,
  issues,
  isSprintSection,
  onAddIssue,
  onStartSprint,
  onDropIssue
}) {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(true);
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [newIssueText, setNewIssueText] = useState("");
  const [issueType, setIssueType] = useState("Task");
  const [checked, setChecked] = useState(false);
  const [individualChecked, setIndividualChecked] = useState({});
  const [showEpicDropdownFor, setShowEpicDropdownFor] = useState(null);

  const projectId = useSelector((state) => state.currentWorkspace.currentProject.id);
  const epics = useSelector((state) => state.currentWorkspace.epics);

  const inputRef = useRef(null);
  const inputContainerRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleCreateClick = () => {
    setShowCreateInput(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSubmitIssue = () => {
    if (!newIssueText.trim()) return;

    dispatch(
      createIssue({
        issueData: {
          title: newIssueText,
          type: issueType.toLowerCase(),
        },
        projectId,
      })
    );

    setNewIssueText('');
    setShowCreateInput(false);
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    const issueId = e.dataTransfer.getData('text/plain');
    onDropIssue?.(issueId, isSprintSection);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputContainerRef.current &&
        !inputContainerRef.current.contains(event.target)
      ) {
        setShowCreateInput(false);
        setNewIssueText("");
      }

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowEpicDropdownFor(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMainCheckboxChange = (e) => {
    const newCheckedState = e.target.checked;
    setChecked(newCheckedState);
    setIndividualChecked(
      issues.reduce((acc, issue) => {
        acc[issue.id] = newCheckedState;
        return acc;
      }, {})
    );
  };

  const handleIndividualCheckboxChange = (e, issueId) => {
    setIndividualChecked({
      ...individualChecked,
      [issueId]: e.target.checked,
    });
  };

  const toggleEpicSelector = (issueId) => {
    setShowEpicDropdownFor(prev => (prev === issueId ? null : issueId));
  };

  const handleAddParent = async (issueId, epicId) => {
    try {
      await api.post('/api/v1/project/issue/assign-parent/', {
        issue_id: issueId,
        epic_id: epicId,
      });
      setShowEpicDropdownFor(null);
    } catch (error) {
      console.error("Failed to assign epic:", error);
    }
  };

  return (
    <div
      className="bg-gray-900 rounded-2xl shadow-md mb-6 border border-gray-700"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Header */}
      <div className="flex items-center px-4 py-3 border-b border-gray-800">
        <input
          type="checkbox"
          className="mr-2 text-gray-300"
          checked={checked}
          onChange={handleMainCheckboxChange}
        />
        <button onClick={() => setExpanded(!expanded)} className="mr-2">
          <ExpandMoreIcon className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
        <h2 className="text-base font-semibold text-gray-100 mr-2">{title}</h2>
        {dateRange && <span className="text-sm text-gray-400">{dateRange}</span>}
        <span className="text-sm text-gray-500 ml-2">({visibleItems} of {totalItems} visible)</span>

        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={() => onStartSprint?.()}
            className="text-sm px-3 py-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            {isSprintSection ? 'Start Sprint' : 'Create Sprint'}
          </button>
          <button className="text-gray-400 hover:text-gray-200">
            <MoreHorizIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {expanded && (
        <>
          {/* Issue List */}
          <div className="divide-y divide-gray-800">
            {issues.length > 0 ? (
              issues.map(issue => (
                <div
                  key={issue.id}
                  className="flex items-center px-4 py-2 hover:bg-gray-800 cursor-grab"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', issue.id)}
                >
                  <input
                    type="checkbox"
                    className="mr-3 text-gray-300"
                    checked={individualChecked[issue.id] || false}
                    onChange={(e) => handleIndividualCheckboxChange(e, issue.id)}
                  />
                  <span className="mr-3 text-gray-300">
                    {issue.type === "task" && "✅"}
                    {issue.type === "story" && "📘"}
                    {issue.type === "bug" && "🐞"}
                  </span>
                  <span className="flex-1 font-medium text-gray-100 truncate">{issue.title}</span>
                  <div className="flex items-center gap-2">
                    {!issue.parent ? (
                      <div className="relative" ref={showEpicDropdownFor === issue.id ? dropdownRef : null}>
                        <button
                          onClick={() => toggleEpicSelector(issue.id)}
                          className="text-green-400 text-sm hover:underline"
                        >
                          ➕
                        </button>
                        {showEpicDropdownFor === issue.id && (
                          <div className="absolute z-10 mt-1 w-48 bg-gray-900 border border-gray-700 rounded shadow-lg">
                            {Array.isArray(epics) && epics.length > 0 ? (
                              epics.map(epic => (
                                <div
                                  key={epic.id}
                                  className="px-3 py-2 hover:bg-gray-700 cursor-pointer text-white"
                                  onClick={() => handleAddParent(issue.id, epic.id)}
                                >
                                  {epic.title}
                                </div>
                              ))
                            ) : (
                              <div className="p-2 text-gray-400">No epics found</div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="bg-purple-700 text-purple-100 text-xs px-2 py-1 rounded-full">
                        {issue.parent}
                      </span>
                    )}
                    <div className="flex items-center bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-md">
                      {issue.status} <ExpandMoreIcon className="w-3 h-3 ml-1" />
                    </div>
                    <span className="mx-2 text-gray-500">-</span>
                    {issue.assignee === "AN" ? (
                      <div className="w-8 h-8 rounded-full bg-green-600 text-white text-sm flex items-center justify-center">AN</div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-800 text-gray-400 flex items-center justify-center">
                        <CheckCircleIcon className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500 border-b border-gray-800">
                this is empty
              </div>
            )}
          </div>

          {/* Create Input / Button */}
          <div className="px-4 py-3" ref={inputContainerRef}>
            {showCreateInput ? (
              <div className="flex gap-2 items-center">
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="px-2 py-1 bg-gray-800 border border-gray-700 text-gray-100 rounded-md text-xs focus:outline-none"
                >
                  <option value="Task">✅ Task</option>
                  <option value="Story">📘 Story</option>
                  <option value="Bug">🐞 Bug</option>
                </select>
                <input
                  ref={inputRef}
                  type="text"
                  className="flex-1 px-2 py-1 bg-gray-800 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 text-sm"
                  placeholder={isSprintSection ? "Add issue to sprint..." : "Add issue to backlog..."}
                  value={newIssueText}
                  onChange={(e) => setNewIssueText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSubmitIssue(issueType);
                    else if (e.key === 'Escape') setShowCreateInput(false);
                  }}
                />
                <button
                  onClick={() => handleSubmitIssue(issueType)}
                  className="px-2 py-1 text-xs text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                >
                  Add
                </button>
              </div>
            ) : (
              <button
                onClick={handleCreateClick}
                className="text-sm font-medium text-blue-500 hover:text-blue-300 flex items-center"
              >
                <span className="mr-1">+</span> Create
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default IssueSection;
