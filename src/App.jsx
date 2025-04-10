import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';

// Public pages
import Home from './pages/Home';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminRegister from './pages/Admin/AdminRegister';
import WorkerLogin from './pages/Worker/WorkerLogin';


// Protected pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import WorkerDashboard from './pages/Worker/WorkerDashboard';

// Management Pages
import WorkerManagement from './components/admin/WorkerManagement';
import DepartmentManagement from './components/admin/DepartmentManagement';
import ColumnManagement from './components/admin/ColumnManagement';
import TaskManagement from './components/admin/TaskManagement';
import LeaveManagement from './components/admin/LeaveManagement';
import CommentManagement from './components/admin/CommentManagement';
import TopicManagement from './components/admin/TopicManager';
import FoodRequestManagement from './components/admin/FoodRequestManagement';
import CustomTasks from './components/admin/CustomTasks';
// Protected route component
import PrivateRoute from './components/common/PrivateRoute';

// Context
import appContext from './context/AppContext';
import { useEffect, useState } from 'react';
import AttendanceManagement from './components/admin/AttendanceManagement';

function getSubdomain() {
  const host = window.location.hostname; // e.g., company1.localhost or task-tracker-backend-skbf.onrender.com
  const parts = host.split("."); // Split by "."
  
  // Check if the URL is a local development environment (localhost)
  if (host.includes("localhost")) {
    if (parts.length > 1) {
      return parts[0]; // Get first part (e.g., company1 from company1.localhost)
    }
  }

  // Check if it's a Render URL (e.g., task-tracker-backend-skbf.onrender.com)
  if (host.includes("onrender.com")) {
    const subdomain = parts.length > 2 ? parts[0] : ''; // Return the subdomain part (e.g., task-tracker-backend-skbf)
    return subdomain;
  }

  return null; // Return null if neither local nor render
}

function App() {
  const [subdomain, setSubdomain] = useState("main");

  useEffect(() => {
    setSubdomain(getSubdomain());
  }, []);

  const context = {
    subdomain
  } 

  return (
    <appContext.Provider value={context}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/worker/login" element={<WorkerLogin />} />

        {/* Protected Admin routes with Layout */}
        <Route element={<PrivateRoute allowedRoles={['admin']} />}>
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="workers" element={<WorkerManagement />} />
            <Route path="attendance" element={<AttendanceManagement />} />
            <Route path="departments" element={<DepartmentManagement />} />
            <Route path="columns" element={<ColumnManagement />} />
            <Route path="tasks" element={<TaskManagement />} />
            <Route path="leaves" element={<LeaveManagement />} />
            <Route path="comments" element={<CommentManagement />} />
            <Route path="topics" element={<TopicManagement />} />
            <Route path="food-requests" element={<FoodRequestManagement />} />
            <Route path="custom-tasks" element={<CustomTasks />} />
            {/* Catch-all route for unknown admin paths */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Route>

        {/* Protected Worker routes */}
        <Route element={<PrivateRoute allowedRoles={['worker']} />}>
          <Route path="/worker/*" element={<WorkerDashboard />}>
            {/* You can add nested worker routes here if needed */}
            <Route path="*" element={<Navigate to="/worker" replace />} />
          </Route>
        </Route>

        {/* 404 Not Found Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </appContext.Provider>
  );
}

export default App;