import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";


/** 🔹 Set Current Workspace & Fetch Members */
export const setCurrentWorkspace = createAsyncThunk(
  "currentWorkspace/setCurrentWorkspace",
  async (workspace, { dispatch }) => {
    await dispatch(fetchWorkspaceMembers(workspace.id)); 
    return workspace;
  }
);


/** 🔹 Fetch Members of the Current Workspace */
export const fetchWorkspaceMembers = createAsyncThunk(
    "currentWorkspace/fetchWorkspaceMembers",
    async (workspaceId, { rejectWithValue }) => {
      try {
        const response = await api.get(`/api/v1/workspace/${workspaceId}/members/`);
        console.log(response.data.members)
        return response.data.members || [];
      } catch (error) {
        console.error("❌ Failed to Fetch Workspace Members:", error.response?.data);
        return rejectWithValue(error.response?.data?.error || "Failed to fetch members");
      }
    }
  );

// 🔹 Fetch Workspace Projects
export const fetchWorkspaceProjects = createAsyncThunk(
    "currentWorkspace/fetchWorkspaceProjects",
    async (workspaceId, { rejectWithValue }) => {
      try {
        const response = await axios.get(`/api/workspaces/${workspaceId}/projects/`);
        return response.data.projects;  
      } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch projects");
      }
    }
);  


export const createProject = createAsyncThunk(
    "projects/createProject",
    async ({ name, description, currentWorkspaceId }, { rejectWithValue }) => {
      try {
        const response = await axios.post(`/api/projects/`, {
          name,
          description,
          workspaceId: currentWorkspaceId,
        });
  
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to create project");
      }
    }
);