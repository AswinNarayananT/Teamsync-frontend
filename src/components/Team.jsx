import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchWorkspaceMembers, removeWorkspaceMember } from "../redux/currentworkspace/currentWorkspaceThunk";
import api from "../api";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from "@mui/material";

const MAX_INVITES = 6;

const Team = () => {
  const dispatch = useDispatch();
  const { currentWorkspace, members, membersLoading, membersError } = useSelector(
    (state) => state.currentWorkspace
  );
  const { user } = useSelector((state) => state.auth); // Assuming you have current user in auth state

  const [invites, setInvites] = useState([{ email: "", fullName: "", role: "" }]);
  const [loading, setLoading] = useState(false);
  const [customRoles, setCustomRoles] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  // Check if current user is the owner
  const isOwner = React.useMemo(() => {
    if (!members || !user) return false;
    const currentUserMember = members.find(member => member.user_id === user.id || member.user_email === user.email);
    return currentUserMember?.role === "owner";
  }, [members, user]);

  // Fetch workspace data
  useEffect(() => {
    const fetchData = async () => {
      if (!currentWorkspace) return;

      dispatch(fetchWorkspaceMembers(currentWorkspace.id));

      try {
        const res = await api.get(`/api/v1/workspace/${currentWorkspace.id}/custom-roles/`);
        setCustomRoles(res.data);
      } catch (err) {
        console.error("Failed to fetch custom roles", err);
      }
    };

    fetchData();
  }, [currentWorkspace, dispatch]);

  // Update roleOptions when customRoles are fetched
  useEffect(() => {
    const defaultRoles = ["Manager", "Developer", "Designer"];
    const options = [
      ...defaultRoles.map((role) => ({ label: role, value: role })),
      ...customRoles.map((role) => ({ label: role.name, value: role.name })),
    ];
    setRoleOptions(options);
  }, [customRoles]);

  // Set default role for existing invites if missing
  useEffect(() => {
    if (roleOptions.length > 0) {
      setInvites((prevInvites) =>
        prevInvites.map((invite) =>
          invite.role ? invite : { ...invite, role: roleOptions[0].value }
        )
      );
    }
  }, [roleOptions]);

  const handleAddRow = () => {
    if (invites.length >= MAX_INVITES) return;
    setInvites([
      ...invites,
      { email: "", fullName: "", role: roleOptions[0]?.value || "" },
    ]);
  };

  const handleRemoveRow = (index) => {
    setInvites(invites.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    setInvites((prev) =>
      prev.map((invite, i) =>
        i === index ? { ...invite, [field]: value } : invite
      )
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
      setInvites([{ email: "", fullName: "", role: roleOptions[0]?.value || "" }]);
      dispatch(fetchWorkspaceMembers(currentWorkspace.id));
    } catch (error) {
      const message =
        error?.response?.data?.error ||
        "Failed to send invitations. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (userId) => {
    if (!currentWorkspace) return;
  
    try {
      // Dispatching removeWorkspaceMember and awaiting its result
      await dispatch(removeWorkspaceMember({ workspaceId: currentWorkspace.id, userId })).unwrap();
      toast.success("Member removed successfully");
    } catch (error) {
      toast.error(error || "Failed to remove member.");
    }
  };
  
  const roleColors = {
    owner: "bg-blue-600",
    manager: "bg-purple-600",
    developer: "bg-green-600",
    designer: "bg-pink-600",
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Team Members</h1>
      </div>

      {/* Invite New Members - Only show for owners */}
      {isOwner && (
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
                  value={invite.role || roleOptions[0]?.value || ""}
                  onChange={(e) => handleChange(index, "role", e.target.value)}
                  className="bg-gray-800 rounded-md px-3 py-2 border border-gray-700 flex-1 focus:border-blue-500 focus:outline-none transition-colors"
                >
                  {roleOptions.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
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
      )}


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
                  { isOwner && <th className="p-3 border-b border-gray-700">Action</th>}
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
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          roleColors[member.role] || "bg-gray-600"
                        }`}
                      >
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
                  {isOwner && (
                      <td className="py-3 px-4">
                        {member.role !== "owner" ? (
                          <button 
                            onClick={() => {
                              setSelectedMemberId(member.id);
                              setOpenDialog(true);
                            }}
                            className="text-sm text-red-500 hover:text-red-400 bg-transparent hover:bg-red-500/10 px-3 py-1 rounded-md transition-colors"
                          >
                            Remove
                          </button>
                        ) : (
                          <span className="text-gray-500 text-sm">—</span>
                        )}
                      </td>
                    )}
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

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Confirm Removal</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove this member from the workspace?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleRemove(selectedMemberId);
              setOpenDialog(false);
            }}
            color="error"
            variant="contained"
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Team;