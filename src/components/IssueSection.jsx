import { useState, useRef, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from 'react-redux';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { createIssue, assignParentEpic, assignAssigneeToIssue, updateIssueStatus } from "../redux/currentworkspace/currentWorkspaceThunk";
import IssueModal from "./IssueModal";

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
  const [showAssigneeDropdownFor, setShowAssigneeDropdownFor] = useState(null);
  const [showStatusDropdownFor, setShowStatusDropdownFor] = useState(null);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState(null);


  const projectId = useSelector((state) => state.currentWorkspace.currentProject.id);
  const epics = useSelector((state) => state.currentWorkspace.epics);
  const members = useSelector((state) => state.currentWorkspace.members);

  const inputRef = useRef(null);
  const inputContainerRef = useRef(null);
  const dropdownRef = useRef(null);
  const assigneeDropdownRef = useRef(null);


  const epicMap = useMemo(() => {
    const map = {};
    epics.forEach(epic => {
      map[epic.id] = epic.title;
    });
    return map;
  }, [epics]);

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

      if (
        assigneeDropdownRef.current &&
        !assigneeDropdownRef.current.contains(event.target)
      ) {
        setShowAssigneeDropdownFor(null);
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

  const handleAddParent = (issueId, epicId) => {
    dispatch(assignParentEpic({ issueId, epicId }));
    setShowEpicDropdownFor(null);
  };

  const handleAssignMember = (issueId, memberId) => {
    dispatch(assignAssigneeToIssue({ issueId: issueId, memberId: memberId }));
    setShowAssigneeDropdownFor(null);
  };

  const toggleAssigneeSelector = (issueId) => {
    if (showAssigneeDropdownFor === issueId) {
      setShowAssigneeDropdownFor(null);
    } else {
      setShowAssigneeDropdownFor(issueId);
    }
  };

  const getMemberById = (id) => members.find((m) => m.user_id === id) || {};
  const getInitials = (member) => {
    if (member.user_email) {
      return member.user_email.slice(0, 2).toUpperCase();
    }
    return "";
  };

  const toggleStatusDropdown = (issueId) => {
    setShowStatusDropdownFor(showStatusDropdownFor === issueId ? null : issueId);
  };

  const handleStatusChange = (issueId, newStatus) => {
    dispatch(updateIssueStatus({ issueId: issueId, status: newStatus }));
  };


  const handleIssueTitleClick = (issueId) => {
    
    setSelectedIssueId(issueId);
    console.log(selectedIssueId)
    setIsIssueModalOpen(true);
  };
  
  return (
    <div
      className="bg-gray-900 rounded-2xl shadow-md mb-6 border border-gray-700"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-850">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-opacity-25 bg-gray-800"
            checked={checked}
            onChange={handleMainCheckboxChange}
          />
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <ExpandMoreIcon className={`w-4 h-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
          </button>
          <h2 className="text-base font-semibold text-gray-100">{title}</h2>
          {dateRange && <span className="text-sm text-gray-400 ml-2">{dateRange}</span>}
          <span className="text-xs text-gray-500">({visibleItems} of {totalItems} visible)</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onStartSprint?.()}
            className="text-sm px-3 py-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            {isSprintSection ? 'Start Sprint' : 'Create Sprint'}
          </button>
          <button className="text-gray-400 hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-800">
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
                  className="flex items-center px-4 py-3 hover:bg-gray-800/70 transition-colors cursor-grab group"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', issue.id)}
                >
                  <input
                    type="checkbox"
                    className="mr-3 w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-opacity-25 bg-gray-800"
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
                    onClick={() => handleIssueTitleClick(issue.id)} 
                  >
                    {issue.title}
                  </span>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="relative" ref={showEpicDropdownFor === issue.id ? dropdownRef : null}>
                      {!issue.parent ? (
                        <button
                          onClick={() => toggleEpicSelector(issue.id)}
                          className="text-green-400 hover:text-green-300 transition-colors text-sm h-6 w-6 flex items-center justify-center rounded-full hover:bg-gray-700"
                        >
                          ➕
                        </button>
                      ) : (
                        <span
                          onClick={() => toggleEpicSelector(issue.id)}
                          className="bg-purple-700 text-purple-100 text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-purple-600 transition-colors"
                        >
                          {epicMap[issue.parent] || issue.parent}
                        </span>
                      )}

                      {showEpicDropdownFor === issue.id && (
                        <div className="absolute z-100 mt-1 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg right-0 ">
                          {Array.isArray(epics) && epics.length > 0 ? (
                            epics.map(epic => (
                              <div
                                key={epic.id}
                                className="px-3 py-2 hover:bg-gray-700 cursor-pointer text-white text-sm border-b border-gray-800 last:border-0"
                                onClick={() => handleAddParent(issue.id, epic.id)}
                              >
                                {epic.title}
                              </div>
                            ))
                          ) : (
                            <div className="p-2 text-gray-400 text-sm">No epics found</div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <div
                        onClick={() => toggleStatusDropdown(issue.id)}
                        className="flex items-center bg-gray-800 text-gray-300 text-xs px-2.5 py-1 rounded-md hover:bg-gray-700 cursor-pointer transition-colors"
                      >
                        {issue.status}
                        <ExpandMoreIcon className="w-3 h-3 ml-1" />
                      </div>

                      {showStatusDropdownFor === issue.id && (
                        <div className="absolute z-10 mt-1 w-32 bg-gray-900 border border-gray-700 rounded-lg shadow-lg right-0">
                          {[
                            { id: "todo", name: "To Do" },
                            { id: "in_progress", name: "In Progress" },
                            { id: "review", name: "In Review" },
                            { id: "done", name: "Done" }
                          ]
                            .filter(option => option.id !== issue.status.toLowerCase().replace(' ', '_'))
                            .map(option => (
                              <div
                                key={option.id}
                                className="px-3 py-2 hover:bg-gray-700 cursor-pointer text-white text-sm border-b border-gray-800 last:border-0"
                                onClick={() => {
                                  handleStatusChange(issue.id, option.id);
                                  toggleStatusDropdown(null);
                                }}
                              >
                                {option.name}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>

                    <span className="mx-1 text-gray-600">•</span>

                    <div className="relative" ref={showAssigneeDropdownFor === issue.id ? assigneeDropdownRef : null}>
                      <div
                        title={
                          issue.assignee
                            ? `Assigned to: ${getMemberById(issue.assignee).user_name}`
                            : "Assign a member"
                        }
                        onClick={() => toggleAssigneeSelector(issue.id)}
                        className="w-8 h-8 rounded-full bg-gray-800 text-gray-400 flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors border border-gray-700"
                      >
                        {issue.assignee ? (
                          <span className="text-white text-sm font-semibold">
                            {getInitials(getMemberById(issue.assignee))}
                          </span>
                        ) : (
                          <CheckCircleIcon className="w-5 h-5" />
                        )}

                      </div>

                      {showAssigneeDropdownFor === issue.id && (
                        <div className="absolute z-10 mt-2 w-60 bg-gray-900 border border-gray-700 rounded-lg shadow-lg right-0">
                          {Array.isArray(members) && members.length > 0 ? (
                            members.map(member => (
                              <div
                                key={member.id}
                                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-700 cursor-pointer text-white border-b border-gray-800 last:border-0 transition-colors"
                                onClick={() => handleAssignMember(issue.id, member.id)}
                              >
                                <div className="w-7 h-7 rounded-full bg-green-600 text-white text-xs flex items-center justify-center">
                                  {getInitials(member)}
                                </div>
                                <span className="text-sm">{member.user_email}</span>
                              </div>
                            ))
                          ) : (
                            <div className="p-2 text-gray-400 text-sm">No members found</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Tooltip under the element */}
                  <div className="absolute hidden group-hover:block bg-gray-800 text-white text-sm font-bold p-2 rounded shadow-md mt-2 left-1/2 transform -translate-x-1/2">
                    {issue.assignee ? `Assigned to: ${getMemberById(issue.assignee).user_email}` : "Assign a member"}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-gray-500 border-b border-gray-800 italic">
                This section is empty
              </div>
            )}
          </div>

            {isIssueModalOpen && (
              <IssueModal
                isOpen={isIssueModalOpen}
                onClose={() => setIsIssueModalOpen(false)} 
                issueId={selectedIssueId}  
                projectId={projectId}
                mode="view"
              />
            )}

          {/* Create Input / Button */}
          <div className="px-4 py-3 bg-gray-850" ref={inputContainerRef}>
            {showCreateInput ? (
              <div className="flex gap-2 items-center">
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="px-2 py-1.5 bg-gray-800 border border-gray-700 text-gray-100 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Task">✅ Task</option>
                  <option value="Story">📘 Story</option>
                  <option value="Bug">🐞 Bug</option>
                </select>
                <input
                  ref={inputRef}
                  type="text"
                  className="flex-1 px-3 py-1.5 bg-gray-800 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 text-sm"
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
                  className="px-3 py-1.5 text-xs text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors font-medium shadow-sm"
                >
                  Add
                </button>
              </div>
            ) : (
              <button
                onClick={handleCreateClick}
                className="text-sm font-medium text-blue-500 hover:text-blue-300 flex items-center transition-colors"
              >
                <span className="mr-1 text-lg">+</span> Create
              </button>
            )}
          </div>
        </>
      )}
      
    </div>
  );
}

export default IssueSection;
