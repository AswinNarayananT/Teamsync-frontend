import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import api from "../../api";
import { resetWorkspaceState } from "../workspace/workspaceThunks";

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ userData, navigate }, { rejectWithValue }) => {
    try {
      console.log("📤 Registering User:", userData); // Debugging Step
      if (!userData || Object.keys(userData).length === 0) {
        throw new Error("User data is missing!");
      }
      await api.post("/api/v1/accounts/register/", userData);
      navigate("/otp-verify", { state: { email: userData.email } });
      toast.success("Registration successful!");
    } catch (error) {
      console.error("❌ Registration Failed:", error.response?.data);
      const errorMsg = Object.values(error.response?.data || {}).flat().join(", ");
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);



/** 🔹 Login User */
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ credentials, navigate }, { rejectWithValue }) => {
    try {

      const response = await api.post("api/v1/accounts/login/", credentials);
      const user = response.data.user;
      const token =response.data.refresh_token;
      localStorage.setItem("refresh_token", token);


      const inviteToken = localStorage.getItem("invite_token");

      if (inviteToken) {
        try {
          await api.post("api/v1/workspace/accept-invite/", { token: inviteToken });
          localStorage.removeItem("invite_token");
          toast.success("Successfully joined the workspace!");    
        } catch (inviteError) {
          console.error("Failed to accept invite:", inviteError);
          toast.error(inviteError.response?.data?.error || "Failed to accept workspace invite");
        }
      }
      
      if (user.is_superuser) {
        navigate("/adminpanel");
        toast.success("Logged in successfully!");
      } else {
        navigate("/dashboard");
        toast.success("Logged in successfully!");
      }

      return user;
    } catch (error) {
      const errorMessage =
      error.response?.data?.non_field_errors?.[0] || "An error occurred. Please try again.";
      toast.error(errorMessage);
      return rejectWithValue(error.response?.data?.error || "Login failed");
    }
  }
);


/** 🔹 Google Login */
export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async ({ googleCredential, navigate }, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/v1/accounts/auth/google/", {
        credential: googleCredential,
      });

      const user = response.data.user;
      const refreshToken = response.data.refresh_token;

      // Store refresh token in local storage
      localStorage.setItem("refresh_token", refreshToken);

      // Handle workspace invitation if applicable
      const inviteToken = localStorage.getItem("invite_token");
      if (inviteToken) {
        try {
          await api.post("api/v1/workspace/accept-invite/", { token: inviteToken });
          localStorage.removeItem("invite_token");
          toast.success("Successfully joined the workspace!");
        } catch (inviteError) {
          console.error("Failed to accept invite:", inviteError);
          toast.error(inviteError.response?.data?.error || "Failed to accept workspace invite");
        }
      }

      // Navigate based on user role
      if (user.is_superuser) {
        navigate("/adminpanel");
      } else {
        navigate("/dashboard");
      }

      toast.success("Google Login successful!");
      return user;
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Google Login failed";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);



/** 🔹 Fetch User */
export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("api/v1/accounts/protected/");
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch user");
    }
  }
);

/** 🔹 Logout User */
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        await api.post("/api/v1/accounts/logout/", { refresh: refreshToken });
      }

      localStorage.removeItem("refresh_token");

      dispatch(resetWorkspaceState());

      toast.success("Logged out successfully!");
      return null;
    } catch (error) {
      toast.error("Logout failed");
      return rejectWithValue("Logout failed");
    }
  }
);

