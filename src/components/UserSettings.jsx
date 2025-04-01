import React from "react";
import { useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";

const UserSettings = () => {
  const { user } = useSelector((state) => state.auth);
  const { workspaces } = useSelector((state) => state.workspace);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white shadow-xl rounded-lg">
      {/* Profile Section */}
      <div className="flex items-center space-x-6 p-6 border-b border-gray-700">
        {user?.profilePicture ? (
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-20 h-20 rounded-full border-2 border-gray-500"
          />
        ) : (
          <FaUserCircle className="w-20 h-20 text-gray-500" />
        )}
        <div>
          <h2 className="text-2xl font-bold">{user?.first_name} {user?.last_name}</h2>
          <p className="text-gray-400">{user?.email}</p>
          {user?.is_superuser && <span className="text-sm text-green-400">Admin</span>}
        </div>
      </div>

      {/* Workspace Section */}
      {workspaces.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Owned Workspaces</h3>
          <div className="grid gap-4">
            {workspaces.map((ws) => (
              <div key={ws.id} className="p-4 bg-gray-800 rounded-lg shadow-lg">
                <h4 className="text-lg font-semibold">{ws.name}</h4>
                <p className="text-gray-400">Type: {ws.workspace_type}</p>
                <p className="text-gray-400">Description: {ws.description}</p>
                {ws.plan && (
                  <span className="text-sm text-blue-400">Plan: {ws.plan.name}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSettings;