import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

/** 🔹 Fetch User Workspaces */
export const fetchUserWorkspaces = createAsyncThunk(
  "workspace/fetchUserWorkspaces",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/v1/workspace/list/");

      const workspaces = Array.isArray(response.data) ? response.data : response.data.workspaces || [];
      return workspaces;
    } catch (error) {
      console.error("❌ Failed to Fetch Workspaces:", error.response?.data);
      return rejectWithValue(error.response?.data?.error || "Failed to fetch workspaces");
    }
  }
);

/** 🔹 Create a New Workspace */
export const createWorkspace = createAsyncThunk(
  "workspace/createWorkspace",
  async ({ workspaceData, navigate }, { dispatch, rejectWithValue }) => {
    try {
      console.log("🔍 Sending Workspace Data:", workspaceData);
      const response = await api.post("/api/v1/workspace/create/", workspaceData);

      console.log("✅ Workspace Created:", response.data);

      if (response.data.redirect_url) {
        console.log("🚀 Redirecting to Stripe Checkout:", response.data.redirect_url);
        const stripe = await stripePromise;
        if (!stripe) {
          console.error("❌ Stripe failed to initialize.");
          return rejectWithValue("Stripe Checkout failed.");
        }

        const { error } = await stripe.redirectToCheckout({
          sessionId: response.data.session_id,
        });

        if (error) {
          console.error("🚨 Stripe Checkout Error:", error);
          return rejectWithValue("Stripe Checkout failed.");
        }
      } else {
        dispatch(fetchUserWorkspaces()); // ✅ Refetch workspaces
        navigate("/dashboard");
      }

      return response.data;
    } catch (error) {
      console.error("❌ Workspace Creation Failed:", error.response?.data);
      return rejectWithValue(error.response?.data?.error || "Failed to create workspace");
    }
  }
);

/** 🔹 Update a Workspace */
export const updateWorkspace = createAsyncThunk(
  "workspace/updateWorkspace",
  async ({ workspaceId, updatedData }, { dispatch, rejectWithValue }) => {
    try {
      await api.put(`/api/v1/workspaces/${workspaceId}/`, updatedData);
      dispatch(fetchUserWorkspaces()); // ✅ Refetch workspaces after update
      return { workspaceId, updatedData };
    } catch (error) {
      console.error("❌ Workspace Update Failed:", error.response?.data);
      return rejectWithValue(error.response?.data?.error || "Failed to update workspace");
    }
  }
);

/** 🔹 Delete a Workspace */
export const deleteWorkspace = createAsyncThunk(
  "workspace/deleteWorkspace",
  async ({ workspaceId, navigate }, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/api/v1/workspaces/${workspaceId}/`);
      dispatch(fetchUserWorkspaces()); // ✅ Refetch workspaces after deletion
      navigate("/create-workspace");
      return workspaceId;
    } catch (error) {
      console.error("❌ Workspace Deletion Failed:", error.response?.data);
      return rejectWithValue(error.response?.data?.error || "Failed to delete workspace");
    }
  }
);

/** 🔹 Switch Workspace */
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


/** 🔹 Reset Workspace State on Logout */
export const resetWorkspaceState = createAsyncThunk(
  "workspace/resetWorkspaceState",
  async () => {
    return null; 
  }
);
