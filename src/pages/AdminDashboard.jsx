import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchPlanStats } from "../redux/plan/plansThunks";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#AF19FF"];

const styles = {
  page: {
    backgroundColor: "#121212",
    color: "#e0e0e0",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "Segoe UI, sans-serif",
  },
  header: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#bb86fc",
  },
  revenueContainer: {
    display: "flex",
    gap: "20px",
    marginBottom: "30px",
    flexWrap: "wrap",
  },
  revenueBox: {
    flex: "1",
    minWidth: "200px",
    padding: "20px",
    backgroundColor: "#1f1f1f",
    borderRadius: "12px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.4)",
    textAlign: "center",
  },
  revenueLabel: {
    fontSize: "1.1rem",
    marginBottom: "10px",
    color: "#aaaaaa",
  },
  revenueValue: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#03dac6",
  },
  planGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  },
  planCard: {
    backgroundColor: "#1e1e1e",
    padding: "16px",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
  },
  planTitle: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#bb86fc",
  },
  chartSection: {
    display: "flex",
    gap: "30px",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  chartBox: {
    backgroundColor: "#1f1f1f",
    borderRadius: "12px",
    padding: "20px",
    width: "100%",
    maxWidth: "600px",
    height: "350px",
    marginBottom: "40px",
  },
};

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(fetchPlanStats())
      .unwrap()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.toString());
        setLoading(false);
      });
  }, [dispatch]);

  if (loading) return <p style={styles.page}>Loading dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!stats || stats.length === 0) return <p>No data found</p>;

  // Total revenue
  const totalRevenue = stats.reduce((sum, plan) => sum + (plan.total_revenue ?? 0), 0);
  const monthlyRevenue = stats.reduce((sum, plan) => sum + (plan.monthly_revenue ?? 0), 0);
  const weeklyRevenue = stats.reduce((sum, plan) => sum + (plan.weekly_revenue ?? 0), 0);

  const pieData = stats.map((plan, idx) => ({
    name: plan.name,
    value: plan.active_subscriptions ?? 0,
    color: COLORS[idx % COLORS.length],
  }));

  const barData = stats.map((plan) => ({
    name: plan.name,
    Monthly: plan.monthly_revenue ?? 0,
    Weekly: plan.weekly_revenue ?? 0,
    Yearly: plan.yearly_revenue ?? 0,
  }));

  return (
    <div style={styles.page}>
      <h1 style={styles.header}>📊 Admin Dashboard</h1>

      {/* Revenue Overview */}
      <div style={styles.revenueContainer}>
        <div style={styles.revenueBox}>
          <div style={styles.revenueLabel}>Total Revenue</div>
          <div style={styles.revenueValue}>${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        </div>
        <div style={styles.revenueBox}>
          <div style={styles.revenueLabel}>Monthly Revenue</div>
          <div style={styles.revenueValue}>${monthlyRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        </div>
        <div style={styles.revenueBox}>
          <div style={styles.revenueLabel}>Weekly Revenue</div>
          <div style={styles.revenueValue}>${weeklyRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        </div>
      </div>

      {/* Plan Details */}
      <div style={styles.planGrid}>
        {stats.map((plan) => (
          <div key={plan.id} style={styles.planCard}>
            <div style={styles.planTitle}>{plan.name}</div>
            <div>💼 Active Workspaces: {plan.active_workspaces}</div>
            <div>🚫 Blocked: {plan.blocked_workspaces}</div>
            <div>⏳ Expired: {plan.expired_workspaces}</div>
            <div>📈 Active Subs: {plan.active_subscriptions}</div>
            <div>💵 Revenue: ${plan.total_revenue.toFixed(2)}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={styles.chartSection}>
        <div style={styles.chartBox}>
          <h3 style={{ color: "#bb86fc", marginBottom: 10 }}>🧾 Active Subscriptions (Pie)</h3>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#222", borderColor: "#444" }}
                itemStyle={{ color: "#eee" }}
              />
              <Legend wrapperStyle={{ color: "#eee" }} iconType="circle" iconSize={10} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.chartBox}>
          <h3 style={{ color: "#bb86fc", marginBottom: 10 }}>💰 Revenue by Plan</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#bbb" tick={{ fill: "#ccc" }} />
              <YAxis stroke="#bbb" tick={{ fill: "#ccc" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#222", borderColor: "#444" }}
                itemStyle={{ color: "#eee" }}
              />
              <Legend wrapperStyle={{ color: "#eee" }} />
              <Bar dataKey="Monthly" fill="#8884d8" />
              <Bar dataKey="Weekly" fill="#00C49F" />
              <Bar dataKey="Yearly" fill="#FFBB28" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
