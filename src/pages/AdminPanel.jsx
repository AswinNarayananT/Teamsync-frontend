import React, { useState } from "react";
import Layout from "../components/Layout";
import WorkSpaces from "../components/WorkSpaces";
import Plans from "../components/Plans";
import { Outlet } from "react-router-dom";


const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <Layout role="admin" activeSection={activeSection} setActiveSection={setActiveSection}>
        <Outlet />
    </Layout>
  );
};

export default AdminPanel;
