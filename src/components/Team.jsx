import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchWorkspaceMembers } from "../redux/currentworkspace/currentWorkspaceThunk";
import api from "../api";
import { toast } from "react-toastify";

const MAX_INVITES = 6;

const Team = () => {
  const dispatch = useDispatch();
  const { currentWorkspace, members, membersLoading, membersError } = useSelector(
    (state) => state.currentWorkspace
  );
  const [invites, setInvites] = useState([{ email: "", fullName: "", role: "" }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentWorkspace) {
      dispatch(fetchWorkspaceMembers(currentWorkspace.id));
    }
  }, [currentWorkspace, dispatch]);

  const handleAddRow = () => {
    if (invites.length >= MAX_INVITES) return;
    setInvites([...invites, { email: "", fullName: "", role: "" }]);
  };

  const handleRemoveRow = (index) => {
    setInvites(invites.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    setInvites((prev) =>
      prev.map((invite, i) => (i === index ? { ...invite, [field]: value } : invite))
    );
  };

  const handleSendInvitation = async () => {
    for (let i = 0; i < invites.length; i++) {
      const { email, fullName, role } = invites[i];
      if (!email || !fullName || !role) {
        toast.error(`Row ${i + 1} is missing required fields.`);
        return;
      }
    }

    if (!currentWorkspace) {
      toast.error("No workspace selected.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/v1/workspace/send-invites/", {
        workspace_id: currentWorkspace.id,
        invites,
      });
      toast.success("Invitations sent successfully!");
      setInvites([{ email: "", fullName: "", role: "" }]);
      dispatch(fetchWorkspaceMembers(currentWorkspace.id)); 
    } catch (error) {
      toast.error("Failed to send invitations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Team Members</h1>
      </div>

      {/* Invite New Members */}
      <div className="bg-[#1E1E24] rounded-lg p-6 mb-8 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Invite Members</h2>
        <p className="text-gray-400 mb-6">Add up to {MAX_INVITES} members.</p>
        
        {invites.map((invite, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="email"
              placeholder="Email"
              value={invite.email}
              onChange={(e) => handleChange(index, "email", e.target.value)}
              className="bg-gray-800 rounded-md px-3 py-2 border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
            />
            <input
              type="text"
              placeholder="Full Name"
              value={invite.fullName}
              onChange={(e) => handleChange(index, "fullName", e.target.value)}
              className="bg-gray-800 rounded-md px-3 py-2 border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
            />
            <div className="flex space-x-2">
              <select
                value={invite.role}
                onChange={(e) => handleChange(index, "role", e.target.value)}
                className="bg-gray-800 rounded-md px-3 py-2 border border-gray-700 flex-1 focus:border-blue-500 focus:outline-none transition-colors"
              >
                <option value="">Select role</option>
                <option value="Manager">Manager</option>
                <option value="Developer">Developer</option>
                <option value="Designer">Designer</option>
              </select>
              {invites.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveRow(index)}
                  className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label="Remove row"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
        
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handleAddRow}
            disabled={invites.length >= MAX_INVITES}
            className={`px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              invites.length >= MAX_INVITES
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Add Another
          </button>
          
          <button
            className={`px-6 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${
              loading
                ? "bg-green-700 cursor-wait"
                : "bg-green-600 hover:bg-green-700"
            }`}
            onClick={handleSendInvitation}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Invitation"}
          </button>
        </div>
      </div>

      {/* Existing Team Members List */}
      <div className="bg-[#1E1E24] rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Existing Members</h2>
        
        {membersLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : membersError ? (
          <div className="bg-red-900/30 text-red-300 p-4 rounded-md">
            <p>{membersError}</p>
          </div>
        ) : members && members.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-gray-700">
            <table className="w-full border-collapse">
              {/* Table Header */}
              <thead>
                <tr className="bg-gray-800 text-left">
                  <th className="p-3 border-b border-gray-700">Name</th>
                  <th className="p-3 border-b border-gray-700">Role</th>
                  <th className="p-3 border-b border-gray-700">Join Date</th>
                  {/* <th className="p-3 border-b border-gray-700">Status</th> */}
                  <th className="p-3 border-b border-gray-700">Action</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="border-b border-gray-700 last:border-none hover:bg-gray-800 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        {member.avatar && (
                          <img 
                            src={member.avatar} 
                            alt={`${member.user_name}'s avatar`} 
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-white">{member.user_name}</p>
                          <p className="text-gray-400 text-xs">{member.user_email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        member.role === "Admin" 
                          ? "bg-blue-600" 
                          : member.role === "Manager" 
                            ? "bg-purple-600" 
                            : "bg-gray-600"
                      }`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                      {new Date(member.joined_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                      </div>
                    </td>
                    {/* <td className="py-3 px-4">
                      {member.is_active ? (
                        <span className="text-green-400 text-sm flex items-center">
                          <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                          Active
                        </span>
                      ) : (
                        <span className="text-yellow-400 text-sm flex items-center">
                          <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                          Inactive
                        </span>
                      )}
                    </td> */}
                    <td className="py-3 px-4">
                      <button 
                        className={`text-sm px-3 py-1 rounded-md ${
                          member
                            ? "text-red-400 hover:bg-red-900/30" 
                            : "text-green-400 hover:bg-green-900/30"
                        } transition-colors`}
                      >
                        {member ? "Block" : "Unblock"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-800/50 rounded-lg p-8 text-center">
            <p className="text-gray-400">No members in this workspace.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;