import { createSlice } from "@reduxjs/toolkit";
import { fetchUserWorkspaces, createWorkspace, updateWorkspace, deleteWorkspace,  resetWorkspaceState } from "./workspaceThunks";

const initialState = {
  workspaces: [],
  loading: false,
  error: null,
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {}, 
  extraReducers: (builder) => {
    builder
      // 🔹 Fetch Workspaces
      .addCase(fetchUserWorkspaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserWorkspaces.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaces = action.payload;
      })
      .addCase(fetchUserWorkspaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Create Workspace
      .addCase(createWorkspace.pending, (state) => {
        state.loading = true;
      })
      .addCase(createWorkspace.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Update Workspace
      .addCase(updateWorkspace.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateWorkspace.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Delete Workspace
      .addCase(deleteWorkspace.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteWorkspace.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaces = state.workspaces.filter((ws) => ws.id !== action.payload);
      })
      .addCase(deleteWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Handle Reset on Logout
      .addCase(resetWorkspaceState.fulfilled, (state) => {
        state.workspaces = [];
      });
  },
});

export default workspaceSlice.reducer;
