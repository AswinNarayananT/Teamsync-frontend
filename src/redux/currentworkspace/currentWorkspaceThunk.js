import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";


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
        return response.data.members || [];
      } catch (error) {
        console.error("Failed to Fetch Workspace Members:", error.response?.data);
        return rejectWithValue(error.response?.data?.error || "Failed to fetch members");
      }
    }
  );

  export const removeWorkspaceMember = createAsyncThunk(
    "currentWorkspace/removeWorkspaceMember",
    async ({ workspaceId, userId }, { rejectWithValue }) => {
      try {
        const res = await api.delete(`/api/v1/workspace/${workspaceId}/remove-member/${userId}/`);
        return res.data.id;
      } catch (error) {
        const errorMessage = 
          error?.response?.data?.detail || 
          error?.detail || 
          error?.message || 
          "Failed to remove member.";
        return rejectWithValue(errorMessage);
      }
    }
  );
  



export const fetchWorkspaceStatus = createAsyncThunk(
  "workspace/fetchWorkspaceStatus",
  async (workspaceId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/v1/workspace/${workspaceId}/status`);
      return {
        id: workspaceId,
        is_active: res.data.is_active,
        is_blocked_by_admin: res.data.is_blocked_by_admin, 
      };
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
        return rejectWithValue(err.response?.data || { detail: "Failed to create project" });
      }
    }
  );

  export const updateProject = createAsyncThunk(
    "project/updateProject",
    async ({ projectId, updatedData }, { rejectWithValue }) => {
      try {
        const response = await api.put(`/api/v1/project/${projectId}/update/`, updatedData);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to update project");
      }
    }
  );
  

  export const deleteProject = createAsyncThunk(
    "project/deleteProject",
    async (projectId, { rejectWithValue }) => {
      try {
        await api.delete(`/api/v1/project/${projectId}/delete/`);
        return projectId; 
      } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to delete project");
      }
    }
  );
  


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
      const response = await api.post(`/api/v1/project/${projectId}/issues/`, issueData);
     
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create issue");
    }
  }
);

export const updateIssue = createAsyncThunk(
  'currentWorkspace/updateIssue',
  async ({ issueId, issueData, projectId }, thunkAPI) => {
    try {
      const res = await api.put(`/api/v1/project/issue/${issueId}/`, issueData);
      return res.data; 
    } catch (error) {
      console.error('Error updating issue:', error);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const deleteIssue = createAsyncThunk(
  'currentWorkspace/deleteIssue',
  async ({ issueId }, thunkAPI) => {
    try {
      const res = await api.delete(`/api/v1/project/issue/${issueId}/delete/`);
      return res.data.id; 
    } catch (error) {
      console.error('Error deleting issue:', error);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const fetchIssueById = createAsyncThunk(
  'issue/fetchById',
  async (issueId, thunkAPI) => {
    try {
      const response = await api.get(`/api/v1/project/issue/${issueId}/`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Error fetching issue');
    }
  }
);


export const fetchEpics = createAsyncThunk(
  'epics/fetchEpics',
  async ({ projectId }, thunkAPI) => {
    try {
      const response = await api.get(`/api/v1/project/${projectId}/epics/`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch epics");
    }
  }
);

export const fetchProjectIssues = createAsyncThunk(
  "currentWorkspace/fetchProjectIssues",
  async ({ projectId, filters = {} }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();

      if (filters.epics?.length) {
        filters.epics.forEach((epicId) => params.append("epics", epicId));
      }

      if (filters.assignees?.length) {
        filters.assignees.forEach((userId) => params.append("assignees", userId));
      }

      if (filters.unassigned) {
        params.append("unassigned", "true");
      }

      const response = await api.get(
        `/api/v1/project/${projectId}/issues/list/?${params.toString()}`
      );

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch issues");
    }
  }
);

export const createSprintInProject = createAsyncThunk(
  "sprints/createInProject",
  async ({ projectId, sprintData }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/v1/project/${projectId}/sprints/`, sprintData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to create sprint."
      );
    }
  }
);

export const fetchSprintsInProject = createAsyncThunk(
  "sprints/fetchInProject",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/project/${projectId}/sprints/`);
      return response.data; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch sprints."
      );
    }
  }
);

export const fetchActiveSprintIssues = createAsyncThunk(
  "issues/fetchActiveSprintIssues",
  /**
   * @param {{ projectId: number, parentIds?: number[], sprintIds?: number[], assigneeIds?: number[] }}
   */
  async ({ projectId, parentIds = [], sprintIds = [], assigneeIds = [] }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();

      if (parentIds.length)   params.append("parents", parentIds.join(","));
      if (sprintIds.length)   params.append("sprints", sprintIds.join(","));
      if (assigneeIds.length) params.append("assignee", assigneeIds.join(",")); 

      const url =
        `/api/v1/project/${projectId}/active-sprint-issues/` +
        (params.toString() ? `?${params.toString()}` : "");

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch issues for active sprint."
      );
    }
  }
);



export const editSprint = createAsyncThunk(
  "sprints/edit",
  async ({ sprintId, sprintData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/api/v1/project/sprints/${sprintId}/`, sprintData);
      return response.data; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update sprint."
      );
    }
  }
);

export const deleteSprint = createAsyncThunk(
  "sprints/delete",
  async ({ sprintId, projectId }, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/api/v1/project/sprints/${sprintId}/`);
      dispatch(fetchProjectIssues(projectId))
      return sprintId; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete sprint."
      );
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
    return rejectWithValue(error.response?.data.error || error.message);
  }
}
);

// Fetch all attachments for a specific issue
export const fetchAttachments = createAsyncThunk(
  'attachments/fetch',
  async (issueId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/project/issues/${issueId}/attachments/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createAttachment = createAsyncThunk(
  'attachments/create',
  async ({ issueId, formData }, { rejectWithValue }) => {
    try {

      const response = await api.post(
        `/api/v1/project/issues/${issueId}/attachments/`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteAttachment = createAsyncThunk(
  'attachments/delete',
  async (attachmentId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/v1/project/attachments/${attachmentId}/`);
      return attachmentId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const checkIssueStatus = createAsyncThunk(
  "sprint/checkIssueStatus",
  async (sprintId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/project/sprints/${sprintId}/issues/`);
      console.log("data of issue",response.data)
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const completeSprint = createAsyncThunk(
  "sprint/completeSprint",
  async ({ projectId, sprintId, action }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/v1/project/${projectId}/sprints/${sprintId}/complete/`, {
        action,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCompletedSprintsWithIssues = createAsyncThunk(
  "sprint/fetchCompletedSprintsWithIssues",
  async ({ projectId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/project/${projectId}/completed-sprints/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const createMeeting = createAsyncThunk(
  'meeting/createMeeting',
  async ({ projectId, meetingData }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/api/v1/realtime/projects/${projectId}/meetings/create/`, meetingData);
      return res.data;
    } catch (error) {
  console.error('Create meeting error:', error.response?.data);
  return rejectWithValue(error.response?.data || "Something went wrong");
}
  }
);



export const fetchUpcomingMeetings = createAsyncThunk(
  'meeting/fetchUpcomingMeetings',
  async ({ workspaceId }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/v1/realtime/workspaces/${workspaceId}/meetings/upcoming/`);
      return res.data;
    } catch (error) {
      console.error('Fetch upcoming meetings error:', error.response?.data);
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);
