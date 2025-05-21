import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import { Switch, Checkbox, Popover } from "@mui/material";
import { toast } from 'react-toastify';
import CompleteSprintButton from './sprint/CompleteSprintButton';

const BackLogTopBar = ({
  showEpic,
  setShowEpic,
  selectedParents,
  setSelectedParents,
  selectedMembers,
  setSelectedMembers,
  selectedSprint,
  setSelectedSprint,
  sprintOptions = [],
  showSprintControls = false,
}) => {
  const epics = useSelector((state) => state.currentWorkspace.epics) || [];
  const members = useSelector((state) => state.currentWorkspace.members) || [];

  // Popover states for all dropdowns
  const [memberAnchorEl, setMemberAnchorEl] = useState(null);
  const [epicAnchorEl, setEpicAnchorEl] = useState(null);
  const [sprintAnchorEl, setSprintAnchorEl] = useState(null);

  // Ensure we always have arrays
  const selectedParentsArray = Array.isArray(selectedParents) ? selectedParents : [];
  const selectedSprintArray = Array.isArray(selectedSprint) ? selectedSprint : [];

  // Constants for member avatars
  const MAX_VISIBLE_AVATARS = 2;
  const visibleMembers = members.slice(0, MAX_VISIBLE_AVATARS);
  const hiddenCount = members.length - MAX_VISIBLE_AVATARS;

  // Event handlers
  const handleShowEpicChange = () => setShowEpic((prev) => !prev);
  
  const handlePopoverOpen = (e, setter) => setter(e.currentTarget);
  const handlePopoverClose = (setter) => setter(null);

  const toggleMember = (id) => {
    setSelectedMembers(
      selectedMembers.includes(id)
        ? selectedMembers.filter((mid) => mid !== id)
        : [...selectedMembers, id]
    );
  };

  const toggleOption = (id, selected, setter) => {
    const isSelected = selected.includes(id);
    const updated = isSelected
      ? selected.filter((itemId) => itemId !== id)
      : [...selected, id];
    setter(updated);
  };

  const handleNoEpicChange = () => {
    toggleOption('none', selectedParentsArray, setSelectedParents);
  };


  return (
    <div className="flex flex-wrap md:flex-nowrap items-start md:items-center justify-between px-4 py-2 w-full bg-[#191919] gap-4">
      {/* Left Section */}
      <div className="flex flex-wrap md:flex-nowrap items-center gap-3">
        {/* Search */}
        <div className="relative w-48">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-transparent text-white border border-gray-600 rounded px-3 py-1 pl-8 placeholder-gray-400 focus:outline-none text-sm"
          />
          <FaSearch className="absolute left-2 top-2.5 text-gray-400" />
        </div>

       {/* Member Selection */}
<div className="flex items-center">
  <div className="flex -space-x-2 items-center">
    {visibleMembers.map((member) => {
      const initials = member.user_name?.slice(0, 2).toUpperCase() || "";
      const isSelected = selectedMembers.includes(member.user_id);

      return (
        <div
          key={member.user_id}
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold cursor-pointer ${
            isSelected
              ? "bg-green-600 border-green-500 text-white"
              : "bg-gray-400 border-[#1c1f24] text-[#1c1f24]"
          }`}
          onClick={(e) => handlePopoverOpen(e, setMemberAnchorEl)}
        >
          {member.user_profile_picture ? (
            <img
              src={member.user_profile_picture}
              alt="profile"
              className="w-full h-full rounded-full object-cover"
            />
          ) : initials ? (
            initials
          ) : (
            <FaUserCircle className="text-lg" />
          )}
        </div>
      );
    })}

    {hiddenCount > 0 && (
      <div
        onClick={(e) => handlePopoverOpen(e, setMemberAnchorEl)}
        className="w-8 h-8 rounded-full bg-white border-2 border-blue-500 text-blue-600 text-sm flex items-center justify-center font-bold cursor-pointer"
      >
        +{hiddenCount}
      </div>
    )}
  </div>

  {/* Member Selection Popover */}
  <Popover
    open={Boolean(memberAnchorEl)}
    anchorEl={memberAnchorEl}
    onClose={() => handlePopoverClose(setMemberAnchorEl)}
    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
  >
    <div className="bg-[#2a2a2a] w-40 max-h-60 p-2 shadow-lg rounded-md space-y-1 overflow-y-auto">
      {members.map((member) => {
        const initials = member.user_name?.slice(0, 2).toUpperCase() || "";
        const isSelected = selectedMembers.includes(member.user_id);
        return (
          <div
            key={member.user_id}
            className="flex items-center gap-2 px-2 py-1 hover:bg-[#3a3a3a] rounded cursor-pointer"
            onClick={() => toggleMember(member.user_id)}
          >
            <Checkbox 
              size="small" 
              checked={isSelected}
              sx={{
                color: "#6b7280",
                '&.Mui-checked': {
                  color: "#10b981",
                },
              }}
            />
            <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">
              {member.user_profile_picture ? (
                <img
                  src={member.user_profile_picture}
                  alt="profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : initials ? (
                initials
              ) : (
                <FaUserCircle className="text-base text-white" />
              )}
            </div>
            <span className="text-sm text-gray-200 truncate">
              {member.user_name}
            </span>
          </div>
        );
      })}

      {/* "None"/Unassigned Option as Last */}
      <div
        key="none"
        className="flex items-center gap-2 px-2 py-1 hover:bg-[#3a3a3a] rounded cursor-pointer"
        onClick={() => toggleMember("none")}
      >
        <Checkbox 
          size="small" 
          checked={selectedMembers.includes("none")}
          sx={{
            color: "#6b7280",
            '&.Mui-checked': {
              color: "#10b981",
            },
          }}
        />
        <div className="w-6 h-6 rounded-full bg-gray-500 text-white flex items-center justify-center text-xs font-bold">
          <FaUserCircle className="text-base text-white" />
        </div>
        <span className="text-sm text-gray-200 truncate">Unassigned</span>
      </div>
    </div>
  </Popover>
</div>


        {/* Epic Button and Popover */}
        <div className="relative">
          <button
            onClick={(e) => handlePopoverOpen(e, setEpicAnchorEl)}
            className="flex justify-between items-center rounded-md border border-gray-600 px-3 py-1 bg-[#1c1f24] text-sm font-medium text-white hover:bg-[#2a2a2a] min-w-24"
          >
            {selectedParentsArray.length > 0
              ? `Epic (${selectedParentsArray.length})`
              : 'Epic'}
            <span className="ml-2">&#9662;</span>
          </button>

          <Popover
            open={Boolean(epicAnchorEl)}
            anchorEl={epicAnchorEl}
            onClose={() => handlePopoverClose(setEpicAnchorEl)}
            anchorOrigin={{ vertical: "bottom" }}
          >
            <div className="bg-[#2a2a2a] w-40 max-h-60 p-2 shadow-lg rounded-md space-y-1 overflow-y-auto">
              {epics.map((epic) => (
                <div
                  key={epic.id}
                  className="flex items-center gap-2 px-2 py-1 hover:bg-[#3a3a3a] rounded cursor-pointer"
                  onClick={() => toggleOption(epic.id, selectedParentsArray, setSelectedParents)}
                >
                  <Checkbox 
                    size="small" 
                    checked={selectedParentsArray.includes(epic.id)}
                    sx={{
                      color: "#6b7280",
                      '&.Mui-checked': {
                        color: "#10b981",
                      },
                    }}
                  />
                  <span className="text-sm text-gray-200">{epic.title}</span>
                </div>
              ))}
              
              {/* No Epic Option */}
              <div
                className="flex items-center gap-2 px-2 py-1 hover:bg-[#3a3a3a] rounded cursor-pointer"
                onClick={handleNoEpicChange}
              >
                <Checkbox 
                  size="small" 
                  checked={selectedParentsArray.includes('none')}
                  sx={{
                    color: "#6b7280",
                    '&.Mui-checked': {
                      color: "#10b981",
                    },
                  }}
                />
                <span className="text-sm text-gray-200">No Epic</span>
              </div>
              
              {!showSprintControls && (
                <div className="border-t border-gray-600 mt-2 pt-2 px-2 flex items-center gap-2">
                  <Switch
                    checked={showEpic}
                    onChange={handleShowEpicChange}
                    color="primary"
                    size="small"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#10b981',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#10b981',
                      },
                    }}
                  />
                  <span className="text-white text-sm whitespace-nowrap">Epic Panel</span>
                </div>
              )}
            </div>
          </Popover>
        </div>

        {/* Sprint Button and Popover - Only show when showSprintControls is true */}
        {showSprintControls && (
          <div className="relative">
            <button
              onClick={(e) => handlePopoverOpen(e, setSprintAnchorEl)}
              className="flex justify-between items-center rounded-md border border-gray-600 px-3 py-1 bg-[#1c1f24] text-sm font-medium text-white hover:bg-[#2a2a2a] min-w-24"
            >
              {selectedSprintArray.length > 0
                ? `Sprint (${selectedSprintArray.length})`
                : 'Sprint'}
              <span className="ml-2">&#9662;</span>
            </button>

            <Popover
              open={Boolean(sprintAnchorEl)}
              anchorEl={sprintAnchorEl}
              onClose={() => handlePopoverClose(setSprintAnchorEl)}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
              <div className="bg-[#2a2a2a] w-40 max-h-60 p-2 shadow-lg rounded-md space-y-1 overflow-y-auto">
                {sprintOptions.map((sprint) => (
                  <div
                    key={sprint.id}
                    className="flex items-center gap-2 px-2 py-1 hover:bg-[#3a3a3a] rounded cursor-pointer"
                    onClick={() => toggleOption(sprint.id, selectedSprintArray, setSelectedSprint)}
                  >
                    <Checkbox 
                      size="small" 
                      checked={selectedSprintArray.includes(sprint.id)}
                      sx={{
                        color: "#6b7280",
                        '&.Mui-checked': {
                          color: "#10b981",
                        },
                      }}
                    />
                    <span className="text-sm text-gray-200">{sprint.name}</span>
                  </div>
                ))}
              </div>
            </Popover>
          </div>
        )}
      </div>

      {/* Right Section */}
      {showSprintControls && (
        <div className="flex items-center ml-auto">
         <CompleteSprintButton disabled={sprintOptions.length === 0} />
        </div>
      )}
    </div>
  );
};

export default BackLogTopBar;