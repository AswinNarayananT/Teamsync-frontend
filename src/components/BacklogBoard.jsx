  import React, { useState, useEffect } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { fetchEpics, fetchProjectIssues,fetchSprintsInProject } from "../redux/currentworkspace/currentWorkspaceThunk";
  import EpicSection from "./EpicSection";
  import BackLogTopBar from "./BackLogTopBar";
  import IssueList from "./issue/IssueList ";
  import IssueCreateModal from "./issue/IssueCreateModal";

  const BacklogBoard = () => {
    const dispatch = useDispatch();
    const currentProject = useSelector((state) => state.currentWorkspace.currentProject);
    const sprints = useSelector((state) => state.currentWorkspace.sprints);
    const [showEpic, setShowEpic] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedParents, setSelectedParents] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);

    useEffect(() => {
      if (currentProject) {
        const projectId = currentProject.id;

        dispatch(fetchEpics({ projectId }));

        dispatch(fetchSprintsInProject(projectId));


      }
    }, [dispatch, currentProject ]);

    useEffect(() => {
    if (currentProject) {
      const projectId = currentProject.id;

      const filters = {
        epics: selectedParents,
        assignees: selectedMembers.includes("none")
          ? selectedMembers.filter((id) => id !== "none")
          : selectedMembers,
        unassigned: selectedMembers.includes("none"),
      };

      dispatch(fetchProjectIssues({ projectId, filters }));
    }
  }, [dispatch, currentProject, selectedParents, selectedMembers,sprints]);

    const openCreateIssueModal = () => {
      setIsModalOpen(true);
    };

    if (!currentProject) {
      return (
        <div className="h-full flex items-center justify-center bg-gray-900 text-white">
          <div className="text-lg font-semibold">No project found. Please create a project.</div>
        </div>
      );
    }


    return (
      <div className="p-4  bg-gray-900 min-h-screen text-white">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Backlog</h1>
          <button
            onClick={openCreateIssueModal}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
          >
            Add Task
          </button>
        </div>

        <BackLogTopBar
          showEpic={showEpic}
          setShowEpic={setShowEpic}
          selectedParents={selectedParents}
          setSelectedParents={setSelectedParents}
          selectedMembers={selectedMembers}
          setSelectedMembers={setSelectedMembers}
        />

        <div className="flex mt-4">
          {/* Epic Section */}
          {showEpic && (
            <div className="flex-shrink-0 m-1">
              <EpicSection showEpic={showEpic} setShowEpic={setShowEpic} />
            </div>
          )}

        {/* Issue Section */}
          <div className={`flex-1 relative overflow-visible ${showEpic ? 'm-2' : 'space-y-6 m-1'}`}>      
          <IssueList  />
          </div>
        </div>

        <IssueCreateModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          projectId={currentProject.id}
        />
      </div>
    );
  };

  export default BacklogBoard;
