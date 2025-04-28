import { useSelector, useDispatch } from "react-redux";
import { assignAssigneeToIssue } from "../../redux/currentworkspace/currentWorkspaceThunk";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect, useRef } from "react";
import Avatar from '@mui/material/Avatar';

const AssigneeSelector = ({ issue, showAssigneeDropdownFor, setShowAssigneeDropdownFor, assigneeDropdownRef }) => {
  const dispatch = useDispatch();
  const members = useSelector((state) => state.currentWorkspace.members);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [isHovering, setIsHovering] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState("right");
  const [dropdownWidth, setDropdownWidth] = useState("18rem"); 

  const iconRef = useRef();

  const handleAssignMember = (issueId, memberId) => {
    if (!issueId || !memberId) return;
    dispatch(assignAssigneeToIssue({ issueId, memberId }));
    setShowAssigneeDropdownFor(null);
    setSearchTerm("");
  };

  const getMemberById = (id) => members.find((m) => m.user_id === id) || {};
  const getInitials = (member) => {
    if (member.user_email) {
      return member.user_email.slice(0, 2).toUpperCase();
    }
    return "";
  };

  const toggleAssigneeSelector = (issueId) => {
    if (showAssigneeDropdownFor === issueId) {
      setShowAssigneeDropdownFor(null);
      setSearchTerm("");
    } else {
      setShowAssigneeDropdownFor(issueId);
    }
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredMembers(members);
    } else {
      const filtered = members.filter((member) =>
        member.user_email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMembers(filtered);
    }
  }, [searchTerm, members]);

  const recentMembers = members.slice(0, 3);

  useEffect(() => {
    if (showAssigneeDropdownFor === issue.id && iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      const spaceOnRight = window.innerWidth - rect.right;
      const spaceOnLeft = rect.left;
      const preferredWidth = 80; 

      if (spaceOnRight >= preferredWidth) {
        setDropdownPosition("right");
        setDropdownWidth("18rem");
      } else if (spaceOnLeft >= preferredWidth) {
        setDropdownPosition("left");
        setDropdownWidth("18rem");
      } else {
        const availableSpace = Math.max(spaceOnRight, spaceOnLeft) - 20;
        setDropdownWidth(availableSpace > 200 ? `${availableSpace}px` : "200px"); 
        setDropdownPosition(spaceOnRight > spaceOnLeft ? "right" : "left");
      }
    }
  }, [showAssigneeDropdownFor, issue.id]);

  return (
    <div className="relative" ref={showAssigneeDropdownFor === issue.id ? assigneeDropdownRef : null}>

      <div
        ref={iconRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => toggleAssigneeSelector(issue.id)}
        className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-all border-2 border-blue-500 relative"
      >
        {issue.assignee ? (
          <span className="text-sm font-bold">{getInitials(getMemberById(issue.assignee))}</span>
        ) : (
          <CheckCircleIcon className="w-5 h-5" />
        )}

        {/* Tooltip */}
        {isHovering && issue.assignee && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded-md px-3 py-2 shadow-lg border border-gray-700 whitespace-nowrap z-20 w-max max-w-xs text-center">
            <div className="font-semibold text-sm">{getMemberById(issue.assignee).user_name || "No Name"}</div>
            <div className="text-gray-400">{getMemberById(issue.assignee).user_email}</div>
          </div>
        )}
      </div>

      {/* Dropdown */}
      {showAssigneeDropdownFor === issue.id && (
        <div
          className={`absolute z-20 mt-3 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl ${
            dropdownPosition === "right" ? "right-0" : "left-0"
          }`}
          style={{ width: dropdownWidth }}
        >
          {/* Search Bar */}
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-700 border-b border-gray-600">
            <SearchIcon className="text-gray-300" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-gray-400 text-sm outline-none min-w-0"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")}>
                <CloseIcon className="text-gray-400 hover:text-white transition" />
              </button>
            )}
          </div>

          {/* Search Results */}
          <div className="max-h-56 overflow-y-auto custom-scrollbar">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <div
                  key={member.id}
                  onClick={() => handleAssignMember(issue.id, member.id)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-600 cursor-pointer border-b border-gray-700 last:border-0 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center text-xs">
                    {getInitials(member)}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-white text-sm truncate">{member.user_email || "Unnamed"}</span>
                    <span className="text-gray-400 text-xs truncate">{member.user_name}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-gray-400 text-center text-sm">No matching members</div>
            )}
          </div>

          {/* Quick Recent Members */}
          {recentMembers.length > 0 && (
            <div className="px-3 pt-2 pb-3 bg-gray-700 rounded-b-lg">
              <div className="text-gray-400 text-xs mb-2">Quick access</div>
              <div className="flex gap-2 flex-wrap">
                {recentMembers.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => handleAssignMember(issue.id, member.id)}
                    className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded-full px-2 py-1 cursor-pointer transition-all"
                  >
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-[10px]">
                      {getInitials(member)}
                    </div>
                    <span className="truncate">{member.user_name?.split(" ")[0] || "User"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default AssigneeSelector;
