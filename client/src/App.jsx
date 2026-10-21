import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './routes/ProtectedRoute';

// Pages
import LoginPage from './pages/auth/LoginPage';
import UnauthorizedPage from './pages/common/UnauthorizedPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import EmployeesPage from './pages/admin/EmployeesPage';
import InternsPage from './pages/admin/InternsPage';
import ProjectsPage from './pages/admin/ProjectsPage';
import ProjectDetailPage from './pages/admin/ProjectDetailPage';
import TasksPage from './pages/admin/TasksPage';
import AdminAttendancePage from './pages/admin/AdminAttendancePage';
import AdminLeavesPage from './pages/admin/AdminLeavesPage';
import HolidaysPage from './pages/admin/HolidaysPage';
import ReportsPage from './pages/admin/ReportsPage';
import HrDashboard from './pages/hr/HrDashboard';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import MyProfilePage from './pages/employee/MyProfilePage';
import MyProjectsPage from './pages/employee/MyProjectsPage';
import MyTasksPage from './pages/employee/MyTasksPage';
import EmployeeAttendancePage from './pages/employee/EmployeeAttendancePage';
import EmployeeLeavesPage from './pages/employee/EmployeeLeavesPage';
import CalendarPage from './pages/shared/CalendarPage';
import PayrollPage from './pages/admin/PayrollPage';
import MySalaryPage from './pages/employee/MySalaryPage';
import ChatPage from './pages/chat/ChatPage';
import BranchesPage from './pages/admin/BranchesPage';
import SettingsPage from './pages/shared/SettingsPage';

// Styles
import './styles/global.css';
import './styles/components.css';

// Root redirector based on authentication and role
function RootRedirect() {
  const { isAuthenticated, isAdmin, isHR, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (isHR) {
    return <Navigate to="/hr/dashboard" replace />;
  }

  return <Navigate to="/employee/dashboard" replace />;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/chat"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/branches"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'HR', 'MANAGER']}>
                <BranchesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/employees"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'HR', 'MANAGER']}>
                <EmployeesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/interns"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'HR', 'MANAGER']}>
                <InternsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'HR', 'MANAGER']}>
                <ProjectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projects/:id"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'HR', 'MANAGER']}>
                <ProjectDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tasks"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'HR', 'MANAGER']}>
                <TasksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/attendance"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                <AdminAttendancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/leaves"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                <AdminLeavesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payroll"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <PayrollPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/holidays"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'HR', 'MANAGER']}>
                <HolidaysPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                <ReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/chat"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* HR Protected Routes */}
          <Route
            path="/hr/dashboard"
            element={
              <ProtectedRoute allowedRoles={['HR', 'ADMIN', 'MANAGER']}>
                <HrDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/branches"
            element={
              <ProtectedRoute allowedRoles={['HR', 'ADMIN', 'MANAGER']}>
                <BranchesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/employees"
            element={
              <ProtectedRoute allowedRoles={['HR', 'ADMIN', 'MANAGER']}>
                <EmployeesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/interns"
            element={
              <ProtectedRoute allowedRoles={['HR', 'ADMIN', 'MANAGER']}>
                <InternsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/projects"
            element={
              <ProtectedRoute allowedRoles={['HR', 'ADMIN', 'MANAGER']}>
                <ProjectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/projects/:id"
            element={
              <ProtectedRoute allowedRoles={['HR', 'ADMIN', 'MANAGER']}>
                <ProjectDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/tasks"
            element={
              <ProtectedRoute allowedRoles={['HR', 'ADMIN', 'MANAGER']}>
                <TasksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/attendance"
            element={
              <ProtectedRoute allowedRoles={['HR', 'ADMIN', 'MANAGER']}>
                <AdminAttendancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/leaves"
            element={
              <ProtectedRoute allowedRoles={['HR', 'ADMIN', 'MANAGER']}>
                <AdminLeavesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/holidays"
            element={
              <ProtectedRoute allowedRoles={['HR', 'ADMIN', 'MANAGER']}>
                <HolidaysPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/reports"
            element={
              <ProtectedRoute allowedRoles={['HR', 'ADMIN', 'MANAGER']}>
                <ReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/calendar"
            element={
              <ProtectedRoute allowedRoles={['HR', 'ADMIN', 'MANAGER', 'EMPLOYEE']}>
                <CalendarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/chat"
            element={
              <ProtectedRoute allowedRoles={['HR', 'ADMIN', 'MANAGER']}>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/settings"
            element={
              <ProtectedRoute allowedRoles={['HR', 'ADMIN', 'MANAGER']}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/salary"
            element={
              <ProtectedRoute allowedRoles={['HR', 'ADMIN', 'MANAGER', 'EMPLOYEE']}>
                <MySalaryPage />
              </ProtectedRoute>
            }
          />


          {/* Shared & Role-Specific Calendar Routes */}
          <Route
            path="/calendar"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE']}>
                <CalendarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/calendar"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'HR', 'MANAGER']}>
                <CalendarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/calendar"
            element={
              <ProtectedRoute allowedRoles={['EMPLOYEE', 'HR', 'MANAGER', 'ADMIN']}>
                <CalendarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/corporate-calendar"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE']}>
                <CalendarPage />
              </ProtectedRoute>
            }
          />

          {/* Shared & Role-Specific Holiday & Festival Routes */}
          <Route
            path="/holidays"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE']}>
                <HolidaysPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/holidays"
            element={
              <ProtectedRoute allowedRoles={['EMPLOYEE', 'HR', 'MANAGER', 'ADMIN']}>
                <HolidaysPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company-calendar"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE']}>
                <CalendarPage />
              </ProtectedRoute>
            }
          />

          {/* Employee Protected Routes */}
          <Route
            path="/employee/dashboard"
            element={
              <ProtectedRoute allowedRoles={['EMPLOYEE', 'MANAGER', 'ADMIN']}>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/profile"
            element={
              <ProtectedRoute allowedRoles={['EMPLOYEE', 'MANAGER', 'ADMIN']}>
                <MyProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/projects"
            element={
              <ProtectedRoute allowedRoles={['EMPLOYEE', 'MANAGER', 'ADMIN']}>
                <MyProjectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/projects/:id"
            element={
              <ProtectedRoute allowedRoles={['EMPLOYEE', 'MANAGER', 'ADMIN']}>
                <ProjectDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/tasks"
            element={
              <ProtectedRoute allowedRoles={['EMPLOYEE', 'MANAGER', 'ADMIN']}>
                <MyTasksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/attendance"
            element={
              <ProtectedRoute allowedRoles={['EMPLOYEE', 'MANAGER', 'ADMIN']}>
                <EmployeeAttendancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/leaves"
            element={
              <ProtectedRoute allowedRoles={['EMPLOYEE', 'MANAGER', 'ADMIN']}>
                <EmployeeLeavesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/salary"
            element={
              <ProtectedRoute allowedRoles={['EMPLOYEE', 'MANAGER', 'HR', 'ADMIN']}>
                <MySalaryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/chat"
            element={
              <ProtectedRoute allowedRoles={['EMPLOYEE', 'MANAGER', 'HR', 'ADMIN']}>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE']}>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/settings"
            element={
              <ProtectedRoute allowedRoles={['EMPLOYEE', 'MANAGER', 'HR', 'ADMIN']}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE']}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Root & Fallback */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </Router>
      </SocketProvider>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
