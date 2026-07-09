import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link, useLocation } from 'react-router-dom';
import { Users, Building2, Package, Wifi, Settings, FileText, BarChart3, X } from 'lucide-react';
export default function AdminSidebar({ isOpen, onClose }) {
    const location = useLocation();
    const menuItems = [
        { href: '/admin/users', icon: Users, label: 'Users', badge: null },
        { href: '/admin/departments', icon: Building2, label: 'Departments', badge: null },
        { href: '/admin/items', icon: Package, label: 'Items', badge: null },
        { href: '/admin/nfc', icon: Wifi, label: 'NFC Management', badge: null },
        { href: '/admin/settings', icon: Settings, label: 'Settings', badge: null },
        { href: '/admin/audit-logs', icon: FileText, label: 'Audit Logs', badge: null },
        { href: '/admin/analytics', icon: BarChart3, label: 'Analytics', badge: null },
    ];
    const isActive = (href) => location.pathname === href;
    return (_jsxs(_Fragment, { children: [isOpen && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden", onClick: onClose })), _jsxs("aside", { className: `fixed lg:static inset-y-0 left-0 z-50 w-64 bg-brand-navy text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`, children: [_jsxs("div", { className: "p-6 border-b border-blue-800 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold", children: "TapTask" }), _jsx("p", { className: "text-xs text-blue-200", children: "Admin Panel" })] }), _jsx("button", { onClick: onClose, className: "lg:hidden", children: _jsx(X, { className: "w-6 h-6" }) })] }), _jsx("nav", { className: "flex-1 px-4 py-6 space-y-2", children: menuItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (_jsxs(Link, { to: item.href, onClick: onClose, className: `flex items-center gap-3 px-4 py-3 rounded-lg transition ${active
                                    ? 'bg-blue-600 text-white'
                                    : 'text-blue-100 hover:bg-blue-800'}`, children: [_jsx(Icon, { className: "w-5 h-5" }), _jsx("span", { className: "flex-1", children: item.label }), item.badge && (_jsx("span", { className: "bg-red-600 text-white text-xs px-2 py-1 rounded-full", children: item.badge }))] }, item.href));
                        }) }), _jsx("div", { className: "p-4 border-t border-blue-800", children: _jsx("p", { className: "text-xs text-blue-300 text-center", children: "TapTask v1.0.0" }) })] })] }));
}
//# sourceMappingURL=AdminSidebar.js.map