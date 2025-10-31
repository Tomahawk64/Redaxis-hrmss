import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/SideBar";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import "/src/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Event2 from "./components/Events2";
import Event1 from "./components/Event1";
import Event3 from "./components/Event3";
import Employees from "./components/Employees";
import DepartmentManagement from "./components/DepartmentManagement";
import Profile from "./components/Profile";
import Attendance from "./components/Attendance";
import Payroll from "./components/Payroll";
import Feed from "./components/Feed";
import Recognition from "./components/Recognition";
import Chat from "./components/Chat";
import Settings from "./components/Settings";
import Leaves from "./components/Leaves";
import MyTeam from "./components/MyTeam";
import Assets from "./components/Assets";
import { getToken, authAPI } from "./services/api";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = getToken();
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = getToken();
    if (token) {
      try {
        await authAPI.getMe();
      } catch (error) {
        console.error("Auth check failed:", error);
        authAPI.logout();
      }
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="d-flex" style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
              <Sidebar />
              <div className="flex-grow-1 p-4" style={{ overflowY: "auto", overflowX: "hidden", width: "calc(100% - 250px)" }}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/event" element={<Event1 />} />
                  <Route path="/event/schedule" element={<Event2 />} />
                  <Route path="/event/confirmation" element={<Event3 />} />
                  <Route path="/employees" element={<Employees />} />
                  <Route path="/departments" element={<DepartmentManagement />} />
                  <Route path="/my-team" element={<MyTeam />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/attendance" element={<Attendance />} />
                  <Route path="/leaves" element={<Leaves />} />
                  <Route path="/payroll" element={<Payroll />} />
                  <Route path="/feed" element={<Feed />} />
                  <Route path="/recognition" element={<Recognition />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/assets" element={<Assets />} />
                </Routes>
              </div>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
