import { useSelector } from "react-redux";
import IssueSection from "../IssueSection";

const IssueList = () => {
  const { sprints, issues } = useSelector((state) => state.currentWorkspace);

  const getSprintIssues = (sprintId) =>
    issues.filter((issue) => issue.sprint === sprintId);

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
