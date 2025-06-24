import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompletedSprintsWithIssues } from "../../redux/currentworkspace/currentWorkspaceThunk";

const CompletedIssues = () => {
  const dispatch = useDispatch();
  const currentProject = useSelector((state) => state.currentWorkspace.currentProject);
  const projectId = currentProject?.id;

  const [completedSprints, setCompletedSprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (projectId) {
      dispatch(fetchCompletedSprintsWithIssues({ projectId }))
        .unwrap()
        .then((data) => {
          setCompletedSprints(data);
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to fetch completed sprints");
          setLoading(false);
        });
    }
  }, [dispatch, projectId]);

  if (loading) {
    return <div className="text-white text-center mt-10">Loading completed issues...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  return (
    <div className="text-white">
      <h1 className="text-2xl font-semibold mb-6">Completed Issues</h1>

      {completedSprints.length === 0 ? (
        <div className="bg-gray-800 p-6 rounded text-center text-gray-300">
          No completed sprints found.
        </div>
      ) : (
        <div className="space-y-6">
          {completedSprints.map((sprint) => (
            <div
              key={sprint.id}
              className="bg-gray-800 p-4 rounded-lg shadow-md transition duration-300 hover:bg-gray-700"
            >
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-blue-400">{sprint.name}</h2>
                <p className="text-sm text-gray-400">{sprint.goal || "No goal provided"}</p>
                <p className="text-xs text-gray-500">
                  {sprint.start_date} → {sprint.end_date}
                </p>
              </div>

              {sprint.issues.length === 0 ? (
                <p className="text-gray-400">No issues in this sprint.</p>
              ) : (
                <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {sprint.issues.map((issue) => (
                    <li
                      key={issue.id}
                      className="bg-gray-900 border border-gray-700 rounded p-4"
                    >
                      <h3 className="font-semibold text-white">{issue.title}</h3>
                      <p className="text-sm text-gray-400">{issue.description || "No description"}</p>
                      <div className="mt-2 text-xs text-gray-500">
                        <span className="mr-2">Type: {issue.type}</span>
                        <span className="mr-2">Status: {issue.status}</span>
                        {issue.assignee && (
                          <span>Assignee: {issue.assignee}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompletedIssues;
