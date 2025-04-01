import { createSlice } from "@reduxjs/toolkit";
import { fetchPlans, createPlan, editPlan, removePlan } from "./plansThunks";

const initialState = {
  plans: [],
  loading: false,
  error: null,
};

const plansSlice = createSlice({
  name: "plans",
  initialState,
  reducers: {}, // No need for manual reducers; handled via extraReducers
  extraReducers: (builder) => {
    builder
      // 🔹 Fetch Plans
      .addCase(fetchPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Create Plan
      .addCase(createPlan.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPlan.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Edit Plan
      .addCase(editPlan.pending, (state) => {
        state.loading = true;
      })
      .addCase(editPlan.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(editPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Remove Plan
      .addCase(removePlan.pending, (state) => {
        state.loading = true;
      })
      .addCase(removePlan.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = state.plans.filter((plan) => plan.id !== action.payload);
      })
      .addCase(removePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default plansSlice.reducer;
