import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

/** 🔹 Fetch All Plans */
export const fetchPlans = createAsyncThunk(
  "plans/fetchPlans",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/v1/adminpanel/plans/");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch plans:", error.response?.data);
      return rejectWithValue(error.response?.data?.error || "Failed to fetch plans");
    }
  }
);

/** 🔹 Create a New Plan */
export const createPlan = createAsyncThunk(
  "plans/createPlan",
  async (planData, { dispatch, rejectWithValue }) => {
    try {
      const formattedData = { ...planData, price: parseFloat(planData.price) };
      console.log("🔍 Sending Plan Data:", formattedData);

      const response = await api.post("/api/v1/adminpanel/plans/", formattedData);
      console.log("✅ Plan Created Successfully");

      dispatch(fetchPlans()); // ✅ Refetch plans after creation
      return response.data;
    } catch (error) {
      console.error("❌ Plan Creation Failed:", error.response?.data);
      return rejectWithValue(error.response?.data?.error || "Failed to create plan");
    }
  }
);

/** 🔹 Edit an Existing Plan */
export const editPlan = createAsyncThunk(
  "plans/editPlan",
  async ({ planId, updatedData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/api/v1/adminpanel/plans/${planId}/`, updatedData);
      console.log("✅ Plan Updated Successfully");

      dispatch(fetchPlans()); // ✅ Refetch plans after update
      return response.data;
    } catch (error) {
      console.error("❌ Plan Update Failed:", error.response?.data);
      return rejectWithValue(error.response?.data?.error || "Failed to update plan");
    }
  }
);

/** 🔹 Delete a Plan */
export const removePlan = createAsyncThunk(
  "plans/removePlan",
  async (planId, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/api/v1/adminpanel/plans/${planId}/delete/`);
      console.log("✅ Plan Deleted Successfully");

      dispatch(fetchPlans()); // ✅ Refetch plans after deletion
      return planId;
    } catch (error) {
      console.error("❌ Plan Deletion Failed:", error.response?.data);
      return rejectWithValue(error.response?.data?.error || "Failed to delete plan");
    }
  }
);
