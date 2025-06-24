import React, { useState, useEffect } from "react";
import Sidebar from "./SideBar";
import TopNavigation from "./TopNavigation";

const Layout = ({ role, activeSection, setActiveSection, children }) => {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 1024); 
    };

    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-[#121214] relative overflow-hidden">
      <Sidebar role={role} collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={`transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-64'}`}>
        <TopNavigation role={role} />
        <div className="p-6">{children}</div>
      </div>
    </div>


  );
};

export default Layout;
