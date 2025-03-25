import api from "../../api"; 
import { setPlans, addPlan, updatePlan, deletePlan, setLoading, setError } from "./plansSlice";

// ✅ Fetch All Plans
export const fetchPlans = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await api.get("/api/v1/adminpanel/plans/");
    dispatch(setPlans(response.data));
  } catch (error) {
    console.error("❌ Failed to fetch plans:", error.response?.data);
    dispatch(setError(error.response?.data?.error || "Failed to fetch plans"));
  } finally {
    dispatch(setLoading(false)); // ✅ Ensure loading is reset
  }
};

// ✅ Create New Plan
export const createPlan = (planData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const formattedData = {
      ...planData,
      price: parseFloat(planData.price), // ✅ Ensure price is a number
    };

    console.log("🔍 Sending Plan Data:", formattedData);

    await api.post("/api/v1/adminpanel/plans/", formattedData);

    console.log("✅ Plan Created Successfully");

    dispatch(fetchPlans()); // ✅ Refresh plans after adding
  } catch (error) {
    console.error("❌ Plan Creation Failed:", error.response?.data);
    dispatch(setError(error.response?.data?.error || "Failed to create plan"));
  } finally {
    dispatch(setLoading(false)); // ✅ Ensure loading is reset
  }
};

// ✅ Update Plan
export const editPlan = (planId, updatedData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    await api.put(`/api/v1/adminpanel/plans/${planId}/`, updatedData);

    console.log("✅ Plan Updated Successfully");

    dispatch(fetchPlans()); // ✅ Refresh plans after updating
  } catch (error) {
    console.error("❌ Plan Update Failed:", error.response?.data);
    dispatch(setError(error.response?.data?.error || "Failed to update plan"));
  } finally {
    dispatch(setLoading(false)); // ✅ Ensure loading is reset
  }
};

// ✅ Delete Plan
export const removePlan = (planId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    await api.delete(`/api/v1/adminpanel/plans/${planId}/delete/`);

    console.log("✅ Plan Deleted Successfully");

    dispatch(fetchPlans()); // ✅ Refresh plans after deleting
  } catch (error) {
    console.error("❌ Plan Deletion Failed:", error.response?.data);
    dispatch(setError(error.response?.data?.error || "Failed to delete plan"));
  } finally {
    dispatch(setLoading(false)); // ✅ Ensure loading is reset
  }
};
