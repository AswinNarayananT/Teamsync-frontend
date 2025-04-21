import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaSearch, FaUserFriends, FaUserCircle, FaUserPlus } from 'react-icons/fa';
import { MdInsights } from 'react-icons/md';
import { FiSettings } from 'react-icons/fi';
import Dropdown from './Dropdown';
import { fetchEpics } from '../redux/currentworkspace/currentWorkspaceThunk';

const BackLogTopBar = ({ showEpic, setShowEpic }) => {
  const dispatch = useDispatch();
  const projectId = useSelector((state) => state.currentWorkspace.currentProject.id);
  const { currentProject, epics } = useSelector((state) => state.currentWorkspace);
  const epicOptions = epics?.map(epic => ({
    id: epic.id,
    name: epic.title || epic.name || `Epic ${epic.id}`,
  })) || [];

  

  return (
    <div className="flex items-center justify-between px-4 py-2 w-full bg-[#191919]">
      <div className="flex items-center space-x-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent text-white border border-gray-600 rounded px-3 py-1 pl-8 w-48 placeholder-gray-400 focus:outline-none"
          />
          <FaSearch className="absolute left-2 top-2.5 text-gray-400" />
        </div>

        {/* Overlapping Avatars */}
        <div className="flex items-center ml-2">
          <div className="flex -space-x-2">
            <div className="bg-green-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold border-2 border-[#1c1f24] z-10">
              HM
            </div>
            <div className="bg-gray-400 rounded-full w-8 h-8 flex items-center justify-center border-2 border-[#1c1f24] z-0">
              <FaUserCircle className="text-[#1c1f24] text-lg" />
            </div>
          </div>

          {/* Add Member Button */}
          <div className="ml-2 bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center text-white hover:bg-gray-600 cursor-pointer">
            <FaUserPlus />
          </div>
        </div>

        {/* Dropdown */}
        <Dropdown
        label="Epic"
        options={epicOptions}
        selected={null}
        setSelected={() => {}}
        placeholder="Epic"
        extraOption={
            <div className="flex items-center justify-between text-sm text-white">
            <input
                id="show-epic"
                type="checkbox"
                checked={showEpic}
                onChange={() => setShowEpic((prev) => !prev)}
                className="cursor-pointer"
            />
            <label htmlFor="show-epic" className="cursor-pointer">
                Show epic panel
            </label>
            </div>
        }
        />
      </div>

      {/* Right Side - Buttons */}
      <div className="flex items-center space-x-2">
        <button className="flex items-center space-x-1 bg-[#323232c7] text-white px-3 py-1 rounded hover:bg-[#1e1e1e]">
          <MdInsights />
          <span className="text-sm">Insights</span>
        </button>
        <button className="flex items-center space-x-1 bg-[#323232c7] text-white px-3 py-1 rounded hover:bg-[#1e1e1e]">
          <FiSettings />
          <span className="text-sm">View Settings</span>
        </button>
      </div>
    </div>
  );
};

export default BackLogTopBar;
