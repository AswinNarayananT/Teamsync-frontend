import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDrop } from "react-dnd";
import {
  updateIssueStatus,
  fetchActiveSprintIssues,
} from "../../redux/currentworkspace/currentWorkspaceThunk";
import SprintItem from "../issue/SprintItem";

const columns = [
  { title: "To Do", status: "todo" },
  { title: "In Progress", status: "in_progress" },
  { title: "Review", status: "review" },
  { title: "Done", status: "done" },
];

const Board = () => {
  const dispatch = useDispatch();
  const projectId = useSelector(
    (state) => state.currentWorkspace.currentProject.id
  );

  const [issuesByStatus, setIssuesByStatus] = useState({
    todo: [],
    in_progress: [],
    review: [],
    done: [],
  });

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const data = await dispatch(fetchActiveSprintIssues(projectId)).unwrap();
        const grouped = {
          todo: [],
          in_progress: [],
          review: [],
          done: [],
        };

        data.forEach((issue) => {
          if (grouped[issue.status]) {
            grouped[issue.status].push(issue);
          }
        });

        setIssuesByStatus(grouped);
      } catch (err) {
        console.error("Error fetching issues:", err);
      }
    };

    fetchIssues();
  }, [dispatch, projectId]);

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

  return (
    <div className="grid grid-cols-4 gap-4 p-4 bg-[#1a1a1a] min-h-screen text-white">
      {columns.map((col) => {
        const [, drop] = useDrop({
          accept: "issue",
          drop: (item) => {
            if (item && item.id) {
                dispatch(updateIssueStatus({ issueId: item.id, status: col.status }));
              handleStatusChange(item.id, col.status);
            }
          },
        });

        return (
          <div
            key={col.status}
            ref={drop}
            className="bg-[#2a2a2a] rounded-lg p-3 shadow-md"
          >
            <h2 className="text-lg font-semibold mb-2 capitalize">{col.title}</h2>
            <div className="space-y-2">
              {issuesByStatus[col.status].map((issue) => (
                <SprintItem key={issue.id} issue={issue} />
              ))}
              {issuesByStatus[col.status].length === 0 && (
                <p className="text-xs text-gray-500">No issues</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Board;
