import React from "react";
import Sidebar from "./sidebar";
import TopNavigation from "./TopNavigation";

const Layout = ({ role, activeSection, setActiveSection, children }) => {
  return (
    <div className="min-h-screen bg-[#121214] relative overflow-hidden">
      <Sidebar role={role} activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="pl-64">
        <TopNavigation role={role} />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
