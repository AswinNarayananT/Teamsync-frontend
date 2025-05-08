import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDrop } from "react-dnd";
import {
  updateIssueStatus,
  fetchActiveSprintIssues,
  fetchEpics,
  fetchProjectIssues
} from "../../redux/currentworkspace/currentWorkspaceThunk";
import SprintItem from "../issue/SprintItem";
import BackLogTopBar from "../BackLogTopBar";

const columns = [
  { title: "To Do", status: "todo" },
  { title: "In Progress", status: "in_progress" },
  { title: "Review", status: "review" },
  { title: "Done", status: "done" },
];

const Board = () => {
  const dispatch = useDispatch();
  const projectId = useSelector(
    (state) => state.currentWorkspace.currentProject?.id
  );

  const [issuesByStatus, setIssuesByStatus] = useState({
    todo: [],
    in_progress: [],
    review: [],
    done: [],
  });

  const [showEpic, setShowEpic] = useState(true);
  const [selectedParents, setSelectedParents] = useState([]);
  const [selectedSprint, setSelectedSprint] = useState([]);
  const [sprintList, setSprintList] = useState([]);

  const fetchIssues = async () => {
    try {
      dispatch(fetchEpics({ projectId }));
      dispatch(fetchProjectIssues(projectId));
      const data = await dispatch(fetchActiveSprintIssues(projectId)).unwrap();
      const sprints = Array.isArray(data?.sprints) ? data.sprints : [];
      const issues = Array.isArray(data?.issues) ? data.issues : [];

      const grouped = {
        todo: [],
        in_progress: [],
        review: [],
        done: [],
      };

      issues.forEach((issue) => {
        if (grouped[issue.status]) {
          grouped[issue.status].push(issue);
        }
      });

      setIssuesByStatus(grouped);
      setSprintList(sprints);
    } catch (err) {
      console.error("Error fetching active sprint issues:", err);
    }
  };

  const handleStatusChange = (issueId, newStatus) => {
    setIssuesByStatus((prev) => {
      const updated = { ...prev };
      for (const status in updated) {
        updated[status] = updated[status].filter((issue) => issue.id !== issueId);
      }

      const issue = Object.values(prev).flat().find((i) => i.id === issueId);
      if (issue) {
        updated[newStatus].push({ ...issue, status: newStatus });
      }

      return updated;
    });
  };

  useEffect(() => {
    if (projectId) {
      fetchIssues();
    }
  }, [dispatch, projectId]);

  return (
    <div className="transition-opacity duration-300 ease-in-out opacity-100 animate-fadeIn">
      <div className="px-8 py-6 bg-[#1A1A1A] min-h-screen text-white">
        {/* Page Header */}
        <h1 className="text-2xl font-semibold mb-4">Board</h1>

        {/* Top Bar */}
        <BackLogTopBar
          showEpic={showEpic}
          setShowEpic={setShowEpic}
          selectedParents={selectedParents}
          setSelectedParents={setSelectedParents}
          showSprintControls={true}
          selectedSprint={selectedSprint}
          setSelectedSprint={setSelectedSprint}
          sprintOptions={sprintList}
        />

        {/* Sprint Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          {columns.map((col) => {
            const [, drop] = useDrop({
              accept: "issue",
              drop: (item) => {
                if (item && item.id) {
                  dispatch(
                    updateIssueStatus({ issueId: item.id, status: col.status })
                  );
                  handleStatusChange(item.id, col.status);
                }
              },
            });

            return (
              <div
                key={col.status}
                ref={drop}
                className="bg-[#2A2A2A] rounded-2xl p-4 shadow-md flex flex-col min-h-[60vh]"
              >
                <h2 className="text-lg font-bold mb-3 capitalize border-b border-gray-600 pb-2">
                  {col.title}
                </h2>
                <div className="flex flex-col gap-2 flex-grow">
                  {issuesByStatus[col.status].map((issue) => (
                    <SprintItem key={issue.id} issue={issue} />
                  ))}
                  {issuesByStatus[col.status].length === 0 && (
                    <p className="text-sm text-gray-400">No issues</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Board;
