import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { CheckCircle, XCircle } from 'lucide-react';
export default function AuditLogsTable({ logs, onSelectLog }) {
    function getActionBadgeColor(action) {
        const colors = {
            CREATE: 'bg-green-100 text-green-800',
            READ: 'bg-blue-100 text-blue-800',
            UPDATE: 'bg-yellow-100 text-yellow-800',
            DELETE: 'bg-red-100 text-red-800',
            LOGIN: 'bg-purple-100 text-purple-800',
            LOGOUT: 'bg-gray-100 text-gray-800',
            EXPORT: 'bg-indigo-100 text-indigo-800',
        };
        return colors[action] || 'bg-gray-100 text-gray-800';
    }
    function getResourceBadgeColor(type) {
        const colors = {
            user: 'bg-slate-100 text-slate-800',
            item: 'bg-slate-100 text-slate-800',
            department: 'bg-slate-100 text-slate-800',
            bin: 'bg-slate-100 text-slate-800',
            request: 'bg-slate-100 text-slate-800',
            auth: 'bg-slate-100 text-slate-800',
            system: 'bg-slate-100 text-slate-800',
        };
        return colors[type] || 'bg-slate-100 text-slate-800';
    }
    return (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-gray-50 border-b", children: [_jsx("th", { className: "text-left p-4 font-semibold text-gray-700", children: "Timestamp" }), _jsx("th", { className: "text-left p-4 font-semibold text-gray-700", children: "User" }), _jsx("th", { className: "text-left p-4 font-semibold text-gray-700", children: "Action" }), _jsx("th", { className: "text-left p-4 font-semibold text-gray-700", children: "Resource" }), _jsx("th", { className: "text-left p-4 font-semibold text-gray-700", children: "Status" }), _jsx("th", { className: "text-left p-4 font-semibold text-gray-700", children: "Details" })] }) }), _jsx("tbody", { children: logs.map((log) => (_jsxs("tr", { className: "border-b hover:bg-gray-50 transition cursor-pointer", onClick: () => onSelectLog(log), children: [_jsx("td", { className: "p-4 text-gray-600 font-medium", children: new Date(log.timestamp).toLocaleString() }), _jsx("td", { className: "p-4 text-gray-900", children: log.userName }), _jsx("td", { className: "p-4", children: _jsx("span", { className: `px-3 py-1 rounded-full text-xs font-medium ${getActionBadgeColor(log.action)}`, children: log.action }) }), _jsx("td", { className: "p-4", children: _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("span", { className: `px-2 py-1 rounded text-xs font-medium w-fit ${getResourceBadgeColor(log.resourceType)}`, children: log.resourceType }), _jsx("span", { className: "text-gray-600", children: log.resourceName })] }) }), _jsx("td", { className: "p-4", children: _jsx("div", { className: "flex items-center gap-2", children: log.status === 'success' ? (_jsxs(_Fragment, { children: [_jsx(CheckCircle, { className: "w-4 h-4 text-green-600" }), _jsx("span", { className: "text-green-700", children: "Success" })] })) : (_jsxs(_Fragment, { children: [_jsx(XCircle, { className: "w-4 h-4 text-red-600" }), _jsx("span", { className: "text-red-700", children: "Failed" })] })) }) }), _jsx("td", { className: "p-4", children: _jsx("button", { onClick: (e) => {
                                        e.stopPropagation();
                                        onSelectLog(log);
                                    }, className: "text-brand-accentblue hover:underline text-xs font-medium", children: "View" }) })] }, log.id))) })] }) }));
}
//# sourceMappingURL=AuditLogsTable.js.map