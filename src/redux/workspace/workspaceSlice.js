import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  workspaces: [],  
  currentWorkspace: null,  
  loading: true,  
  error: null,
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setWorkspaces: (state, action) => {
      state.workspaces = Array.isArray(action.payload) ? action.payload : [];
      state.currentWorkspace = state.workspaces.length > 0 ? state.workspaces[0] : null;
      state.loading = false;
    },
    setCurrentWorkspace: (state, action) => {
      const workspaceExists = state.workspaces.some(ws => ws.id === action.payload?.id);
      if (workspaceExists) {
        state.currentWorkspace = action.payload;
      } else {
        console.log("Selected workspace not found in list. Keeping current workspace.");
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setWorkspaces, setCurrentWorkspace, setLoading, setError } = workspaceSlice.actions;
export default workspaceSlice.reducer;
