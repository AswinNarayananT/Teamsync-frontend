import { createSlice } from "@reduxjs/toolkit";
import {
  setCurrentWorkspace,
  setCurrentProject,
  fetchWorkspaceMembers,
  fetchWorkspaceProjects,
  fetchWorkspaceStatus,
  fetchEpics,
  fetchProjectIssues,
  fetchSprintsInProject,
  fetchActiveSprintIssues,
  createProject,
  updateProject,
  deleteProject,
  createIssue,
  updateIssue,
  deleteIssue,
  assignParentEpic,
  assignAssigneeToIssue,
  updateIssueStatus,
  createSprintInProject,
  editSprint,
  deleteSprint,
  completeSprint,
  removeWorkspaceMember,
} from "./currentWorkspaceThunk";


const initialState = {
  currentWorkspace: null,
  members: [],
  membersLoading: false,
  membersError: null,

  projects: [],
  projectsLoading: false,
  projectsError: null,

  currentProject: null,

  epics: [], 
  epicsLoading: false,
  epicsError: null,

  issues: [],
  issuesLoading: false,
  issuesError: null,

  sprints: [],
  sprintsLoading: false,
  sprintsError: null,

};

const currentWorkspaceSlice = createSlice({
  name: "currentWorkspace",
  initialState,
  reducers: {}, 
  extraReducers: (builder) => {
    builder
      // 🔹 Set Current Workspace
      .addCase(setCurrentWorkspace.fulfilled, (state, action) => {
        state.currentWorkspace = action.payload;
      })

      // 🔹 Fetch Workspace Members
      .addCase(fetchWorkspaceMembers.pending, (state) => {
        state.membersLoading = true;
        state.membersError = null;
      })
      .addCase(fetchWorkspaceMembers.fulfilled, (state, action) => {
        state.membersLoading = false;
        state.members = action.payload;
      })
      .addCase(fetchWorkspaceMembers.rejected, (state, action) => {
        state.membersLoading = false;
        state.membersError = action.payload;
      })

      // 🔹 Remove Member from Workspace
      .addCase(removeWorkspaceMember.pending, (state) => {
        state.membersError = null;
      })
      .addCase(removeWorkspaceMember.fulfilled, (state, action) => {
        const removedUserId = action.payload; 
        state.members = state.members.filter(member => member.id !== removedUserId);
      })      

       // 🔹 Fetch Workspace status
      .addCase(fetchWorkspaceStatus.fulfilled, (state, action) => {
        if (state.currentWorkspace && state.currentWorkspace.id === action.payload.id) {
          state.currentWorkspace.is_active = action.payload.is_active;
          state.currentWorkspace.is_blocked_by_admin = action.payload.is_blocked_by_admin; 
        }
      })


      // 🔹 Fetch Workspace Projects
      .addCase(fetchWorkspaceProjects.pending, (state) => {
        state.projectsLoading = true;
        state.projectsError = null;
      })
      .addCase(fetchWorkspaceProjects.fulfilled, (state, action) => {
        state.projectsLoading = false;
        state.projects = action.payload;
      })
      .addCase(fetchWorkspaceProjects.rejected, (state, action) => {
        state.projectsLoading = false;
        state.projectsError = action.payload;
      })

      // 🔹 Create Project
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.unshift(action.payload);   

      })
      
       // 🔹 Set Current Project
       .addCase(setCurrentProject.fulfilled, (state, action) => {
        state.currentProject = action.payload;
      })

      .addCase(updateProject.fulfilled, (state, action) => {

        const updatedProject = action.payload;
        
        state.projects = state.projects.map((project) =>
          project.id === updatedProject.id ? updatedProject : project
        );

        if (state.currentProject?.id === updatedProject.id) {
          state.currentProject = updatedProject;
        }
      })
      

      // 🔹 Delete Project
      .addCase(deleteProject.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.projects = state.projects.filter(p => p.id !== deletedId);

        // If currentProject is deleted, assign another one or null
        if (state.currentProject?.id === deletedId) {
          state.currentProject = state.projects.length > 0 ? state.projects[0] : null;
        }
      })

      // 🔹 Fetch Epics for Current Project
      .addCase(fetchEpics.pending, (state) => {
        state.epicsLoading = true;
        state.epicsError = null;
      })
      .addCase(fetchEpics.fulfilled, (state, action) => {
        state.epicsLoading = false;
        state.epics = action.payload;
      })
      .addCase(fetchEpics.rejected, (state, action) => {
        state.epicsLoading = false;
        state.epicsError = action.payload;
      })

      .addCase(fetchProjectIssues.pending, (state) => {
        state.issuesLoading = true;
        state.issuesError = null;
      })
      .addCase(fetchProjectIssues.fulfilled, (state, action) => {
        state.issuesLoading = false;
        state.issues = action.payload;
      })
      .addCase(fetchProjectIssues.rejected, (state, action) => {
        state.issuesLoading = false;
        state.issuesError = action.payload;
      })

      .addCase(fetchSprintsInProject.pending, (state) => {
        state.sprintsLoading = true;
        state.sprintsError = null;
      })
      .addCase(fetchSprintsInProject.fulfilled, (state, action) => {
        state.sprintsLoading = false;
        state.sprints = action.payload;
      })
      .addCase(fetchSprintsInProject.rejected, (state, action) => {
        state.sprintsLoading = false;
        state.sprintsError = action.payload;
      })

      // create sprint
      .addCase(createSprintInProject.pending, (state) => {
        state.sprintsLoading = true;
        state.sprintsError = null;
      })
      .addCase(createSprintInProject.fulfilled, (state, action) => {
        state.sprintsLoading = false;
        state.sprints.push(action.payload); 
      })
      .addCase(createSprintInProject.rejected, (state, action) => {
        state.sprintsLoading = false;
        state.sprintsError = action.payload;
      })

      // edit sprint
      .addCase(editSprint.pending, (state) => {
        state.sprintUpdating = true;
        state.sprintUpdateError = null;
      })
      .addCase(editSprint.fulfilled, (state, action) => {
        state.sprintUpdating = false;
        const updatedSprint = action.payload;
      
        const index = state.sprints.findIndex(s => s.id === updatedSprint.id);
        if (index !== -1) {
          state.sprints[index] = updatedSprint; 
        }
      })
      .addCase(editSprint.rejected, (state, action) => {
        state.sprintUpdating = false;
        state.sprintUpdateError = action.payload;
      })

      // delete sprint
      .addCase(deleteSprint.fulfilled, (state, action) => {
        state.sprints = state.sprints.filter(sprint => sprint.id !== action.payload);
      })
      .addCase(deleteSprint.rejected, (state, action) => {
        state.sprintsError = action.payload;
      })

      // complete sprint
      .addCase(completeSprint.pending, (state) => {
        state.sprintCompleting = true;
        state.sprintCompleteError = null;
      })
      .addCase(completeSprint.fulfilled, (state, action) => {
      state.sprintCompleting = false;
      const { sprint_id, new_sprint } = action.payload;
      state.sprints = state.sprints.filter(sprint => sprint.id !== sprint_id);
      if (new_sprint) {
        state.sprints.push(new_sprint);
      }
    })
      .addCase(completeSprint.rejected, (state, action) => {
        state.sprintCompleting = false;
        state.sprintCompleteError = action.payload;
      })

      .addCase(fetchActiveSprintIssues.pending, (state) => {
        state.issuesLoading = true;
        state.issuesError = null;
      })
      .addCase(fetchActiveSprintIssues.fulfilled, (state, action) => {
        state.issuesLoading = false;
        state.issues = Array.isArray(action.payload.issues) ? action.payload.issues : [];
      
      })
      .addCase(fetchActiveSprintIssues.rejected, (state, action) => {
        state.issuesLoading = false;
        state.issuesError = action.payload || "Failed to load issues";
      })

      .addCase(assignParentEpic.fulfilled, (state, action) => {
        const { issue_id, epic_id } = action.payload;
        const index = state.issues.findIndex(issue => issue.id === issue_id);
      
        if (index !== -1) {
          state.issues[index].parent = epic_id;
        }
      })

      .addCase(assignAssigneeToIssue.fulfilled, (state, action) => {
        const { id: issueId, assignee } = action.payload;
        const issueIndex = state.issues.findIndex(i => i.id === issueId);
        if (issueIndex !== -1) {
          state.issues[issueIndex].assignee = assignee;
          return;
        }

        const epicIndex = state.epics.findIndex(e => e.id === issueId);
        if (epicIndex !== -1) {
          state.epics[epicIndex].assignee = assignee;
        }
      })

      .addCase(updateIssueStatus.fulfilled, (state, action) => {
        const { issue_id, status } = action.payload;
        const issueIndex = state.issues.findIndex(i => i.id === issue_id);
        if (issueIndex !== -1) {
          state.issues[issueIndex].status = status;
          return;
        }

        const epicIndex = state.epics.findIndex(e => e.id === issue_id);
        if (epicIndex !== -1) {
          state.epics[epicIndex].status = status;
        }
      })
      .addCase(updateIssueStatus.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(createIssue.fulfilled, (state, action) => {
        const newIssue = action.payload;
        if (newIssue.type === "epic") {
          state.epics.unshift(newIssue);
        } else {
          state.issues.unshift(newIssue);  
        }
      })
      .addCase(updateIssue.fulfilled, (state, action) => {
        const updatedIssue = action.payload;
        if (updatedIssue.type === "epic") {
          const index = state.epics.findIndex((epic) => epic.id === updatedIssue.id);
          if (index !== -1) {
            state.epics[index] = updatedIssue;
          }
        } else {
          const index = state.issues.findIndex((issue) => issue.id === updatedIssue.id);
          if (index !== -1) {
            state.issues[index] = updatedIssue;
          }
        }
      })
      .addCase(deleteIssue.fulfilled, (state, action) => {
        const deletedId = action.payload;

        state.epics = state.epics.filter((epic) => epic.id !== deletedId);

        state.issues = state.issues.filter((issue) => issue.id !== deletedId);
      });
  },
});

export default currentWorkspaceSlice.reducer;
