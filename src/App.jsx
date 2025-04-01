import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import OtpVerify from "./pages/OtpVerify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import AdminPanel from "./pages/AdminPanel";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoutes";
import UserPanel from "./pages/UserPanel";
import CreateWorkspace from "./pages/CreateWorkspace";
import JoinWorkspace from "./pages/JoinWorkspace";

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
        </Route>

        {/* Protected Routes (Authenticated Users) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<UserPanel />} />
          <Route path="/create-workspace" element={<CreateWorkspace />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/adminpanel" element={<AdminPanel />} />
        </Route>


        
        <Route path="/join-workspace/:token" element={<JoinWorkspace />} />
      </Routes>
    </>
  );
}

export default App;
