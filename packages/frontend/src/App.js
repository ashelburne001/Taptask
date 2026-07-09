import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import TapPage from './pages/TapPage';
import EmployeeFormPage from './pages/EmployeeFormPage';
import TechnicianQueuePage from './pages/TechnicianQueuePage';
import SupervisorDashboard from './pages/SupervisorDashboard';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';
function ProtectedRoute({ element, requiredRoles }) {
    const { user } = useAuthStore();
    if (!user) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    if (requiredRoles && !requiredRoles.includes(user.role)) {
        return _jsx(Navigate, { to: "/unauthorized", replace: true });
    }
    return element;
}
export default function App() {
    useAuthStore();
    return (_jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/", element: _jsx(ProtectedRoute, { element: _jsx(HomePage, {}) }) }), _jsx(Route, { path: "/tap/:binCode", element: _jsx(ProtectedRoute, { element: _jsx(TapPage, {}) }) }), _jsx(Route, { path: "/request", element: _jsx(ProtectedRoute, { element: _jsx(EmployeeFormPage, {}) }) }), _jsx(Route, { path: "/queue", element: _jsx(ProtectedRoute, { element: _jsx(TechnicianQueuePage, {}), requiredRoles: ['technician', 'supervisor', 'admin'] }) }), _jsx(Route, { path: "/dashboard", element: _jsx(ProtectedRoute, { element: _jsx(SupervisorDashboard, {}), requiredRoles: ['supervisor', 'admin'] }) }), _jsx(Route, { path: "/admin/*", element: _jsx(ProtectedRoute, { element: _jsx(AdminPanel, {}), requiredRoles: ['admin'] }) }), _jsx(Route, { path: "/unauthorized", element: _jsx("div", { className: "p-6 text-center", children: "Unauthorized access" }) }), _jsx(Route, { path: "*", element: _jsx(NotFound, {}) })] }) }));
}
//# sourceMappingURL=App.js.map