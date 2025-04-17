import { createSlice } from "@reduxjs/toolkit";
import { setCurrentWorkspace, fetchWorkspaceMembers, fetchWorkspaceProjects, fetchWorkspaceStatus, setCurrentProject, fetchEpics, fetchIssuesByEpic, createProject, } from "./currentWorkspaceThunk";

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

  issues: {},
  issuesLoading: false,
  issuesError: null,

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
      });
  },
});

export default currentWorkspaceSlice.reducer;
