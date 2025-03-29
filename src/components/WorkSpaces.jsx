import React, { useState, useEffect } from "react";
import api from "../api"; // Axios instance with auth headers

const WorkSpaces = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await api.get("/api/v1/adminpanel/workspaces/");
        setWorkspaces(response.data);
      } catch (err) {
        setError("Failed to fetch workspaces");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, []);

  if (loading) return <p className="text-white">Loading workspaces...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="h-screen flex flex-col items-center bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">All Workspaces</h1>

      {workspaces.length === 0 ? (
        <p className="text-gray-400">No workspaces found</p>
      ) : (
        <div className="w-full max-w-4xl">
          <table className="w-full border border-gray-700 rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-3 border border-gray-700">#</th>
                <th className="p-3 border border-gray-700 text-left">Name</th>
                <th className="p-3 border border-gray-700 text-left">Description</th>
                <th className="p-3 border border-gray-700">Created On</th>
              </tr>
            </thead>
            <tbody>
              {workspaces.map((workspace, index) => (
                <tr key={workspace.id} className="bg-gray-700 hover:bg-gray-600 transition">
                  <td className="p-3 border border-gray-700 text-center">{index + 1}</td>
                  <td className="p-3 border border-gray-700">{workspace.name}</td>
                  <td className="p-3 border border-gray-700">{workspace.description}</td>
                  <td className="p-3 border border-gray-700 text-center">
                    {new Date(workspace.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WorkSpaces;
