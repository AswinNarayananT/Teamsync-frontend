import { loginSuccess, logoutSuccess, setUser, setLoading, setError } from "./authSlice";
import api from "../../api";
import { persistor } from '../store';



export const registerUser = (userData, navigate) => async (dispatch) => {
    try {
      dispatch(setLoading(true));
  
      const response = await api.post("api/v1/accounts/register/", userData);
      dispatch(setLoading(false));
  
      navigate("/otp-verify", { state: { email: userData.email } }); // ✅ Redirect to OTP page
    } catch (error) {
      console.error("Full Backend Error:", error.response?.data); // ✅ Log full error response
  
      if (error.response?.data?.otp_verification) {
        console.log("Resending OTP, redirecting...");
        navigate("/otp-verify", { state: { email: userData.email } }); // ✅ Redirect if OTP was resent
      } else {
        const errorMsg = Object.values(error.response?.data).flat().join(", "); // ✅ Convert error object to string
        dispatch(setError(errorMsg)); // ✅ Show a readable error
      }
    }
  };
  
  
// Login User
export const loginUser = (credentials, navigate) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await api.post("api/v1/accounts/login/", credentials);
    dispatch(setUser(response.data.user));
    
    if (response.data.user.is_superuser) {
      navigate("/adminpanel");
    } else {
      await dispatch(fetchUserWorkspaces());

      const workspaces = response.data.workspaces;

      if (workspaces.length === 0) {
        navigate("/create-workspace");  
      } else {
        navigate("/dashboard"); 
      }
    }
  } catch (error) {
    dispatch(setError(error.response?.data?.error || "Login failed"));
  }
};


  export const googleLogin = (googleCredential, navigate) => async (dispatch) => {
    try {
      console.log("🔄 Sending Google Credential to Backend:", googleCredential);
      dispatch(setLoading(true));

      const response = await api.post("/api/v1/accounts/auth/google/", { credential: googleCredential });
  
      console.log("✅ Google Authentication Success - Backend Response:", response.data);
  
      dispatch(setUser(response.data.user)); 
      navigate("/dashboard"); 
      dispatch(setLoading(false));
    } catch (error) {
      console.error("❌ Google Authentication Failed - Error:", error.response?.data || error);
      dispatch(setError(error.response?.data?.error || "Google Login failed"));
    }
  };
  
  
  

// Fetch Logged-in User
export const fetchUser = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await api.get("api/v1/accounts/protected/");
    dispatch(setUser(response.data)); // Store user in Redux
  } catch (error) {
    dispatch(setUser(null)); // Reset user state on failure
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    await api.post("/api/v1/accounts/logout/");
    console.log("executing dispath")
    dispatch(logoutSuccess());
    persistor.purge();
  } catch (error) {
    console.error("Logout failed:", error);
  }
};


