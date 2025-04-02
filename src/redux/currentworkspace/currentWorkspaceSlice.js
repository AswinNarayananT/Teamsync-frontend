import { createSlice } from "@reduxjs/toolkit";
import { setCurrentWorkspace, fetchWorkspaceMembers, fetchWorkspaceProjects } from "./currentWorkspaceThunk";

const initialState = {
  currentWorkspace: null,
  members: [],
  membersLoading: false,
  membersError: null,
  projects: [],
  projectsLoading: false,
  projectsError: null,
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
      });
  },
});

export default currentWorkspaceSlice.reducer;
