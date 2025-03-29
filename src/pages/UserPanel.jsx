import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Dashboard from "./Dashboard";
import Team from "../components/Team";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserWorkspaces } from "../redux/workspace/WorkspaceActions";
import { useNavigate } from "react-router-dom";

const UserPanel = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { workspaces, loading, currentWorkspace } = useSelector((state) => state.workspace);

 
  useEffect(() => {
    dispatch(fetchUserWorkspaces());
  }, [dispatch]);


  useEffect(() => {

    if (!loading) {
      if (workspaces.length > 0 && currentWorkspace) {
        navigate("/dashboard");
      } else {
        navigate("/create-workspace");
      }
    }
  }, [loading, workspaces, currentWorkspace, navigate]);

  return (
    <Layout role="user" activeSection={activeSection} setActiveSection={setActiveSection}>
      {activeSection === "dashboard" && <Dashboard />}
      {activeSection === "team" && <Team />}
    </Layout>
  );
};

export default UserPanel;







// import React, { useState,useEffect } from "react";
// import Layout from "../components/Layout";
// import Dashboard from "./Dashboard";
// import { useDispatch,useSelector } from "react-redux";
// import { fetchUserWorkspaces } from "../redux/workspace/WorkspaceActions";
// import { useNavigate } from "react-router-dom";

// const UserPanel = () => {
//   const [activeSection, setActiveSection] = useState("dashboard");
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { workspaces, loading } = useSelector((state) => state.workspace);

//   useEffect(() => {
//     if (!workspaces.length && !loading) { 
//       dispatch(fetchUserWorkspaces()); 
//     }
//   }, [dispatch]); // ✅ Fetch only when component mounts
  
//   useEffect(() => {
//     if (!loading && workspaces.length === 0) {
//       navigate("/create-workspace"); // ✅ Redirect only when loading is done
//     }
//   }, [loading, workspaces, navigate]); 
  

//   return (
//     <Layout role="user" activeSection={activeSection} setActiveSection={setActiveSection}>
//       {activeSection === "dashboard" && <Dashboard />}
//       {/* {activeSection === "backlog" && <Backlog />}
//       {activeSection === "board" && <Board />}
//       {activeSection === "notification" && <Notification />}
//       {activeSection === "chat" && <Chat />}
//       {activeSection === "meeting" && <Meeting />}
//       {activeSection === "team" && <Team />}
//       {activeSection === "projects" && <Projects />}
//       {activeSection === "settings" && <Settings />} */}
//     </Layout>
//   );
// };


