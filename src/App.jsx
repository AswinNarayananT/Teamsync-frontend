import { Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Home from "./pages/Home";
import Login from "./pages/Login";
import OtpVerify from "./pages/OtpVerify";
import AdminPanel from "./pages/AdminPanel";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoutes";
import UserPanel from "./pages/UserPanel";
import CreateWorkspace from "./pages/CreateWorkspace";
import JoinWorkspace from "./pages/JoinWorkspace";
import Dashboard from "./pages/Dashboard";
import Team from "./components/Team";
import UserSettings from "./components/UserSettings";
import WorkSpaces from "./components/WorkSpaces";
import Plans from "./components/Plans";
import BacklogBoard from "./components/BacklogBoard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Board from "./components/main/Board";



function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Public Routes (Users NOT logged in) */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/otp-verify" element={<OtpVerify />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:uidb64/:token" element={<ResetPassword />} />
        </Route>

        {/* Protected Routes (Authenticated Users) */}
        <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<UserPanel />}>
          <Route index element={<Dashboard />} />
          <Route path="team" element={<Team />} />
          <Route path="settings" element={<UserSettings />} />
          <Route
            path="board"
            element={
              <DndProvider backend={HTML5Backend}>
                <Board/>
              </DndProvider>
            }
          />  
          <Route
            path="backlog"
            element={
              <DndProvider backend={HTML5Backend}>
                <BacklogBoard />
              </DndProvider>
            }
          />  
        </Route>
          <Route path="/create-workspace" element={<CreateWorkspace />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/adminpanel" element={<AdminPanel />} >
            <Route index element={<h1 className="text-white text-2xl p-6">👨‍💼 Welcome, Admin!</h1>} />
            <Route path="workspaces" element={<WorkSpaces />} />
            <Route path="plans" element={<Plans />} />
          </Route>
        </Route>


        
        <Route path="/join-workspace/:token" element={<JoinWorkspace />} />
      </Routes>
    </>
  );
}

export default App;
