// src/components/backlog/BacklogIssues.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEpics, fetchProjectIssues, fetchSprintsInProject } from "../../redux/currentworkspace/currentWorkspaceThunk";
import BackLogTopBar from "../BackLogTopBar";
import IssueList from "../issue/IssueList ";
import EpicSection from "../EpicSection";

const BacklogIssues = ({ currentProject }) => {
  const dispatch = useDispatch();
  const sprints = useSelector((state) => state.currentWorkspace.sprints);
  const [showEpic, setShowEpic] = useState(true);
  const [selectedParents, setSelectedParents] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    if (currentProject) {
      const projectId = currentProject.id;
      dispatch(fetchEpics({ projectId }));
      dispatch(fetchSprintsInProject(projectId));
    }
  }, [dispatch, currentProject]);

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
  }, [dispatch, currentProject, selectedParents, selectedMembers, sprints]);

  return (
    <div>
      <BackLogTopBar
        showEpic={showEpic}
        setShowEpic={setShowEpic}
        selectedParents={selectedParents}
        setSelectedParents={setSelectedParents}
        selectedMembers={selectedMembers}
        setSelectedMembers={setSelectedMembers}
      />

      <div className="flex mt-4">
        {showEpic && (
          <div className="flex-shrink-0 m-1">
            <EpicSection showEpic={showEpic} setShowEpic={setShowEpic} />
          </div>
        )}

        <div className={`flex-1 relative overflow-visible ${showEpic ? 'm-2' : 'space-y-6 m-1'}`}>
          <IssueList />
        </div>
      </div>
    </div>
  );
};

export default BacklogIssues;
