import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import UsersPage from './users/UsersPage';
import DepartmentsPage from './departments/DepartmentsPage';
import ItemsPage from './items/ItemsPage';
import SettingsPage from './settings/SettingsPage';
import NFCManagementPage from './nfc/NFCManagementPage';
// Placeholder pages - to be implemented in next phases
const AuditLogsPage = () => _jsx("div", { className: "p-6", children: "Audit Logs - Coming Soon (Phase 6)" });
const AnalyticsPage = () => _jsx("div", { className: "p-6", children: "Analytics - Coming Soon (Phase 7)" });
export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (_jsxs("div", { className: "flex h-screen bg-gray-50", children: [_jsx(AdminSidebar, { isOpen: sidebarOpen, onClose: () => setSidebarOpen(false) }), _jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [_jsx(AdminHeader, { onMenuClick: () => setSidebarOpen(!sidebarOpen) }), _jsx("main", { className: "flex-1 overflow-auto", children: _jsx("div", { className: "max-w-7xl mx-auto", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/admin/users", replace: true }) }), _jsx(Route, { path: "/users", element: _jsx(UsersPage, {}) }), _jsx(Route, { path: "/departments", element: _jsx(DepartmentsPage, {}) }), _jsx(Route, { path: "/items", element: _jsx(ItemsPage, {}) }), _jsx(Route, { path: "/nfc", element: _jsx(NFCManagementPage, {}) }), _jsx(Route, { path: "/settings", element: _jsx(SettingsPage, {}) }), _jsx(Route, { path: "/audit-logs", element: _jsx(AuditLogsPage, {}) }), _jsx(Route, { path: "/analytics", element: _jsx(AnalyticsPage, {}) })] }) }) })] })] }));
}
//# sourceMappingURL=AdminLayout.js.map