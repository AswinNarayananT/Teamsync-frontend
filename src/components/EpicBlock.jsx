import React, { useState } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { MdKeyboardArrowDown } from 'react-icons/md';

const EpicBlock = ({ title, startDate, dueDate, statusColor = '#56c661', onToggleDetails }) => {
  const [openEpicDetails, setOpenEpicDetails] = useState(false);

  return (
    <div className="flex flex-col gap-3 bg-[#1a1a1a] text-white px-3 py-2 rounded-md hover:bg-[#2a2a2a] transition-colors cursor-pointer">
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setOpenEpicDetails(!openEpicDetails);
            if (onToggleDetails) onToggleDetails();
          }}
        >
          {openEpicDetails ? (
            <MdKeyboardArrowDown size={16} className="text-gray-300" />
          ) : (
            <FiChevronRight size={16} className="text-gray-300" />
          )}
        </button>
        <div className="w-5 h-5 bg-purple-500 rounded-sm" />
        <span className="text-sm font-medium truncate">{title}</span>
      </div>

      <div className="h-1 w-full rounded-sm" style={{ backgroundColor: statusColor }} />

      {openEpicDetails && (
        <div className="flex flex-col gap-2 mt-2 text-sm text-gray-400">
          <div className="bg-[#1D2125] p-0.5 rounded-sm">
            <p>📅 Start Date: {startDate || 'N/A'}</p>
          </div>
          <div className="bg-[#1D2125] p-0.5 rounded-sm">
            <p>⏰ Due Date: {dueDate || 'N/A'}</p>
          </div>
          <button className="bg-[#1D2125] p-0.5 rounded-sm text-left hover:text-white">
            View Details
          </button>
        </div>
      )}
    </div>
  );
};

export default EpicBlock;
