import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoMdClose } from 'react-icons/io';
import epicLogo from "../assets/epicLogo.svg";
import EpicBlock from './EpicBlock';
import { createIssue } from '../redux/currentworkspace/currentWorkspaceThunk';
import IssueModal from './IssueModal'; // ✅ import your modal

const EpicSection = ({ showEpic, setShowEpic }) => {
  const dispatch = useDispatch();
  const [isCreating, setIsCreating] = useState(false);
  const [epicTitle, setEpicTitle] = useState('');
  const [openEpicId, setOpenEpicId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEpicId, setSelectedEpicId] = useState(null);

  const epics = useSelector((state) => state.currentWorkspace.epics);
  const projectId = useSelector((state) => state.currentWorkspace.currentProject.id);

  const handleCreateEpic = () => {
    if (!epicTitle.trim()) return;

    dispatch(
      createIssue({
        issueData: { title: epicTitle, type: 'epic' },
        projectId,
      })
    );

    setEpicTitle('');
    setIsCreating(false);
  };

  const handleToggleEpic = (id) => {
    setOpenEpicId((prev) => (prev === id ? null : id));
  };

  const handleViewDetails = (epic) => {
    setSelectedEpicId(epic.id || epic._id);
    setIsModalOpen(true);
  };

  return (
    <div className="w-70 bg-[#202020] p-4 rounded shadow h-150 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-semibold text-white">Epic</span>
        <button onClick={() => setShowEpic(false)}>
          <IoMdClose className="text-white" size={18} />
        </button>
      </div>

      {/* Scrollable Epic Content */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
        {epics.length > 0 ? (
          <div className="flex flex-col gap-2">
            {epics.map((epic) => (
              <EpicBlock
                key={epic.id || epic._id}
                id={epic.id || epic._id}
                title={epic.title}
                startDate={epic.start_date}
                dueDate={epic.end_date}
                statusColor={epic.statusColor || '#3F76FF'}
                isOpen={openEpicId === (epic.id || epic._id)}
                onToggleDetails={() => handleToggleEpic(epic.id || epic._id)}
                onViewDetails={() => handleViewDetails(epic)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2 pt-2 items-center text-center">
            <img src={epicLogo} alt="Epic logo" className="w-20 h-20" />
            <p className="text-sm text-gray-400">
              Plan and prioritize large chunks of work.
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Create your first epic to start capturing and breaking down work for your team.
            </p>
          </div>
        )}
      </div>

      {/* Footer - Create Button / Input */}
      <div className="mt-4">
        {isCreating ? (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              className="bg-[#2a2a2a] text-sm text-white px-2 py-1 rounded focus:outline-none"
              placeholder="What will be the epic called?"
              value={epicTitle}
              onChange={(e) => setEpicTitle(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreateEpic}
                className="flex-1 px-3 py-1 bg-[#3F76FF] text-sm rounded hover:bg-blue-500"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEpicTitle('');
                }}
                className="flex-1 px-3 py-1 bg-gray-600 text-sm rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            className="w-full px-3 py-1 bg-[#3F76FF] text-sm rounded hover:bg-blue-500"
            onClick={() => setIsCreating(true)}
          >
            + Create epic
          </button>
        )}
      </div>

      <IssueModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        issueId={selectedEpicId}
        mode={selectedEpicId ? 'edit' : 'create'} 
        projectId={projectId}
      />
    </div>
  );
};

export default EpicSection;
