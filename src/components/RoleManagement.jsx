import React, { useState, useEffect } from "react";
import api from "../api";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const defaultRoles = [
  {
    name: "Manager",
    permissions: ["Create Epic", "Create Issue", "Change Status"],
  },
  {
    name: "Developer",
    permissions: ["Change Status (assigned only)"],
  },
  {
    name: "Designer",
    permissions: ["Change Status (assigned only)"],
  },
];

const allPermissions = [
  "Create Epic",
  "Create Issue",
  "Change Status",
  "Assign Issue",
  "Delete Epic",
];

const RoleManagementModal = ({ open, onClose }) => {
  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [customRoles, setCustomRoles] = useState([]);
  const [editingRole, setEditingRole] = useState(null);

  const { workspaces } = useSelector((state) => state.workspace);
  const ownedWorkspace = workspaces.find((ws) => ws.role === "owner");

  useEffect(() => {
    const fetchCustomRoles = async () => {
      if (!ownedWorkspace) return;
      try {
        const res = await api.get(`/api/v1/workspace/${ownedWorkspace.id}/custom-roles/`);
        setCustomRoles(res.data);
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };

    if (open) {
      fetchCustomRoles();
      setEditingRole(null);
      setRoleName("");
      setSelectedPermissions([]);
    }
  }, [open, ownedWorkspace]);

  const handlePermissionChange = (perm) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm)
        ? prev.filter((p) => p !== perm)
        : [...prev, perm]
    );
  };

  const isAlpha = (str) => /^[A-Za-z\s]+$/.test(str.trim());
  const isValid = isAlpha(roleName) && selectedPermissions.length > 0;

  const handleSaveRole = async () => {
    if (!isValid) return;

    if (!ownedWorkspace) {
      toast("You have no owned workspace");
      return;
    }

    const payload = {
      name: roleName,
      permissions: selectedPermissions,
    };

    try {
      if (editingRole) {
        const res = await api.put(
          `/api/v1/workspace/${ownedWorkspace.id}/roles/${editingRole.id}/`,
          payload
        );
        setCustomRoles((prev) =>
          prev.map((role) => (role.id === editingRole.id ? res.data : role))
        );
        toast("Role updated!");
      } else {
        const res = await api.post(
          `/api/v1/workspace/${ownedWorkspace.id}/create-role/`,
          payload
        );
        console.log("Created role:", res.data);
        setCustomRoles((prev) => [...prev, res.data]);
        toast("Role created!");
      }

      setRoleName("");
      setSelectedPermissions([]);
      setEditingRole(null);
    } catch (err) {
      console.error("Error saving role:", err.response?.data || err.message);
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (!ownedWorkspace) {
      toast("You have no owned workspace");
      return;
    }
  
    try {
      await api.delete(`/api/v1/workspace/${ownedWorkspace.id}/roles/${roleId}/`);
      toast.success("Role deleted successfully");
      // Refresh roles list (fetch again or filter out the deleted role)
      setCustomRoles((prev) => prev.filter((r) => r.id !== roleId));
    } catch (error) {
      console.error("Error deleting role:", error.response?.data || error.message);
      toast.error("Failed to delete role");
    }
  };

  const startEditing = (role) => {
    setEditingRole(role);
    setRoleName(role.name);
    setSelectedPermissions(role.permissions);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#1f1f1f] text-white rounded-2xl shadow-2xl w-full max-w-3xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Manage Roles & Permissions</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>

        <div className="space-y-8">

          {/* Default Roles Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-200">Default Roles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {defaultRoles.map((role, index) => (
                <div key={index} className="bg-[#2c2c2c] p-4 rounded-lg shadow-sm">
                  <p className="font-semibold text-white mb-1">{role.name}</p>
                  <ul className="text-sm text-gray-400 list-disc list-inside space-y-1">
                    {role.permissions.map((perm, i) => (
                      <li key={i}>{perm}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Roles Section */}
          {Array.isArray(customRoles) && customRoles.length > 0 && (
  <div>
    <h3 className="text-lg font-semibold mb-2 text-gray-200">Custom Roles</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {customRoles.map((role, index) => (
        <div key={index} className="bg-[#2c2c2c] p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <p className="font-semibold text-white">{role.name}</p>
            <div className="space-x-2">
              <button
                onClick={() => startEditing(role)}
                className="text-sm text-indigo-400 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteRole(role.id)}
                className="text-sm text-red-400 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
          <ul className="text-sm text-gray-400 list-disc list-inside space-y-1">
  {(role.permissions || []).map((perm, i) => (
    <li key={i}>{perm}</li>
  ))}
</ul>
        </div>
      ))}
    </div>
  </div>
)}

          {/* Add/Edit Role Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-200">
              {editingRole ? "Edit Role" : "Create a New Role"}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter Role Name"
                className={`w-full px-4 py-3 rounded-lg bg-[#2b2b2b] text-white border ${
                  roleName && !isAlpha(roleName) ? "border-red-500" : "border-gray-700"
                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
              />

              <div>
                <p className="text-sm text-gray-300 mb-2">Assign Permissions</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {allPermissions.map((perm) => (
                    <label key={perm} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(perm)}
                        onChange={() => handlePermissionChange(perm)}
                        className="accent-indigo-600 w-4 h-4"
                      />
                      <span className="text-sm text-gray-300">{perm}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
                <button
                  onClick={() => {
                    setEditingRole(null);
                    setRoleName("");
                    setSelectedPermissions([]);
                  }}
                  disabled={!isValid}
                  className={`px-5 py-2 rounded-lg text-sm font-medium ${
                    isValid
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "bg-gray-600 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveRole}
                  disabled={!isValid}
                  className={`px-5 py-2 rounded-lg text-sm font-medium ${
                    isValid
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "bg-gray-600 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  {editingRole ? "Update Role" : "Add Role"}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RoleManagementModal;
