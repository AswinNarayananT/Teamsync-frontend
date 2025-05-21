import { createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { setCurrentWorkspace } from "../currentworkspace/currentWorkspaceThunk";


import api from "../../api";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const fetchUserWorkspaces = createAsyncThunk(
  "workspace/fetchUserWorkspaces",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.get("/api/v1/workspace/list/");
      const workspaces = Array.isArray(response.data) ? response.data : response.data.workspaces || [];
      console.log(workspaces)
      if (workspaces.length > 0) {
        dispatch(setCurrentWorkspace(workspaces[0]));
      }
      return workspaces;
    } catch (error) {
      console.error("Failed to Fetch Workspaces:", error.response?.data);
      return rejectWithValue(error.response?.data?.error || "Failed to fetch workspaces");
    }
  }
);
 


export const createWorkspace = createAsyncThunk(
  "workspace/createWorkspace",
  async ({ workspaceData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/api/v1/workspace/create/", workspaceData);
      const data = response.data;

      if (data.redirect_url) {
        const stripe = await stripePromise;
        if (!stripe) return rejectWithValue("Stripe failed to initialize.");

        const { error } = await stripe.redirectToCheckout({ sessionId: data.session_id });
        if (error) return rejectWithValue("Stripe Checkout failed.");
      } else {
        dispatch(fetchUserWorkspaces());
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to create workspace");
    }
  }
);


export const updateWorkspace = createAsyncThunk(
  "workspace/updateWorkspace",
  async ({ workspaceId, updatedData }, { dispatch, rejectWithValue }) => {
    try {
      await api.put(`/api/v1/workspaces/${workspaceId}/`, updatedData);
      dispatch(fetchUserWorkspaces()); 
      return { workspaceId, updatedData };
    } catch (error) {
      console.error("Workspace Update Failed:", error.response?.data);
      return rejectWithValue(error.response?.data?.error || "Failed to update workspace");
    }
  }
);


export const deleteWorkspace = createAsyncThunk(
  "workspace/deleteWorkspace",
  async ({ workspaceId, navigate }, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/api/v1/workspaces/${workspaceId}/`);
      dispatch(fetchUserWorkspaces());
      navigate("/create-workspace");
      return workspaceId;
    } catch (error) {
      console.error("Workspace Deletion Failed:", error.response?.data);
      return rejectWithValue(error.response?.data?.error || "Failed to delete workspace");
    }
  }
);



export const switchWorkspace = createAsyncThunk(
  "workspace/switchWorkspace",
  async (workspaceId, { getState, rejectWithValue }) => {
    const { workspaces } = getState().workspace;
    const selectedWorkspace = workspaces.find((ws) => ws.id === workspaceId);

    if (!selectedWorkspace) {
      return rejectWithValue("Workspace not found.");
    }

    return selectedWorkspace;
  }
);


export const resetWorkspaceState = createAsyncThunk(
  "workspace/resetWorkspaceState",
  async () => {
    return null; 
  }
);




export const cancelSubscription = createAsyncThunk(
  "workspace/cancelSubscription",
  async (subscriptionId, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/v1/workspace/cancel-subscription/", {
        subscription_id: subscriptionId,
      });
      return subscriptionId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

