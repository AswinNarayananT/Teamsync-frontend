import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AsideItem from "./AsideItem";

const Sidebar = ({ role, collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = role === "admin"
    ? [
        { icon: "dashboard", text: "Dashboard", path: "/adminpanel" },
        { icon: "workspaces", text: "Workspaces", path: "/adminpanel/workspaces" },
        { icon: "plans", text: "Plans", path: "/adminpanel/plans" },
        { icon: "reports", text: "Reports", path: "/adminpanel/reports" },
        { icon: "settings", text: "Settings", path: "/adminpanel/settings" },
      ]
    : [
        { icon: "dashboard", text: "Dashboard", path: "/dashboard" },
        { icon: "backlog", text: "Backlog", path: "/dashboard/backlog" },
        { icon: "board", text: "Board", path: "/dashboard/board" },
        // { icon: "notification", text: "Notification", path: "/dashboard/notification" },
        { icon: "chat", text: "Chat", path: "/dashboard/chat" },
        { icon: "meeting", text: "Meeting", path: "/dashboard/meeting" },
        { icon: "team", text: "Teams & Members", path: "/dashboard/team" },
        { icon: "projects", text: "Projects", path: "/dashboard/projects" },
        { icon: "settings", text: "Settings", path: "/dashboard/settings" },
      ];

  // Group menu items
  const userCategories = [
    {
      title: "Main",
      items: menuItems.filter(item => 
        ["/dashboard", "/dashboard/backlog", "/dashboard/board"].includes(item.path)
      )
    },
    {
      title: "Communication",
      items: menuItems.filter(item => 
        [ "/dashboard/chat", "/dashboard/meeting"].includes(item.path)
      )
    },
    {
      title: "Organization",
      items: menuItems.filter(item => 
        ["/dashboard/team", "/dashboard/projects"].includes(item.path)
      )
    },
    {
      title: "System",
      items: menuItems.filter(item => 
        ["/dashboard/settings"].includes(item.path)
      )
    }
  ];

  const menuStructure = role === "admin"
    ? [{ title: "Administration", items: menuItems }]
    : userCategories;

  return (
    <aside 
        className={`fixed top-0 left-0 h-screen z-30 bg-[#121214] border-r border-[#2a2a2d] transition-all duration-300 flex flex-col ${collapsed ? 'w-16' : 'w-64'}`}
      >
      {/* Header */}
      <div className="flex items-center justify-between py-4 px-4 h-16 border-b border-[#2a2a2d]">
        <div className="text-white font-bold text-xl">
          {collapsed ? (role === "admin" ? "A" : "T") : (role === "admin" ? "Admin Panel" : "TeamSync")}
        </div>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-[#2a2a2d] transition-colors duration-200"
        >
          {collapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      {/* Menu Items */}
      <div className="py-4 flex-1 overflow-y-auto">
        {menuStructure.map((category, index) => (
          <div key={index} className="mb-6">
            {!collapsed && (
              <h3 className="text-xs uppercase text-gray-500 font-semibold px-6 mb-2">
                {category.title}
              </h3>
            )}
            <div className="flex flex-col space-y-1 px-2">
              {category.items.map((item) => (
                <AsideItem
                  key={item.path}
                  icon={item.icon}
                  text={item.text}
                  active={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                  collapsed={collapsed}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className={`mt-auto border-t border-[#2a2a2d] p-4 ${collapsed ? 'text-center' : ''}`}>
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center text-white font-medium">
            {role === "admin" ? "A" : "U"}
          </div>
        </div>
        {!collapsed && (
          <div className="text-sm mt-2 text-white text-center">
            <p className="font-medium">{role === "admin" ? "Admin User" : "Team Member"}</p>
            <p className="text-gray-500 text-xs">{role === "admin" ? "Full Access" : "Standard Access"}</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
