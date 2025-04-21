import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEpics, fetchProjectIssues } from "../redux/currentworkspace/currentWorkspaceThunk";
import IssueModal from "./IssueModal";
import IssueSection from "./IssueSection";
import EpicSection from "./EpicSection";
import BackLogTopBar from "./BackLogTopBar";

const BacklogBoard = () => {
  const dispatch = useDispatch();
  const { currentProject, epics, issues, issuesLoading, issuesError } = useSelector(
    (state) => state.currentWorkspace
  );
  const [showEpic, setShowEpic] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [modalType, setModalType] = useState("task");
  const [defaultValues, setDefaultValues] = useState({});

  useEffect(() => {
    if (currentProject) {
      const projectId = currentProject.id;

      // Fetch Epics
      dispatch(fetchEpics({ projectId }));

      // Fetch Issues (Task, Story, Bug)
      dispatch(fetchProjectIssues(projectId));
    }
  }, [dispatch, currentProject]);

  const openCreateIssueModal = () => {
    setModalType("task");
    setModalMode("create");
    setDefaultValues({});
    setIsModalOpen(true);
  };

  if (!currentProject) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900 text-white">
        <div className="text-lg font-semibold">No project found. Please create a project.</div>
      </div>
    );
  }

  // Filter issues to show only those in the backlog (exclude sprint-related issues)
  const backlogIssues = issues.filter(issue => issue.status !== 'In Progress' && issue.status !== 'Completed');

  return (
    <div className="p-4 bg-[#191919] min-h-screen text-white">
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
        <div className={`flex-1 ${showEpic ? 'm-2' : 'space-y-6 m-1'}`}>
          {/* Display an empty sprint section */}
          <IssueSection
            title="ECOM Sprint 1"
            dateRange="17 Apr – 1 May"
            visibleItems={0}
            totalItems={0}
            issues={[]}
            isSprintSection={true}
          />

          <div className={showEpic ? 'mt-6' : ''}>
            <IssueSection
              title="Backlog"
              visibleItems={backlogIssues.length}
              totalItems={backlogIssues.length}
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
        defaultValues={defaultValues}
        onSubmit={(data) => {
          console.log("Submit issue data:", data);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default BacklogBoard;
