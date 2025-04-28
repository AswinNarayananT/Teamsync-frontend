import { createSlice } from "@reduxjs/toolkit";
import { setCurrentWorkspace, fetchWorkspaceMembers, fetchWorkspaceProjects, fetchWorkspaceStatus, setCurrentProject, fetchEpics, fetchIssuesByEpic, createProject, createIssue, fetchProjectIssues, assignParentEpic, assignAssigneeToIssue, updateIssueStatus,updateIssue, removeWorkspaceMember, fetchSprintsInProject } from "./currentWorkspaceThunk";

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

      .addCase(assignParentEpic.fulfilled, (state, action) => {
        const { issue_id, epic_id } = action.payload;
        const index = state.issues.findIndex(issue => issue.id === issue_id);
      
        if (index !== -1) {
          state.issues[index].parent = epic_id;
        }
      })

      .addCase(assignAssigneeToIssue.fulfilled, (state, action) => {
        const { id: issueId, assignee } = action.payload;
        const index = state.issues.findIndex(issue => issue.id === issueId);
      
        if (index !== -1) {
          state.issues[index].assignee = assignee;
        }
      })

      .addCase(updateIssueStatus.fulfilled, (state, action) => {
        const { issue_id, status } = action.payload;
        const index = state.issues.findIndex(issue => issue.id === issue_id);

        if (index !== -1) {
          state.issues[index].status = status; 
        }
      })
      .addCase(updateIssueStatus.rejected, (state, action) => {
        state.error = action.payload;
      })

      // 🔹 Fetch Issues for Epic
      .addCase(fetchIssuesByEpic.pending, (state) => {
        state.issuesLoading = true;
        state.issuesError = null;
      })
      .addCase(fetchIssuesByEpic.fulfilled, (state, action) => {
        const { epicId, issues } = action.payload;
        state.issuesLoading = false;
        state.issues[epicId] = issues;
      })
      .addCase(fetchIssuesByEpic.rejected, (state, action) => {
        state.issuesLoading = false;
        state.issuesError = action.payload;
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
      });
  },
});

export default currentWorkspaceSlice.reducer;
