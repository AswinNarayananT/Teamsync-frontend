import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProjectDetails } from "../redux/auth/authThunks";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { toast } from "react-toastify";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f"];

const Dashboard = () => {
  const dispatch = useDispatch();
  const { projects, currentWorkspace, currentProject } = useSelector(
    (state) => state.currentWorkspace
  );

  const [selectedProject, setSelectedProject] = useState(currentProject?.id || null);
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleProjectChange = async (e) => {
    const projectId = e.target.value;
    setSelectedProject(projectId);
    await loadProjectDetails(projectId);
  };

  const loadProjectDetails = async (projectId) => {
    try {
      setLoading(true);
      const resultAction = await dispatch(fetchProjectDetails(projectId));
      if (fetchProjectDetails.fulfilled.match(resultAction)) {
        setProjectData(resultAction.payload);
      } else {
        toast.error("Failed to load project details");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProject) {
      loadProjectDetails(selectedProject);
    }
  }, [selectedProject]);

  const formatBarData = (data) =>
    Object.entries(data || {}).map(([key, value]) => ({
      name: key.replace("_", " "),
      count: value,
    }));

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Welcome to the User Dashboard</h1>

      <div className="mb-6">
        <label className="mr-2 text-lg">Select Project:</label>
        <select
          value={selectedProject || ""}
          onChange={handleProjectChange}
          className="bg-gray-800 text-white px-3 py-2 rounded"
        >
          <option value="" disabled>Select a project</option>
          {projects?.map((proj) => (
            <option key={proj.id} value={proj.id}>
              {proj.name}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-gray-400">Loading project data...</p>}

      {projectData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          {/* Issue Types */}
          <div className="bg-gray-800 p-4 rounded shadow">
            <h2 className="text-xl mb-4">Issues by Type</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={formatBarData(projectData.issue_counts_by_type)}>
                <XAxis dataKey="name" stroke="#ffffff" />
                <YAxis stroke="#ffffff" />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Issue Status */}
          <div className="bg-gray-800 p-4 rounded shadow">
            <h2 className="text-xl mb-4">Issues by Status</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={formatBarData(projectData.issue_counts_by_status)}
                  dataKey="count"
                  nameKey="name"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {formatBarData(projectData.issue_counts_by_status).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Epic Progress */}
          <div className="md:col-span-2">
            <h2 className="text-xl mb-4">Epic Progress</h2>
            {projectData.epics.length > 0 ? (
              projectData.epics.map((epic) => (
                <div key={epic.id} className="bg-gray-800 p-4 mb-4 rounded shadow">
                  <h3 className="text-lg font-semibold mb-2">{epic.title}</h3>
                  <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
                    <div
                      className="bg-green-500 h-4 rounded-full"
                      style={{ width: `${epic.progress.percentage}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-300">
                    {epic.progress.completed}/{epic.progress.total} issues completed
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No epics found in this project.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
