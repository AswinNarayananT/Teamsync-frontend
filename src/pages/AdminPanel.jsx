import React, { useState } from "react";
import Layout from "../components/Layout";
import WorkSpaces from "../components/WorkSpaces";
import Plans from "../components/Plans";

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <Layout role="admin" activeSection={activeSection} setActiveSection={setActiveSection}>
      {activeSection === "dashboard" && <h1 className="text-white text-2xl p-6">👨‍💼 Welcome, Admin!</h1>}
      {activeSection === "workspaces" && <WorkSpaces />}
      {activeSection === "plans" && <Plans />}
    </Layout>
  );
};

export default AdminPanel;
