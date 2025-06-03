import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchPlanStats } from "../redux/plan/plansThunks";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

const darkStyles = {
  page: {
    padding: 20,
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#121212",
    color: "#e0e0e0",
    minHeight: "100vh",
  },
  table: {
    width: "100%",
    marginBottom: 40,
    borderCollapse: "collapse",
  },
  th: {
    borderBottom: "2px solid #444",
    padding: "8px",
    textAlign: "left",
    backgroundColor: "#1e1e1e",
    color: "#bb86fc",
  },
  td: {
    borderBottom: "1px solid #333",
    padding: "8px",
  },
  trHover: {
    backgroundColor: "#2a2a2a",
  },
  heading1: {
    color: "#bb86fc",
  },
  heading2: {
    color: "#bb86fc",
    marginTop: 40,
    marginBottom: 10,
  },
  heading3: {
    color: "#bb86fc",
    marginBottom: 10,
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

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!stats || stats.length === 0) return <p>No data found</p>;

  // Prepare bar chart data (monthly, weekly, yearly revenue)
  const barData = stats.map((plan) => ({
    name: plan.name,
    Monthly: plan.monthly_revenue ?? 0,
    Yearly: plan.yearly_revenue ?? 0,
    Weekly: plan.weekly_revenue ?? 0,
  }));

  // Prepare pie chart data for active subscriptions count
  const pieDataSubs = stats.map((plan, index) => ({
    name: plan.name,
    value: plan.active_subscriptions ?? 0,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div style={darkStyles.page}>
      <h1 style={darkStyles.heading1}>Admin Dashboard</h1>

      <section>
        <h2 style={darkStyles.heading2}>Plans Summary</h2>
        <table style={darkStyles.table}>
          <thead>
            <tr>
              <th style={darkStyles.th}>Plan Name</th>
              <th style={darkStyles.th}>Active Subscriptions</th>
              <th style={darkStyles.th}>Active Workspaces</th>
              <th style={darkStyles.th}>Blocked Workspaces</th>
              <th style={darkStyles.th}>Expired Workspaces</th>
              <th style={darkStyles.th}>Revenue (Monthly)</th>
              <th style={darkStyles.th}>Revenue (Weekly)</th>
              <th style={darkStyles.th}>Revenue (Yearly)</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((plan) => (
              <tr
                key={plan.id}
                style={{ cursor: "default" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = darkStyles.trHover.backgroundColor)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <td style={darkStyles.td}>{plan.name}</td>
                <td style={darkStyles.td}>{plan.active_subscriptions ?? 0}</td>
                <td style={darkStyles.td}>{plan.active_workspaces ?? 0}</td>
                <td style={darkStyles.td}>{plan.blocked_workspaces ?? 0}</td>
                <td style={darkStyles.td}>{plan.expired_workspaces ?? 0}</td>
                <td style={darkStyles.td}>
                  ${Number(plan.monthly_revenue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td style={darkStyles.td}>
                  ${Number(plan.weekly_revenue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td style={darkStyles.td}>
                  ${Number(plan.yearly_revenue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
        }}
      >
        <div style={{ width: "45%", minWidth: 300, height: 300 }}>
          <h3 style={darkStyles.heading3}>Subscription Counts by Plan</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieDataSubs}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {pieDataSubs.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#222", borderColor: "#444" }}
                itemStyle={{ color: "#eee" }}
              />
              <Legend
                wrapperStyle={{ color: "#eee" }}
                iconType="circle"
                iconSize={10}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ width: "45%", minWidth: 300, height: 300 }}>
          <h3 style={darkStyles.heading3}>Revenue by Plan ($)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <XAxis
                dataKey="name"
                stroke="#bbb"
                tick={{ fill: "#ccc" }}
                tickLine={{ stroke: "#555" }}
              />
              <YAxis
                stroke="#bbb"
                tick={{ fill: "#ccc" }}
                tickLine={{ stroke: "#555" }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#222", borderColor: "#444" }}
                itemStyle={{ color: "#eee" }}
              />
              <Legend
                wrapperStyle={{ color: "#eee" }}
                iconType="square"
                iconSize={10}
              />
              <Bar dataKey="Monthly" fill="#8884d8" />
              <Bar dataKey="Weekly" fill="#82ca9d" />
              <Bar dataKey="Yearly" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
