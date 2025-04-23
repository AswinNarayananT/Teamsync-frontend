import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";


/** 🔹 Set Current Workspace & Fetch Members */
export const setCurrentWorkspace = createAsyncThunk(
  "currentWorkspace/setCurrentWorkspace",
  async (workspace, { dispatch }) => {
    await dispatch(fetchWorkspaceMembers(workspace.id)); 

    const resultAction = await dispatch(fetchWorkspaceProjects(workspace.id));
    const projects = resultAction.payload;

    if (projects && projects.length > 0) {
      await dispatch(setCurrentProject(projects[0]));
    }
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



  export const fetchWorkspaceStatus = createAsyncThunk(
    "workspace/fetchWorkspaceStatus",
    async (workspaceId, { rejectWithValue }) => {
      try {
        const res = await api.get(`/api/v1/workspace/${workspaceId}/status`);
        return { id: workspaceId, is_active: res.data.is_active };
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Error fetching status");
      }
    }
  );

  export const createProject = createAsyncThunk(
    "projects/createProject",
    async ({ name, description, currentWorkspaceId }, { rejectWithValue, dispatch }) => {
      try {
        const res = await api.post(`/api/v1/project/create/`, {
          name,
          description,
          workspaceId: currentWorkspaceId,
        });
  
        const newProject = res.data;
  
        dispatch(setCurrentProject(newProject)); 
  
        return newProject;
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to create project");
      }
    }
  );

// 🔹 Fetch Workspace Projects
export const fetchWorkspaceProjects = createAsyncThunk(
    "currentWorkspace/fetchWorkspaceProjects",
    async (workspaceId, { rejectWithValue }) => {
      try {
        const response = await api.get(`/api/v1/project/${workspaceId}/list/`);
        return response.data.projects;  
      } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch projects");
      }
    }
);  



export const setCurrentProject = createAsyncThunk(
  "currentWorkspace/setCurrentProject",
  async (project) => {
    return project;
  }
);


export const createIssue = createAsyncThunk(
  "issues/createIssue",
  async ({ issueData, projectId }, { rejectWithValue }) => {
    try {
      console.log(issueData)
      const response = await api.post(`/api/v1/project/${projectId}/issues/`, issueData);
     
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create issue");
    }
  }
);

export const updateIssue = createAsyncThunk(
  'currentWorkspace/updateIssue', // action type
  async ({ issueId, issueData, projectId }, thunkAPI) => {
    try {
      // Sending the API request with the issue ID and issue data
      const res = await api.put(`/api/v1/project/issue/${issueId}/`, issueData);
      return res.data; // Return the updated issue data
    } catch (error) {
      // If the request fails, log the error and throw it
      console.error('Error updating issue:', error);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const fetchEpics = createAsyncThunk(
  'epics/fetchEpics',
  async ({ projectId }, thunkAPI) => {
    try {
      const response = await api.get(`/api/v1/project/${projectId}/epics/`);
      console.log(response.data)
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch epics");
    }
  }
);

export const fetchProjectIssues = createAsyncThunk(
  "currentWorkspace/fetchProjectIssues",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/project/${projectId}/issues/list/`);
      console.log(response.data)
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch issues");
    }
  }
);


export const assignParentEpic = createAsyncThunk(
  'issues/assignParentEpic',
  async ({ issueId, epicId }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/v1/project/issue/assign-parent/', {
        issue_id: issueId,
        epic_id: epicId,
      });

      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const assignAssigneeToIssue = createAsyncThunk(
  "issues/assignAssigneeToIssue",
  async ({ issueId, memberId }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/api/v1/project/issue/${issueId}/assign-assignee/`, {
        member_id: memberId,
      });
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateIssueStatus = createAsyncThunk(
  "issues/updateIssueStatus",  
  async ({ issueId, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/api/v1/project/issue/${issueId}/status/`, {
        status: status,
      });
      return response.data;  
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchIssuesByEpic = createAsyncThunk(
  'issues/fetchIssuesByEpic',
  async (epicId, thunkAPI) => {
    try {
      const response = await axios.get(`/api/epics/${epicId}/issues/`);
      return { epicId, issues: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch issues");
    }
  }
);
