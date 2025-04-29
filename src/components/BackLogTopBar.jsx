import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FaSearch, FaUserCircle, FaUserPlus } from 'react-icons/fa';
import { MdInsights } from 'react-icons/md';
import { FiSettings } from 'react-icons/fi';
import { Switch } from '@mui/material';


const BackLogTopBar = ({ showEpic, setShowEpic, selectedParents, setSelectedParents }) => {
  const epics = useSelector((state) => state.currentWorkspace.epics) || [];
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const selectedParentsArray = Array.isArray(selectedParents) ? selectedParents : [];

  const epicOptions = epics.map((epic) => ({
    id: epic.id,
    name: epic.title || epic.name || `Epic ${epic.id}`,
  }));

  const handleShowEpicChange = () => setShowEpic((prev) => !prev);

  const handleNoEpicChange = () => {
    const newSelectedParents = [...selectedParentsArray];
    const noneIndex = newSelectedParents.indexOf("none");

    if (noneIndex > -1) {
      newSelectedParents.splice(noneIndex, 1);
    } else {
      newSelectedParents.push("none");
    }

    setSelectedParents(newSelectedParents);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-wrap md:flex-nowrap items-center justify-between px-4 py-2 w-full bg-[#191919] gap-4">
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

        {/* Avatars */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            <div className="bg-green-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold border-2 border-[#1c1f24] z-10">HM</div>
            <div className="bg-gray-400 rounded-full w-8 h-8 flex items-center justify-center border-2 border-[#1c1f24] z-0">
              <FaUserCircle className="text-[#1c1f24] text-lg" />
            </div>
          </div>
          <div className="bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center text-white hover:bg-gray-600 cursor-pointer">
            <FaUserPlus />
          </div>
        </div>

        {/* Epic Dropdown */}
        <div className="relative w-25" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="w-full flex justify-between items-center rounded-md border border-gray-600 px-3 py-1 bg-[#1c1f24] text-sm font-medium text-white hover:bg-[#2a2a2a]"
          >
            {selectedParentsArray.length > 0
              ? `Epic(${selectedParentsArray.length})`
              : "Epic"}
            <span className="ml-2">&#9662;</span>
          </button>

          {showDropdown && (
            <div className="absolute z-10 mt-1  rounded-md bg-[#2a2a2a] shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="py-1 max-h-64 overflow-y-auto text-white text-sm">
                {epicOptions.map((epic) => (
                  <label
                    key={epic.id}
                    className="flex items-center gap-2 px-3 py-1 hover:bg-[#3a3a3a] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedParentsArray.includes(epic.id)}
                      onChange={() => {
                        const exists = selectedParentsArray.includes(epic.id);
                        const updated = exists
                          ? selectedParentsArray.filter((id) => id !== epic.id)
                          : [...selectedParentsArray, epic.id];
                        setSelectedParents(updated);
                      }}
                      className="cursor-pointer"
                    />
                    {epic.name}
                  </label>
                ))}

                {/* No Epic Option */}
                <label className="flex items-center gap-2 px-3 py-1 hover:bg-[#3a3a3a] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedParentsArray.includes("none")}
                    onChange={handleNoEpicChange}
                    className="cursor-pointer"
                  />
                  No Epic 
                </label>

              {/* Show Epic Panel with Small Switch */}
              <div className="border-t border-gray-600 mt-1 px-3 py-2 flex items-center gap-2">
                <Switch
                  checked={showEpic}
                  onChange={handleShowEpicChange}
                  color="primary"
                  size="small" // Makes the switch smaller
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#00e676', // Green color when checked
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#00e676', // Green track when checked
                    },
                  }}
                />
                <span className="text-white text-sm whitespace-nowrap">Epic Panel</span> {/* Ensures text stays on one line */}
              </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 ml-auto">
        <button className="flex items-center gap-1 bg-[#323232c7] text-white text-sm px-3 py-1 rounded hover:bg-[#1e1e1e]">
          <MdInsights />
          Insights
        </button>
        <button className="flex items-center gap-1 bg-[#323232c7] text-white text-sm px-3 py-1 rounded hover:bg-[#1e1e1e]">
          <FiSettings />
          View Settings
        </button>
      </div>
    </div>
  );
};

export default BackLogTopBar;
