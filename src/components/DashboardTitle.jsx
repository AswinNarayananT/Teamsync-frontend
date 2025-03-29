import React, { useState } from "react";
import Dropdown from "./Dropdown";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentWorkspace } from "../redux/workspace/workspaceSlice";

const DashboardTitle = ({ role }) => {
    const dispatch = useDispatch();
    const { workspaces, currentWorkspace } = useSelector((state) => state.workspace);
  
  
    return (
      <div className="relative">
        {role === "admin" ? (
          <h1 className="text-white text-xl font-semibold">Admin Dashboard</h1>
        ) : (
          <div className="flex items-center space-x-4">
          {/* Workspace Dropdown */}
          <div className="flex flex-col items-center">
            <span className="text-gray-400 text-xs">Workspace</span>
            <div className="p-1 ">
            {workspaces.length > 0 && (
                <Dropdown
                  options={workspaces}
                  selected={currentWorkspace || workspaces[0]}
                  setSelected={(selected) => dispatch(setCurrentWorkspace(selected))}
                />
              )}
            </div>
          </div>
        </div>
        )}
      </div>
    );
  };
  
  export default DashboardTitle;
