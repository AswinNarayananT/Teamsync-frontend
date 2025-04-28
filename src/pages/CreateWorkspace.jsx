import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchPlans } from "../redux/plan/plansThunks";
import { toast } from "react-toastify";
import { createWorkspace, fetchUserWorkspaces } from "../redux/workspace/workspaceThunks";

const workTypes = [
  { name: "Software Development", icon: "💻" },
  { name: "Design", icon: "🎨" },
  { name: "Product Management", icon: "📦" },
  { name: "Marketing", icon: "📢" },
  { name: "Project Management", icon: "📊" },
  { name: "Finance", icon: "💰" },
];

const CreateWorkspace = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { plans, loading } = useSelector((state) => state.plans);
  const { workspaces } = useSelector((state) => state.workspace);

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    workType: "",
    name: "",
    description: "",
    type: "individual",
    plan_id: "",
  });

  useEffect(() => {
    if (workspaces.length > 0) {
      const ownerWorkspace = workspaces.find((ws) => ws.role === "owner");
      if (ownerWorkspace) {
        navigate("/dashboard");
      }
    }
  }, [loading, workspaces, navigate]);

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWorkTypeSelect = (type) => {
    setFormData({ ...formData, workType: type });
    setStep(2);
  };

  const handlePlanSelect = (planId) => {
    if (!planId) {
      toast("Please select a plan");
      return;
    }
    setFormData({ ...formData, plan_id: planId });
    handleSubmit();
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const resultAction = await dispatch(createWorkspace({ workspaceData: formData }));

      if (createWorkspace.fulfilled.match(resultAction)) {
        const data = resultAction.payload;
        if (!data.redirect_url) {
          navigate("/dashboard");
        }
      } else {
        toast.error(resultAction.payload || "Failed to create workspace");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (formData.name.trim() === "") {
      toast("Please enter a workspace name");
      return;
    }
    setStep(3);
  };

  const steps = [
    { number: 1, name: "Work Type" },
    { number: 2, name: "Workspace Details" },
    { number: 3, name: "Select Plan" },
  ];

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Progress Bar */}
      <div className="w-full py-6 px-8 bg-gray-900 border-b border-gray-700">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between">
            {steps.map((s, index) => (
              <div key={s.number} className="relative w-full flex items-center">
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full font-bold transition-all duration-300 
                  ${step >= s.number ? "bg-green-500 text-white" : "bg-gray-700 text-gray-400"}`}
                >
                  {s.number}
                </div>
                <span className={`ml-3 ${step >= s.number ? "text-white" : "text-gray-400"}`}>{s.name}</span>
                {index < steps.length - 1 && (
                  <div className="flex-grow h-1 bg-gray-700 mx-2">
                    <div className={`h-1 transition-all duration-500 ${step > s.number ? "bg-green-500 w-full" : "w-0"}`}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow flex items-center justify-center p-8">
        <div className="max-w-4xl w-full">
          {/* Step 1: Select Work Type */}
          {step === 1 && (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-green-400">What kind of work do you do?</h2>
              <p className="text-gray-400 mt-2">We'll customize your workspace based on your needs</p>
              <div className="grid grid-cols-3 gap-6 mt-8">
                {workTypes.map((type) => (
                  <button
                    key={type.name}
                    className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition border border-transparent hover:border-green-500"
                    onClick={() => handleWorkTypeSelect(type.name)}
                  >
                    <span className="text-4xl mb-4">{type.icon}</span>
                    <span className="text-lg font-medium">{type.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Workspace Details */}
          {step === 2 && (
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-green-400 mb-4">Workspace Details</h2>
              <form className="bg-gray-900 p-8 rounded-lg">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Workspace Name"
                  required
                  className="w-full p-3 mb-4 bg-gray-800 text-white rounded-md"
                />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description"
                  className="w-full p-3 mb-4 bg-gray-800 text-white rounded-md"
                />
                <div className="flex justify-center space-x-6">
                  <label className="cursor-pointer flex items-center space-x-2">
                    <input type="radio" name="type" value="individual" checked={formData.type === "individual"} onChange={handleChange} />
                    <span>Individual</span>
                  </label>
                  <label className="cursor-pointer flex items-center space-x-2">
                    <input type="radio" name="type" value="company" checked={formData.type === "company"} onChange={handleChange} />
                    <span>Company</span>
                  </label>
                </div>
                <button type="button" className="w-full bg-green-500 py-3 mt-6 rounded-lg text-lg" onClick={handleNext}>
                  Next
                </button>
              </form>
            </div>
          )}

          {/* Step 3: Select Plan */}
          {step === 3 && (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-green-400 mb-4">Choose Your Plan</h2>
              {loading ? (
                <p className="text-gray-400">Loading plans...</p>
              ) : plans.length === 0 ? (
                <p className="text-gray-400">No plans available</p>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-6">
                    {plans.map((plan) => (
                      <div
                        key={plan.id}
                        className={`p-6 rounded-lg cursor-pointer transition transform hover:scale-105 border-2 h-full 
                        ${
                          formData.plan_id === plan.id
                            ? "border-green-500 bg-green-500 bg-opacity-20"
                            : "border-gray-700 bg-gray-800 hover:border-green-400"
                        }`}
                        onClick={() => setFormData({ ...formData, plan_id: plan.id })}
                      >
                        <h3 className="text-xl font-bold">{plan.name}</h3>
                        <p className="text-gray-400 my-2">{plan.description}</p>
                        <div className="text-3xl font-bold">
                          ${plan.price}/<span className="text-sm text-gray-400">month</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      className={`bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-white font-medium transition text-sm flex items-center justify-center gap-2 ${
                        (!formData.plan_id || submitting) ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={() => handlePlanSelect(formData.plan_id)}
                      disabled={!formData.plan_id || submitting}
                    >
                      {submitting ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Loading...
                        </>
                      ) : (
                        "Continue"
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateWorkspace;
