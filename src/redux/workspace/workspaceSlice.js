import { createSlice } from "@reduxjs/toolkit";
import { fetchUserWorkspaces, createWorkspace, updateWorkspace, deleteWorkspace, switchWorkspace, resetWorkspaceState } from "./workspaceThunks";

const initialState = {
  workspaces: [],
  currentWorkspace: null,
  loading: false,
  error: null,
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {}, // ✅ No need for manual reducers; handled via extraReducers
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
        state.currentWorkspace = action.payload.length > 0 ? action.payload[0] : null;
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
        state.currentWorkspace = state.workspaces.length > 0 ? state.workspaces[0] : null;
      })
      .addCase(deleteWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Switch Workspace
      .addCase(switchWorkspace.fulfilled, (state, action) => {
        state.currentWorkspace = action.payload;
      })
      .addCase(switchWorkspace.rejected, (state, action) => {
        state.error = action.payload;
      })

      // 🔹 Handle Reset on Logout
      .addCase(resetWorkspaceState.fulfilled, (state) => {
        state.workspaces = [];
        state.currentWorkspace = null;
      });
  },
});

export default workspaceSlice.reducer;
