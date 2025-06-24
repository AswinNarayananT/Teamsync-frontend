import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlans } from "../redux/plan/plansThunks";
import { toast } from "react-toastify";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";

const UpdateSubscription = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { plans, loading } = useSelector((state) => state.plans);
  const { currentWorkspace } = useSelector((state) => state.currentWorkspace);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  const handlePlanUpdate = async () => {
    if (!selectedPlanId) {
      toast.error("Please select a plan.");
      return;
    }

    setSubmitting(true);
    try {
        const res = await api.post("/api/v1/workspace/subscription/update/", {
        workspace_id: currentWorkspace.id,
        plan_id: selectedPlanId,
        });
      window.location.href = res.data.redirect_url;
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to initiate plan update.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-green-400">Update Your Subscription</h1>
        <button
          onClick={() => navigate(-1)}
          className="text-sm px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-white flex items-center gap-2"
        >
          <MdArrowBack className="text-lg" /> Back
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading plans...</p>
      ) : plans.length === 0 ? (
        <p className="text-gray-400">No plans available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`p-6 rounded-lg border-2 cursor-pointer transition hover:scale-105 h-full ${
                selectedPlanId === plan.id
                  ? "border-green-500 bg-green-500 bg-opacity-20"
                  : "border-gray-700 bg-gray-800 hover:border-green-400"
              }`}
              onClick={() => setSelectedPlanId(plan.id)}
            >
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="text-gray-400 my-2">{plan.description}</p>
              <div className="text-3xl font-bold">
                ${plan.price}/<span className="text-sm text-gray-400">month</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <button
          className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition ${
            (!selectedPlanId || submitting) && "opacity-50 cursor-not-allowed"
          }`}
          onClick={handlePlanUpdate}
          disabled={!selectedPlanId || submitting}
        >
          {submitting ? "Redirecting..." : "Update Subscription"}
        </button>
      </div>
    </div>
  );
};

export default UpdateSubscription;
