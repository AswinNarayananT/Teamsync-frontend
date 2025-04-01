import React, { useState, useEffect } from "react";
import { fetchUserWorkspaces } from "../redux/workspace/workspaceThunks";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Dashboard from "./Dashboard";
import Team from "../components/Team";
import UserSettings from "../components/UserSettings";

const UserPanel = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { workspaces, loading, currentWorkspace } = useSelector((state) => state.workspace);
  const [workspacesFetched, setWorkspacesFetched] = useState(false);

 
  useEffect(() => {
    if (workspaces.length === 0 && !loading) {
      console.log("it is working")
      dispatch(fetchUserWorkspaces()).then(() => setWorkspacesFetched(true));
    }
  }, [dispatch, workspaces.length, loading]);

  useEffect(() => {
    if (!loading && workspacesFetched) {
      if (workspaces.length > 0 && currentWorkspace) {
        console.log("Redirecting to dashboard");
        navigate("/dashboard");
      } else if (workspaces.length === 0) {
        console.log("Redirecting to create workspace");
        navigate("/create-workspace");
      }
    }
  }, [loading, workspacesFetched, workspaces.length, currentWorkspace, navigate]);

  return (
    <Layout role="user" activeSection={activeSection} setActiveSection={setActiveSection}>
      {activeSection === "dashboard" && <Dashboard />}
      {activeSection === "team" && <Team />}
      {activeSection === "settings" && <UserSettings />}
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


