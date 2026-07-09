import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, QrCode, Zap, BarChart3, Settings } from 'lucide-react';
export default function HomePage() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    function handleLogout() {
        logout();
        navigate('/login');
    }
    // Role-based menu
    const getMenuItems = () => {
        const baseItems = [
            {
                icon: QrCode,
                label: 'Scan Bin',
                description: 'Tap NFC tag or scan QR code',
                action: () => navigate('/request'),
                show: ['employee', 'technician', 'supervisor', 'admin'].includes(user?.role || ''),
            },
        ];
        if (user?.role === 'technician' || user?.role === 'supervisor' || user?.role === 'admin') {
            baseItems.push({
                icon: Zap,
                label: 'Refill Queue',
                description: 'View and manage requests',
                action: () => navigate('/queue'),
                show: true,
            });
        }
        if (user?.role === 'supervisor' || user?.role === 'admin') {
            baseItems.push({
                icon: BarChart3,
                label: 'Dashboard',
                description: 'View KPIs and analytics',
                action: () => navigate('/dashboard'),
                show: true,
            });
        }
        if (user?.role === 'admin') {
            baseItems.push({
                icon: Settings,
                label: 'Admin Panel',
                description: 'Manage system settings',
                action: () => navigate('/admin'),
                show: true,
            });
        }
        return baseItems.filter(item => item.show);
    };
    const menuItems = getMenuItems();
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-brand-navy to-blue-900", children: [_jsx("div", { className: "bg-brand-navy text-white p-6 shadow-lg", children: _jsxs("div", { className: "max-w-6xl mx-auto flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold", children: "TapTask" }), _jsx("p", { className: "text-blue-200 mt-1", children: "NFC-Powered Kanban Replenishment" })] }), _jsxs("button", { onClick: handleLogout, className: "flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition", children: [_jsx(LogOut, { className: "w-5 h-5" }), "Logout"] })] }) }), _jsxs("div", { className: "max-w-6xl mx-auto p-6", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-lg p-8 mb-8", children: [_jsxs("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: ["Welcome, ", user?.name, "!"] }), _jsxs("p", { className: "text-gray-600", children: ["Role: ", _jsx("span", { className: "font-semibold capitalize", children: user?.role })] })] }), _jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-4 gap-6", children: menuItems.map((item) => {
                            const Icon = item.icon;
                            return (_jsxs("button", { onClick: item.action, className: "bg-white rounded-lg shadow hover:shadow-lg transition p-6 text-left transform hover:scale-105", children: [_jsx(Icon, { className: "w-12 h-12 text-brand-accentblue mb-4" }), _jsx("h3", { className: "text-xl font-bold text-gray-900 mb-2", children: item.label }), _jsx("p", { className: "text-gray-600 text-sm", children: item.description })] }, item.label));
                        }) }), _jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8", children: [_jsx("h3", { className: "text-lg font-bold text-blue-900 mb-4", children: "\uD83D\uDE80 Quick Start" }), _jsxs("div", { className: "grid md:grid-cols-3 gap-6 text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "font-semibold text-blue-900 mb-2", children: "1. Scan a Bin" }), _jsx("p", { className: "text-blue-800", children: "Tap an NFC tag or scan a QR code to open a bin's details" })] }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-blue-900 mb-2", children: "2. Submit Request" }), _jsx("p", { className: "text-blue-800", children: "Select request type (refill/partial/damaged) and submit in seconds" })] }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-blue-900 mb-2", children: "3. Track Status" }), _jsx("p", { className: "text-blue-800", children: "Technicians process requests and you can track progress in real-time" })] })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6 mt-8", children: [_jsx("h3", { className: "text-lg font-bold text-gray-900 mb-4", children: "\uD83D\uDCE6 Available Test Bins" }), _jsx("p", { className: "text-gray-600 mb-4", children: "Try these NFC tag codes to test the workflow:" }), _jsx("div", { className: "grid md:grid-cols-3 gap-4", children: [
                                    { code: 'KBN-ICU-0042', item: 'Saline Solution 0.9%', dept: 'ICU' },
                                    { code: 'KBN-ICU-0043', item: 'Latex Gloves Size L', dept: 'ICU' },
                                    { code: 'KBN-ER-0015', item: 'Sterile Gauze Pads', dept: 'ER' },
                                ].map((bin) => (_jsxs("button", { onClick: () => navigate(`/tap/${bin.code}`), className: "border border-gray-300 rounded-lg p-4 hover:bg-gray-50 text-left transition", children: [_jsx("p", { className: "font-mono font-bold text-brand-accentblue", children: bin.code }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: bin.item }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: ["Department: ", bin.dept] })] }, bin.code))) })] })] })] }));
}
//# sourceMappingURL=HomePage.js.map