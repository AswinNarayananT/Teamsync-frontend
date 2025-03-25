import React, { useState } from "react";
import AsideItem from "./AsideItem";

const Sidebar = ({ role, activeSection, setActiveSection }) => {
  const [collapsed, setCollapsed] = useState(false);
  
  const menuItems = role === "admin"
    ? [
        { icon: "dashboard", text: "Dashboard", section: "dashboard" },
        { icon: "workspaces", text: "Workspaces", section: "workspaces" },
        { icon: "plans", text: "Plans", section: "plans" },
        { icon: "reports", text: "Reports", section: "reports" },
        { icon: "settings", text: "Settings", section: "settings" },
      ]
    : [
        { icon: "dashboard", text: "Dashboard", section: "dashboard" },
        { icon: "backlog", text: "Backlog", section: "backlog" },
        { icon: "board", text: "Board", section: "board" },
        { icon: "notification", text: "Notification", section: "notification" },
        { icon: "chat", text: "Chat", section: "chat" },
        { icon: "meeting", text: "Meeting", section: "meeting" },
        { icon: "team", text: "Teams & Members", section: "team" },
        { icon: "projects", text: "Projects", section: "projects" },
        { icon: "settings", text: "Settings", section: "settings" },
      ];
      
  // Group menu items by category for user role
  const userCategories = [
    {
      title: "Main",
      items: menuItems.filter(item => 
        ["dashboard", "backlog", "board"].includes(item.section)
      )
    },
    {
      title: "Communication",
      items: menuItems.filter(item => 
        ["notification", "chat", "meeting"].includes(item.section)
      )
    },
    {
      title: "Organization",
      items: menuItems.filter(item => 
        ["team", "projects"].includes(item.section)
      )
    },
    {
      title: "System",
      items: menuItems.filter(item => 
        ["settings"].includes(item.section)
      )
    }
  ];

  // Get the appropriate menu structure based on role
  const menuStructure = role === "admin" 
    ? [{ title: "Administration", items: menuItems }] 
    : userCategories;

  return (
    <aside 
      className={`fixed top-0 left-0 h-full ${collapsed ? 'w-16' : 'w-64'} bg-[#121214] border-r border-[#2a2a2d] overflow-y-auto z-10 transition-all duration-300 flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between py-4 px-4 h-16 border-b border-[#2a2a2d]">
        {!collapsed && (
          <div className="text-white font-bold text-xl">
            {role === "admin" ? "Admin Panel" : "TeamSync"}
          </div>
        )}
        {collapsed && (
          <div className="text-white font-bold text-xl mx-auto">
            {role === "admin" ? "A" : "T"}
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-[#2a2a2d] transition-colors duration-200"
        >
          {collapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
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
                  key={item.section}
                  icon={item.icon}
                  text={item.text}
                  active={activeSection === item.section}
                  onClick={() => setActiveSection(item.section)}
                  collapsed={collapsed}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer */}
      <div className={`mt-auto border-t border-[#2a2a2d] p-4 ${collapsed ? 'text-center' : ''}`}>
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center text-white font-medium">
              {role === "admin" ? "A" : "U"}
            </div>
            <div className="text-sm">
              <p className="text-white font-medium">
                {role === "admin" ? "Admin User" : "Team Member"}
              </p>
              <p className="text-gray-500 text-xs">
                {role === "admin" ? "Full Access" : "Standard Access"}
              </p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center text-white font-medium">
              {role === "admin" ? "A" : "U"}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;