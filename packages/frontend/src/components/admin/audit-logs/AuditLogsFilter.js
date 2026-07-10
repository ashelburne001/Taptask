import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FormField } from '../shared';
import { X } from 'lucide-react';
const ACTION_OPTIONS = [
    { label: 'Create', value: 'CREATE' },
    { label: 'Read', value: 'READ' },
    { label: 'Update', value: 'UPDATE' },
    { label: 'Delete', value: 'DELETE' },
    { label: 'Login', value: 'LOGIN' },
    { label: 'Logout', value: 'LOGOUT' },
    { label: 'Export', value: 'EXPORT' },
];
const RESOURCE_TYPE_OPTIONS = [
    { label: 'User', value: 'user' },
    { label: 'Item', value: 'item' },
    { label: 'Department', value: 'department' },
    { label: 'Bin', value: 'bin' },
    { label: 'Request', value: 'request' },
    { label: 'Auth', value: 'auth' },
    { label: 'System', value: 'system' },
];
export default function AuditLogsFilter({ filters, onFiltersChange, onClose, }) {
    function handleStartDateChange(value) {
        const timestamp = value ? new Date(value).getTime() : undefined;
        onFiltersChange({ ...filters, startDate: timestamp });
    }
    function handleEndDateChange(value) {
        const timestamp = value ? new Date(value).getTime() : undefined;
        onFiltersChange({ ...filters, endDate: timestamp });
    }
    function handleActionChange(value) {
        onFiltersChange({ ...filters, action: String(value) || undefined });
    }
    function handleResourceTypeChange(value) {
        onFiltersChange({ ...filters, resourceType: String(value) || undefined });
    }
    function handleClearFilters() {
        onFiltersChange({});
    }
    const startDateStr = filters.startDate
        ? new Date(filters.startDate).toISOString().split('T')[0]
        : '';
    const endDateStr = filters.endDate
        ? new Date(filters.endDate).toISOString().split('T')[0]
        : '';
    const hasActiveFilters = filters.startDate || filters.endDate || filters.action || filters.resourceType;
    return (_jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "font-semibold text-gray-900", children: "Filters" }), _jsx("button", { onClick: onClose, className: "text-gray-500 hover:text-gray-700", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4", children: [_jsx(FormField, { label: "Start Date", name: "startDate", type: "text", value: startDateStr, onChange: (value) => handleStartDateChange(value), placeholder: "YYYY-MM-DD" }), _jsx(FormField, { label: "End Date", name: "endDate", type: "text", value: endDateStr, onChange: (value) => handleEndDateChange(value), placeholder: "YYYY-MM-DD" }), _jsx(FormField, { label: "Action", name: "action", type: "select", value: filters.action || '', onChange: handleActionChange, options: [{ label: 'All Actions', value: '' }, ...ACTION_OPTIONS] }), _jsx(FormField, { label: "Resource Type", name: "resourceType", type: "select", value: filters.resourceType || '', onChange: handleResourceTypeChange, options: [{ label: 'All Types', value: '' }, ...RESOURCE_TYPE_OPTIONS] })] }), hasActiveFilters && (_jsx("button", { onClick: handleClearFilters, className: "text-sm text-brand-accentblue hover:underline", children: "Clear all filters" }))] }));
}
//# sourceMappingURL=AuditLogsFilter.js.map