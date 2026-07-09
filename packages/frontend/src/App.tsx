import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import TapPage from './pages/TapPage'
import EmployeeFormPage from './pages/EmployeeFormPage'
import TechnicianQueuePage from './pages/TechnicianQueuePage'
import SupervisorDashboard from './pages/SupervisorDashboard'
import AdminPanel from './pages/AdminPanel'
import NotFound from './pages/NotFound'

function ProtectedRoute({ element, requiredRoles }: { element: React.ReactNode; requiredRoles?: string[] }) {
  const { user } = useAuthStore()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return element
}

export default function App() {
  useAuthStore()

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute element={<HomePage />} />} />
        <Route path="/tap/:binCode" element={<ProtectedRoute element={<TapPage />} />} />
        <Route path="/request" element={<ProtectedRoute element={<EmployeeFormPage />} />} />
        <Route
          path="/queue"
          element={<ProtectedRoute element={<TechnicianQueuePage />} requiredRoles={['technician', 'supervisor', 'admin']} />}
        />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<SupervisorDashboard />} requiredRoles={['supervisor', 'admin']} />}
        />
        <Route
          path="/admin/*"
          element={<ProtectedRoute element={<AdminPanel />} requiredRoles={['admin']} />}
        />
        <Route path="/unauthorized" element={<div className="p-6 text-center">Unauthorized access</div>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}
