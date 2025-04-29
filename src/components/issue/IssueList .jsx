import { useSelector } from "react-redux";
import IssueSection from "../IssueSection";

const IssueList = ({ selectedParents }) => {
  console.log(selectedParents)
  const { sprints, issues } = useSelector((state) => state.currentWorkspace);

  // Ensure selectedParents is always an array
  const safeSelectedParents = Array.isArray(selectedParents) ? selectedParents : [];

  const isMatch = (issue) => {
    if (safeSelectedParents.length === 0) return true;
    if (safeSelectedParents.includes("none") && !issue.parent) return true;
    if (issue.parent && safeSelectedParents.includes(issue.parent)) return true;
    return false;
  };

  const getSprintIssues = (sprintId) =>
    issues.filter((issue) => issue.sprint === sprintId && isMatch(issue));

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { day: "numeric", month: "short" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-6">
      {sprints.map((sprint) => (
        <IssueSection
          key={sprint.id}
          title={sprint.name}
          dateRange={`${formatDate(sprint.start_date)} – ${formatDate(sprint.end_date)}`}
          issues={getSprintIssues(sprint.id)}
          isSprintSection={true}
          sprint={sprint}
        />
      ))}
      <IssueSection
        title="Backlog"
        issues={getSprintIssues(null)}
        isSprintSection={false}
      />
    </div>
  );
};

export default IssueList;
