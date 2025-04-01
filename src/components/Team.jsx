import React, { useState } from "react";
import { useSelector } from "react-redux";
import api from "../api";
import { toast } from "react-toastify";

const MAX_INVITES = 6;

const Team = () => {
  const { currentWorkspace } = useSelector((state) => state.workspace);
  const [invites, setInvites] = useState([{ email: "", fullName: "", role: "" }]);
  const [loading, setLoading] = useState(false);

  const handleAddRow = () => {
    if (invites.length >= MAX_INVITES) return;
    setInvites([...invites, { email: "", fullName: "", role: "" }]);
  };

  const handleRemoveRow = (index) => {
    const updated = [...invites];
    updated.splice(index, 1);
    setInvites(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = [...invites];
    updated[index][field] = value;
    setInvites(updated);
  };

  const handleSendInvitation = async () => {
    for (let i = 0; i < invites.length; i++) {
      const { email, fullName, role } = invites[i];
      if (!email || !fullName || !role) {
        alert(`Row ${i + 1} is missing required fields.`);
        return;
      }
    }

    if (!currentWorkspace) {
      alert("No workspace selected.");
      return;
    }

    setLoading(true);
    try {
      console.log(currentWorkspace.id)
      const response = await api.post("/api/v1/workspace/send-invites/", {
        workspace_id: currentWorkspace.id,
        invites,
      });
      toast.success("Invitations sent successfully!");
      setInvites([{ email: "", fullName: "", role: "" }]);
    } catch (error) {
      toast.error("Failed to send invitations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Add Team</h1>
      </div>

      <div className="bg-[#1E1E24] rounded-lg p-6 mb-6">
        <p className="text-gray-400 mb-4">Add up to {MAX_INVITES} members.</p>
        {invites.map((invite, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="email"
              placeholder="Email"
              value={invite.email}
              onChange={(e) => handleChange(index, "email", e.target.value)}
              className="bg-gray-800 rounded-md px-3 py-2"
            />
            <input
              type="text"
              placeholder="Full Name"
              value={invite.fullName}
              onChange={(e) => handleChange(index, "fullName", e.target.value)}
              className="bg-gray-800 rounded-md px-3 py-2"
            />
            <div className="flex space-x-2">
              <select
                value={invite.role}
                onChange={(e) => handleChange(index, "role", e.target.value)}
                className="bg-gray-800 rounded-md px-3 py-2 flex-1"
              >
                <option value="">Select role</option>
                <option value="Manager">Manager</option>
                <option value="Developer">Developer</option>
              </select>
              {invites.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveRow(index)}
                  className="bg-red-600 px-3 py-2 rounded-md"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={handleAddRow}
            disabled={invites.length >= MAX_INVITES}
            className="bg-blue-600 px-4 py-2 rounded-md"
          >
            Add Another
          </button>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-green-600 px-4 py-2 rounded-md"
            onClick={handleSendInvitation}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Invitation"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Team;
