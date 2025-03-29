import api from "../../api"; 
import { setPlans, addPlan, updatePlan, deletePlan, setLoading, setError } from "./plansSlice";


export const fetchPlans = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await api.get("/api/v1/adminpanel/plans/");
    dispatch(setPlans(response.data));
  } catch (error) {
    console.error("Failed to fetch plans:", error.response?.data);
    dispatch(setError(error.response?.data?.error || "Failed to fetch plans"));
  } finally {
    dispatch(setLoading(false)); 
  }
};


export const createPlan = (planData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const formattedData = {
      ...planData,
      price: parseFloat(planData.price), 
    };

    console.log("🔍 Sending Plan Data:", formattedData);

    await api.post("/api/v1/adminpanel/plans/", formattedData);

    console.log("Plan Created Successfully");

    dispatch(fetchPlans()); 
  } catch (error) {
    console.error("Plan Creation Failed:", error.response?.data);
    dispatch(setError(error.response?.data?.error || "Failed to create plan"));
  } finally {
    dispatch(setLoading(false)); 
  }
};


export const editPlan = (planId, updatedData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    await api.put(`/api/v1/adminpanel/plans/${planId}/`, updatedData);

    console.log("Plan Updated Successfully");

    dispatch(fetchPlans()); 
  } catch (error) {
    console.error("Plan Update Failed:", error.response?.data);
    dispatch(setError(error.response?.data?.error || "Failed to update plan"));
  } finally {
    dispatch(setLoading(false)); 
  }
};


export const removePlan = (planId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    await api.delete(`/api/v1/adminpanel/plans/${planId}/delete/`);

    console.log("Plan Deleted Successfully");

    dispatch(fetchPlans());
  } catch (error) {
    console.error("Plan Deletion Failed:", error.response?.data);
    dispatch(setError(error.response?.data?.error || "Failed to delete plan"));
  } finally {
    dispatch(setLoading(false)); 
  }
};
