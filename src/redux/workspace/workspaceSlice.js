import { createSlice } from "@reduxjs/toolkit";
import { fetchUserWorkspaces, createWorkspace, updateWorkspace, deleteWorkspace,  resetWorkspaceState, cancelSubscription } from "./workspaceThunks";

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

      .addCase(resetWorkspaceState.fulfilled, (state) => {
        state.workspaces = [];
      })
      
      .addCase(cancelSubscription.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        state.loading = false;
        const subscriptionId = action.payload;
        const workspace = state.workspaces.find(ws => ws.stripe_subscription_id === subscriptionId);
        if (workspace) {
          workspace.is_active = false;
        }
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default workspaceSlice.reducer;
