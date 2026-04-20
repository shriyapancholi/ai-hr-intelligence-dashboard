import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import EmployeeProfile from './pages/EmployeeProfile';
import Analytics from './pages/Analytics';
import AIChat from './pages/AIChat';
import Reminders from './pages/reminders';
import UploadTranscript from './pages/UploadTranscript';
import Login from './pages/Login';
import Register from './pages/Register';

import './index.css';

/* Authentication Check */
const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

/* Protected Layout */
function ProtectedLayout({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}

/* App Routes */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          }
        />

        <Route
          path="/employees"
          element={
            <ProtectedLayout>
              <Employees />
            </ProtectedLayout>
          }
        />

        <Route
          path="/employee-profile/:id"
          element={
            <ProtectedLayout>
              <EmployeeProfile />
            </ProtectedLayout>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedLayout>
              <Analytics />
            </ProtectedLayout>
          }
        />

        <Route
          path="/ai-chat"
          element={
            <ProtectedLayout>
              <AIChat />
            </ProtectedLayout>
          }
        />

        <Route
          path="/reminders"
          element={
            <ProtectedLayout>
              <Reminders />
            </ProtectedLayout>
          }
        />

        <Route
          path="/upload-transcript"
          element={
            <ProtectedLayout>
              <UploadTranscript />
            </ProtectedLayout>
          }
        />

        {/* Default Route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}