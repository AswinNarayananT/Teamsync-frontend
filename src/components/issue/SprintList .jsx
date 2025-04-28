import { useSelector } from "react-redux";
import IssueSection from "../IssueSection";

const SprintList = () => {
  const sprints = useSelector((state) => state.currentWorkspace.sprints);
  const issues = useSelector((state) => state.currentWorkspace.issues);

  return (
    <div className="space-y-6">
      {sprints.map((sprint) => {
        // Filter issues belonging to this sprint
        const sprintIssues = issues.filter((issue) => issue.sprint === sprint.id);

        return (
          <IssueSection
            key={sprint.id}
            title={sprint.name}
            dateRange={`${formatDate(sprint.start_date)} – ${formatDate(sprint.end_date)}`}
            visibleItems={0} 
            totalItems={sprintIssues.length} 
            issues={sprintIssues} 
            isSprintSection={true}
            sprintId={sprint.id}
          />
        );
      })}
    </div>
  );
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const options = { day: "numeric", month: "short" }; 
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default SprintList;
