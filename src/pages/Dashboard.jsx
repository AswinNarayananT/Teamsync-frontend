import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProjectDetails } from "../redux/auth/authThunks";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  Activity,
  Flag
} from "lucide-react";

const STATUS_COLORS = {
  todo: "#6B7280",
  in_progress: "#F59E0B",
  review: "#3B82F6",
  done: "#10B981",
};

const CHART_COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

const Dashboard = () => {
  const dispatch = useDispatch();
  const { currentProject } = useSelector((state) => state.currentWorkspace);

  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(false);

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
    if (currentProject?.id) {
      loadProjectDetails(currentProject.id);
    } else {
      setProjectData(null);
    }
  }, [currentProject]);

  const formatChartData = (data) =>
    Object.entries(data || {}).map(([key, value]) => ({
      name: key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
      value,
      count: value,
    }));

  const calculateProjectProgress = () => {
    if (!projectData) return 0;
    const issuesWithoutEpics = projectData.issue_counts_by_status || {};
    const total = Object.entries(issuesWithoutEpics).reduce(
      (acc, [key, val]) => acc + (key !== "epic" ? val : 0),
      0
    );
    const completed = issuesWithoutEpics.done || 0;
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  const getProjectStats = () => {
    if (!projectData) return {};
    
    const statusCounts = projectData.issue_counts_by_status || {};
    const typeCounts = projectData.issue_counts_by_type || {};
    
    const totalIssues = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
    const completedIssues = statusCounts.done || 0;
    const inProgressIssues = statusCounts.in_progress || 0;
    const todoIssues = statusCounts.todo || 0;
    const reviewIssues = statusCounts.review || 0;
    
    return {
      totalIssues,
      completedIssues,
      inProgressIssues,
      todoIssues,
      reviewIssues,
      completionRate: totalIssues > 0 ? Math.round((completedIssues / totalIssues) * 100) : 0,
      totalEpics: projectData.epics?.length || 0
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "bg-gradient-to-r from-blue-600 to-blue-500" }) => (
    <div className={`${color} p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-blue-100 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-blue-100 text-xs mt-1">{subtitle}</p>}
        </div>
        <Icon className="w-10 h-10 text-blue-200" />
      </div>
    </div>
  );

  if (!currentProject) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-400">
        <BarChart3 className="w-20 h-20 mb-4 text-gray-600" />
        <p className="text-xl font-medium">No project selected</p>
        <p className="text-sm mt-2">Select a project to view analytics</p>
      </div>
    );
  }

  const stats = getProjectStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 p-8 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                📊 Project Analytics
              </h1>
              <p className="text-blue-200 text-lg">{currentProject.name}</p>
            </div>
            <div className="text-right">
              <p className="text-blue-200 text-sm">Last Updated</p>
              <p className="text-white font-medium">{format(new Date(), "MMM dd, yyyy 'at' HH:mm")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="ml-4 text-gray-400">Loading project analytics...</p>
          </div>
        )}

        {projectData && (
          <>
            {/* Project Info Card */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-2xl shadow-xl mb-8 border border-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                    Project Timeline
                  </h3>
                  <p className="text-gray-300">Start: {formatDate(projectData.start_date)}</p>
                  <p className="text-gray-300">End: {formatDate(projectData.end_date)}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-green-400" />
                    Status
                  </h3>
                  <p className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    projectData.is_completed 
                      ? 'bg-green-900 text-green-200' 
                      : 'bg-blue-900 text-blue-200'
                  }`}>
                    {projectData.is_completed ? 'Completed' : 'In Progress'}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-purple-400" />
                    Description
                  </h3>
                  <p className="text-gray-300 text-sm">
                    {projectData.description || "No description available"}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={Target}
                title="Total Issues"
                value={stats.totalIssues}
                color="bg-gradient-to-r from-purple-600 to-purple-500"
              />
              <StatCard
                icon={CheckCircle}
                title="Completed"
                value={stats.completedIssues}
                subtitle={`${stats.completionRate}% completion rate`}
                color="bg-gradient-to-r from-green-600 to-green-500"
              />
              <StatCard
                icon={Clock}
                title="In Progress"
                value={stats.inProgressIssues}
                color="bg-gradient-to-r from-yellow-600 to-orange-500"
              />
              <StatCard
                icon={Flag}
                title="Total Epics"
                value={stats.totalEpics}
                color="bg-gradient-to-r from-indigo-600 to-indigo-500"
              />
            </div>

            {/* Progress Bar */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-6 rounded-2xl shadow-xl mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Overall Progress</h2>
                <span className="text-2xl font-bold text-white">{calculateProjectProgress()}%</span>
              </div>
              <div className="w-full bg-green-800 rounded-full h-6 shadow-inner">
                <div
                  className="bg-gradient-to-r from-white to-green-100 h-6 rounded-full shadow-lg transition-all duration-1000 ease-out"
                  style={{ width: `${calculateProjectProgress()}%` }}
                />
              </div>
              <p className="mt-3 text-green-100 text-lg">
                {stats.completedIssues} of {stats.totalIssues} issues completed
              </p>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
              {/* Issues by Type Chart */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-2xl shadow-xl border border-gray-600">
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <BarChart3 className="w-6 h-6 mr-3 text-blue-400" />
                  Issues by Type
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={formatChartData(projectData.issue_counts_by_type)}>
                    <XAxis 
                      dataKey="name" 
                      stroke="#9CA3AF" 
                      fontSize={12}
                      tick={{ fill: '#9CA3AF' }}
                    />
                    <YAxis 
                      stroke="#9CA3AF" 
                      fontSize={12}
                      tick={{ fill: '#9CA3AF' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="url(#colorGradient)"
                      radius={[4, 4, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#3B82F6" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Issues by Status Pie Chart */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-2xl shadow-xl border border-gray-600">
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <BarChart3 className="w-6 h-6 mr-3 text-green-400" />
                  Issues by Status
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={formatChartData(projectData.issue_counts_by_status)}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={40}
                      paddingAngle={5}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {formatChartData(projectData.issue_counts_by_status).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ color: '#9CA3AF' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Epics Section */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-2xl shadow-xl border border-gray-600">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <Flag className="w-6 h-6 mr-3 text-purple-400" />
                Epics Overview
              </h3>
              
              {projectData.epics && projectData.epics.length > 0 ? (
                <div className="space-y-6">
                  {projectData.epics.map((epic, index) => (
                    <div key={epic.id} className="bg-gradient-to-r from-gray-700 to-gray-600 p-6 rounded-xl border border-gray-500 hover:border-purple-400 transition-all duration-300">
                      {/* Epic Header */}
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-bold text-white">{epic.title}</h4>
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            epic.status === 'done' ? 'bg-green-900 text-green-200' :
                            epic.status === 'in_progress' ? 'bg-yellow-900 text-yellow-200' :
                            epic.status === 'review' ? 'bg-blue-900 text-blue-200' :
                            'bg-gray-600 text-gray-200'
                          }`}>
                            {epic.status?.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="text-2xl font-bold text-purple-400">
                            {epic.progress?.percentage || 0}%
                          </span>
                        </div>
                      </div>

                      {/* Epic Timeline */}
                      <div className="flex items-center space-x-6 mb-4 text-sm text-gray-300">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Start: {formatDate(epic.start_date)}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          End: {formatDate(epic.end_date)}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-300">Progress</span>
                          <span className="text-sm text-gray-300">
                            {epic.progress?.completed || 0} / {epic.progress?.total || 0} issues
                          </span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${epic.progress?.percentage || 0}%` }}
                          />
                        </div>
                      </div>

                      {/* Issues List */}
                      {epic.issues && epic.issues.length > 0 ? (
                        <div className="space-y-3">
                          <h5 className="font-semibold text-gray-200 border-b border-gray-600 pb-2">
                            Issues ({epic.issues.length})
                          </h5>
                          <div className="grid gap-3">
                            {epic.issues.map((issue) => (
                              <div
                                key={issue.id}
                                className="flex items-center justify-between bg-gray-600 p-4 rounded-lg hover:bg-gray-500 transition-colors"
                              >
                                <div className="flex-1">
                                  <p className="font-medium text-white mb-1">{issue.title}</p>
                                  <div className="flex items-center space-x-4 text-xs text-gray-300">
                                    <span className="capitalize">Type: {issue.type}</span>
                                    {issue.start_date && (
                                      <span>Start: {formatDate(issue.start_date)}</span>
                                    )}
                                    {issue.end_date && (
                                      <span>End: {formatDate(issue.end_date)}</span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  {issue.is_completed && (
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                  )}
                                  <span
                                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                                    style={{ backgroundColor: STATUS_COLORS[issue.status] || '#6B7280' }}
                                  >
                                    {issue.status?.replace('_', ' ').toUpperCase()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-400">
                          <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>No issues assigned to this epic yet</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <Flag className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No epics found in this project</p>
                  <p className="text-sm mt-2">Create epics to organize your project better</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;