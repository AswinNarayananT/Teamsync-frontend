  import React, { useState, useEffect } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { fetchEpics, fetchProjectIssues,fetchSprintsInProject } from "../redux/currentworkspace/currentWorkspaceThunk";
  import IssueModal from "./IssueModal";
  import IssueSection from "./IssueSection";
  import EpicSection from "./EpicSection";
  import BackLogTopBar from "./BackLogTopBar";
  import SprintList from "./issue/SprintList ";

  const BacklogBoard = () => {
    const dispatch = useDispatch();
    const currentProject = useSelector((state) => state.currentWorkspace.currentProject);
    const issues = useSelector((state) => state.currentWorkspace.issues);
    const [showEpic, setShowEpic] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [modalType, setModalType] = useState("task");

    useEffect(() => {
      if (currentProject) {
        const projectId = currentProject.id;

        dispatch(fetchEpics({ projectId }));

        dispatch(fetchProjectIssues(projectId));

        dispatch(fetchSprintsInProject(projectId));

      }
    }, [dispatch, currentProject]);

    const openCreateIssueModal = () => {
      setModalType("task");
      setModalMode("create");
      setIsModalOpen(true);
    };

    if (!currentProject) {
      return (
        <div className="h-full flex items-center justify-center bg-gray-900 text-white">
          <div className="text-lg font-semibold">No project found. Please create a project.</div>
        </div>
      );
    }

    const backlogIssues = issues.filter((issue) => issue.sprint === null);

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

        <BackLogTopBar showEpic={showEpic} setShowEpic={setShowEpic} />

        <div className="flex mt-4">
          {/* Epic Section */}
          {showEpic && (
            <div className="flex-shrink-0 m-1">
              <EpicSection showEpic={showEpic} setShowEpic={setShowEpic} />
            </div>
          )}

        {/* Issue Section */}
          <div className={`flex-1 relative overflow-visible ${showEpic ? 'm-2' : 'space-y-6 m-1'}`}>
          
            <SprintList/>

            <div className={showEpic ? 'mt-6' : ''}>
              <IssueSection
                title="Backlog"
                issues={backlogIssues}
                isSprintSection={false}
              />
            </div>
          </div>
        </div>

        <IssueModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          mode={modalMode}
          type={modalType}
          projectId={currentProject.id}
        />
      </div>
    );
  };

  export default BacklogBoard;
