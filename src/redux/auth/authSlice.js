import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.error = null;
      state.loading = false;
    },
    logoutSuccess: (state) => {
      return initialState; 
    },
  },
});

export const { setUser, setLoading, setError, loginSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
