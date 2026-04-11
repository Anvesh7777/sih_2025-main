import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useState } from 'react';

// Components & Layouts
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import DashboardLayout from './layout/DashboardLayout';

// Pages
import DashboardHome from './pages/DashboardHome';
import NoticeBoard from './pages/NoticeBoard';
import ELibrary from './pages/ELibrary';
import ProfilePage from './pages/ProfilePage';
import AttendancePage from './pages/AttendancePage';
import ResultsPage from './pages/ResultsPage';
import MarkAttendance from './pages/MarkAttendance';

// Admin Pages
import AdminQrGenerator from './pages/AdminQrGenerator';
import AdminAttendanceView from './pages/AdminAttendanceView';
import HighRiskPage from './pages/HighRiskPage';
import AddResource from './pages/AddResource';

/**
 * @desc AuthPage handles the toggle state between Login and Register
 * with a clean, unified background.
 */
function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const handleToggleView = () => setIsLoginView(!isLoginView);
  
  return isLoginView 
    ? <Login onToggleView={handleToggleView} /> 
    : <Register onToggleView={handleToggleView} />;
}

const router = createBrowserRouter([
  // 1. Public Authentication Route
  { 
    path: '/login', 
    element: <AuthPage /> 
  },

  // 2. Main Dashboard Entry Point (Protected)
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      // --- Student & Shared Routes ---
      { index: true, element: <DashboardHome /> },
      { path: 'notice-board', element: <NoticeBoard /> },
      { path: 'e-library', element: <ELibrary /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'attendance', element: <AttendancePage /> },
      { path: 'results', element: <ResultsPage /> },
      { path: 'mark-attendance', element: <MarkAttendance /> },

      // --- Admin-Only Routes (Protected by AdminRoute) ---
      { 
        path: 'generate-qr', 
        element: <AdminRoute><AdminQrGenerator /></AdminRoute> 
      },
      { 
        path: 'view-attendance', 
        element: <AdminRoute><AdminAttendanceView /></AdminRoute> 
      },
      { 
        path: 'high-risk', 
        element: <AdminRoute><HighRiskPage /></AdminRoute> 
      },
      { 
        path: 'add-resource', 
        element: <AdminRoute><AddResource /></AdminRoute> 
      },
    ],
  },

  // 3. Fallback / Redirects
  { 
    path: '/', 
    element: <Navigate to="/dashboard" replace /> 
  },
  { 
    path: '*', 
    element: <div className="h-screen bg-[#020617] flex items-center justify-center text-slate-500 font-bold">404 | Protocol Not Found</div> 
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;