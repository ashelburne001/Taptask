import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Lock, Trash2 } from 'lucide-react';
import { FormField } from '../shared';
import { useState } from 'react';
export default function AuditSettingsSection() {
    const [retentionDays, setRetentionDays] = useState(30);
    const [_loading, _setLoading] = useState(false);
    async function handleSave() {
        _setLoading(true);
        try {
            // TODO: Implement audit settings API
        }
        finally {
            _setLoading(false);
        }
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-2 mb-6", children: [_jsx(Lock, { className: "w-6 h-6 text-brand-accentblue" }), _jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Audit & Compliance" })] }), _jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: _jsx("p", { className: "text-sm text-blue-800", children: "Configure retention policies and compliance settings for audit logs." }) }), _jsxs("div", { className: "space-y-4", children: [_jsx(FormField, { label: "Audit Log Retention (days)", name: "retentionDays", type: "number", value: retentionDays, onChange: (value) => setRetentionDays(Number(value)), helpText: "Logs older than this will be archived. Set to 0 to disable archival." }), _jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3", children: [_jsx("h3", { className: "font-semibold text-gray-900", children: "Audit Log Status" }), _jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-600", children: "Total Logs" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: "1,247" })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-600", children: "Last Cleanup" }), _jsx("p", { className: "text-sm font-medium text-gray-900", children: "2 days ago" })] })] })] })] }), _jsxs("div", { className: "border-t pt-6 space-y-3", children: [_jsx("button", { onClick: handleSave, disabled: _loading, className: "px-6 py-2 bg-brand-accentblue text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50", children: _loading ? 'Saving...' : 'Save Audit Settings' }), _jsx("button", { type: "button", className: "ml-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition", children: "Run Cleanup Now" }), _jsxs("button", { type: "button", className: "ml-2 px-6 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition flex items-center gap-2", children: [_jsx(Trash2, { className: "w-4 h-4" }), "Export Logs"] })] }), _jsx("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6", children: _jsxs("p", { className: "text-sm text-yellow-800", children: [_jsx("strong", { children: "Note:" }), " Audit logs are immutable for compliance. Cleanup only archives old logs, never deletes them."] }) })] }));
}
//# sourceMappingURL=AuditSettingsSection.js.map