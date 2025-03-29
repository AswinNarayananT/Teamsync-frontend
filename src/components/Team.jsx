import React, { useState } from "react";
import { useSelector } from "react-redux";

const MAX_INVITES = 6;

const Team = () => {
  const { currentWorkspace } = useSelector((state) => state.workspace);


  const [invites, setInvites] = useState([
    { email: "", fullName: "", role: "" },
  ]);


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


  const handleSendInvitation = () => {

    for (let i = 0; i < invites.length; i++) {
      const { email, fullName, role } = invites[i];
      if (!email || !fullName || !role) {
        alert(`Row ${i + 1} is missing required fields.`);
        return;
      }
    }

    const invitesSummary = invites.map(
      (inv, idx) => `${idx + 1}. ${inv.email} / ${inv.fullName} / ${inv.role}`
    );
    alert(
      `Invitations sent for:\n${invitesSummary.join("\n")}\n\nWorkspace: ${
        currentWorkspace?.name || "N/A"
      }`
    );
    setInvites([{ email: "", fullName: "", role: "" }]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Breadcrumb & Title */}
      <div className="mb-6">
        <nav className="text-sm text-gray-400 mb-2">
          <span className="mr-2">{currentWorkspace?.name || "Workspace"}</span>
          <span className="text-gray-600">/</span>
          <span className="ml-2">
            {currentWorkspace?.description || "Add Team"}
          </span>
        </nav>
        <h1 className="text-3xl font-bold">Add Team</h1>
      </div>

      {/* Invitation Form */}
      <div className="bg-[#1E1E24] rounded-lg p-6 mb-6">
        <p className="text-gray-400 mb-4">
          Add up to {MAX_INVITES} members at once.
        </p>

        {invites.map((invite, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Email Address */}
            <div className="flex flex-col">
              <label className="text-gray-400 text-sm mb-1">Email Address</label>
              <input
                type="email"
                className="bg-gray-800 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter email address"
                value={invite.email}
                onChange={(e) => handleChange(index, "email", e.target.value)}
              />
            </div>
            {/* Full Name */}
            <div className="flex flex-col">
              <label className="text-gray-400 text-sm mb-1">Full Name</label>
              <input
                type="text"
                className="bg-gray-800 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter full name"
                value={invite.fullName}
                onChange={(e) => handleChange(index, "fullName", e.target.value)}
              />
            </div>
            {/* Role + Remove Button */}
            <div className="flex flex-col">
              <label className="text-gray-400 text-sm mb-1">Role</label>
              <div className="flex space-x-2">
                <select
                  className="bg-gray-800 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 flex-1"
                  value={invite.role}
                  onChange={(e) => handleChange(index, "role", e.target.value)}
                >
                  <option value="">Select role</option>
                  <option value="Manager">Manager</option>
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                </select>
                {/* Remove button (only if more than one row) */}
                {invites.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(index)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Add Another Button */}
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={handleAddRow}
            disabled={invites.length >= MAX_INVITES}
            className={`bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium ${
              invites.length >= MAX_INVITES ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Add Another
          </button>
        </div>

        {/* Send Invitation */}
        <div className="flex justify-end">
          <button
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium"
            onClick={handleSendInvitation}
          >
            Send Invitation
          </button>
        </div>
      </div>

      {/* Team Members Table */}
      <div className="bg-[#1E1E24] rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Team Members</h2>
        {/* Search & Roles Filter Row */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-4">
          <div className="flex items-center space-x-2 mb-2 md:mb-0">
            <input
              type="text"
              placeholder="Search members"
              className="bg-gray-800 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
          </div>
          <div>
            <select className="bg-gray-800 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm">
              <option>All Roles</option>
              <option>Manager</option>
              <option>Developer</option>
              <option>Designer</option>
            </select>
          </div>
        </div>

        {/* Members Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-700">
              <tr>
                <th className="py-3 px-4 text-left text-gray-300 font-normal">Member</th>
                <th className="py-3 px-4 text-left text-gray-300 font-normal">Role</th>
                <th className="py-3 px-4 text-left text-gray-300 font-normal">Projects</th>
                <th className="py-3 px-4 text-left text-gray-300 font-normal">Status</th>
                <th className="py-3 px-4 text-right text-gray-300 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* For now, this is empty. Replace with your real team data or map over an array. */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Team;
