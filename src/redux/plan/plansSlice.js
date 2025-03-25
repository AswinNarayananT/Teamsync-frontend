import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  plans: [],
  loading: false,
  error: null,
};

const plansSlice = createSlice({
  name: "plans",
  initialState,
  reducers: {
    setPlans: (state, action) => {
      state.plans = action.payload;
      state.loading = false;
      state.error = null;  // ✅ Clear error on success
    },
    addPlan: (state, action) => {
      state.plans.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    updatePlan: (state, action) => {
      const index = state.plans.findIndex((plan) => plan.id === action.payload.id);
      if (index !== -1) {
        state.plans[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    deletePlan: (state, action) => {
      state.plans = state.plans.filter((plan) => plan.id !== action.payload);
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;  // ✅ Stop loading on error
    },
  },
});

export const { setPlans, addPlan, updatePlan, deletePlan, setLoading, setError } = plansSlice.actions;
export default plansSlice.reducer;
