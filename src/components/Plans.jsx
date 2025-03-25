import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPlans, createPlan, editPlan, removePlan } from "../redux/plan/plansActions";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";

const Plans = () => {
  const dispatch = useDispatch();
  const { plans, loading, error } = useSelector((state) => state.plans);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", price: "", duration_days: 30 });
  const [editMode, setEditMode] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [deletePlanId, setDeletePlanId] = useState(null); // ✅ Store the plan ID to delete
  const [openConfirm, setOpenConfirm] = useState(false); // ✅ Control delete confirmation dialog

  // ✅ Fetch Plans on Load
  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  // ✅ Handle Form Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Create / Edit Plan Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      dispatch(editPlan(editingPlanId, formData));
    } else {
      dispatch(createPlan(formData));
    }
    setShowModal(false);
    resetForm();
  };

  // ✅ Handle Edit Plan
  const handleEdit = (plan) => {
    setFormData(plan);
    setEditingPlanId(plan.id);
    setEditMode(true);
    setShowModal(true);
  };

  // ✅ Handle Delete Plan
  const confirmDelete = (planId) => {
    setDeletePlanId(planId);
    setOpenConfirm(true);
  };

  const handleDelete = () => {
    if (deletePlanId) {
      dispatch(removePlan(deletePlanId));
      setOpenConfirm(false);
    }
  };

  // ✅ Reset Form
  const resetForm = () => {
    setFormData({ name: "", description: "", price: "", duration_days: 30 });
    setEditMode(false);
    setEditingPlanId(null);
  };

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Subscription Plans</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          + Add Plan
        </button>
      </div>

      {loading && <p className="text-yellow-500">Loading plans...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* ✅ List Plans */}
      <div className="bg-[#1e1e24] p-4 rounded-lg">
        {plans.length === 0 ? (
          <p>No plans available.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="py-2">Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.id} className="border-b border-gray-600">
                  <td className="py-2">{plan.name}</td>
                  <td>{plan.description}</td>
                  <td>${plan.price}</td>
                  <td>{plan.duration_days} days</td>
                  <td>
                    <button className="text-blue-400 mr-2" onClick={() => handleEdit(plan)}>
                      Edit
                    </button>
                    <button className="text-red-400" onClick={() => confirmDelete(plan.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ✅ Modal for Creating/Editing Plans */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#1e1e24] p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">{editMode ? "Edit Plan" : "Create New Plan"}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Plan Name"
                required
                className="w-full p-2 mb-3 bg-gray-800 text-white rounded-md"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full p-2 mb-3 bg-gray-800 text-white rounded-md"
              />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price ($)"
                required
                className="w-full p-2 mb-3 bg-gray-800 text-white rounded-md"
              />
              <select
                name="duration_days"
                value={formData.duration_days}
                onChange={handleChange}
                className="w-full p-2 mb-3 bg-gray-800 text-white rounded-md"
              >
                <option value={30}>Monthly (30 days)</option>
                <option value={90}>Quarterly (90 days)</option>
                <option value={180}>Semi-Annual (180 days)</option>
                <option value={365}>Yearly (365 days)</option>
              </select>
              <div className="flex justify-between">
                <button type="button" className="bg-gray-600 px-4 py-2 rounded-md" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md">
                  {editMode ? "Update Plan" : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Material UI Delete Confirmation Dialog */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Delete Plan</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this plan?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Plans;
