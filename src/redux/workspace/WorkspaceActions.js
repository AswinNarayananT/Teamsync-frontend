import { loadStripe } from "@stripe/stripe-js";
import api from "../../api";
import { setWorkspaces, setCurrentWorkspace, setLoading, setError } from "./workspaceSlice";


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default stripePromise;

export const fetchUserWorkspaces = () => async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await api.get("/api/v1/workspace/list/");
      console.log("Workspaces API Response:", response.data);

      const workspaces = Array.isArray(response.data) ? response.data : (response.data.workspaces || []);
  
      dispatch(setWorkspaces(workspaces));
  
      if (workspaces.length > 0) {
        dispatch(setCurrentWorkspace(workspaces[0]));
      }
    } catch (error) {
      console.error("Failed to Fetch Workspaces:", error.response?.data);
      dispatch(setError(error.response?.data?.error || "Failed to fetch workspaces"));
    } finally {
      dispatch(setLoading(false));
    }
  };
  
  

  export const switchWorkspace = (workspaceId) => (dispatch, getState) => {
    const { workspaces } = getState().workspace;
    const selectedWorkspace = workspaces.find(ws => ws.id === workspaceId);
  
    if (selectedWorkspace) {
      dispatch(setCurrentWorkspace(selectedWorkspace));
    }
  };
  
  export const createWorkspace = (workspaceData, navigate) => async (dispatch) => {
    try {
        dispatch(setLoading(true));

        console.log("Sending Workspace Data:", workspaceData);

        const response = await api.post("/api/v1/workspace/create/", workspaceData);
        
        console.log("Workspace Created:", response.data);

        if (response.data.redirect_url) {
            console.log("Redirecting to Stripe Checkout:", response.data.redirect_url);

            const stripe = await stripePromise;
            if (!stripe) {
                console.error("Stripe failed to initialize.");
                return;
            }

            const { error } = await stripe.redirectToCheckout({
                sessionId: response.data.session_id, 
            });

            if (error) {
                console.error("🚨 Stripe Checkout Error:", error);
                dispatch(setError("Stripe Checkout failed"));
            }
        } else {
            dispatch(fetchUserWorkspaces()); 
            navigate("/dashboard"); 
        }
    } catch (error) {
        console.error("Workspace Creation Failed:", error.response?.data);
        dispatch(setError(error.response?.data?.error || "Failed to create workspace"));
    }
};

  export const updateWorkspace = (workspaceId, updatedData) => async (dispatch) => {
    try {
      dispatch(setLoading(true));
  
      const response = await api.put(`/api/v1/workspaces/${workspaceId}/`, updatedData);
  
      dispatch(fetchUserWorkspaces()); 
    } catch (error) {
      dispatch(setError(error.response?.data?.error || "Failed to update workspace"));
    }
  };
  

  export const deleteWorkspace = (workspaceId, navigate) => async (dispatch) => {
    try {
      dispatch(setLoading(true));
  
      await api.delete(`/api/v1/workspaces/${workspaceId}/`);
  
      dispatch(fetchUserWorkspaces()); 
      navigate("/create-workspace"); 
    } catch (error) {
      dispatch(setError(error.response?.data?.error || "Failed to delete workspace"));
    }
  };
  

