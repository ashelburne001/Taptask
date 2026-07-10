import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Download, Filter, AlertCircle } from 'lucide-react';
import { useAuditLogs } from '../../../hooks/useAuditLogs';
import { SearchBar } from '../shared';
import AuditLogsFilter from './AuditLogsFilter';
import AuditLogsTable from './AuditLogsTable';
import AuditLogDetailModal from './AuditLogDetailModal';
export default function AuditLogsPage() {
    const { logs, loading, error, total, fetchLogs, exportLogs, clearError } = useAuditLogs();
    const [filters, setFilters] = useState({});
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);
    const [exporting, setExporting] = useState(false);
    useEffect(() => {
        fetchLogs(filters);
    }, [filters]);
    async function handleExport(format) {
        setExporting(true);
        try {
            await exportLogs(format, filters);
        }
        finally {
            setExporting(false);
        }
    }
    function handleSearch(value) {
        setFilters({ ...filters, search: value });
    }
    return (_jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Audit Logs" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Track all system activity and user actions" })] }), error && (_jsxs("div", { className: "p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-start gap-3", children: [_jsx(AlertCircle, { className: "w-5 h-5 flex-shrink-0 mt-0.5" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "font-medium", children: "Error loading audit logs" }), _jsx("p", { className: "text-sm mt-1", children: error })] }), _jsx("button", { onClick: clearError, className: "text-red-600 hover:text-red-800 font-medium text-sm", children: "Dismiss" })] })), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex flex-col md:flex-row gap-4", children: [_jsx("div", { className: "flex-1", children: _jsx(SearchBar, { onSearch: handleSearch, placeholder: "Search logs..." }) }), _jsxs("button", { onClick: () => setShowFilterPanel(!showFilterPanel), className: "px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2", children: [_jsx(Filter, { className: "w-5 h-5" }), "Filters"] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: () => handleExport('csv'), disabled: exporting || logs.length === 0, className: "px-4 py-2 bg-brand-accentblue text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2", children: [_jsx(Download, { className: "w-5 h-5" }), "CSV"] }), _jsxs("button", { onClick: () => handleExport('json'), disabled: exporting || logs.length === 0, className: "px-4 py-2 bg-brand-accentblue text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2", children: [_jsx(Download, { className: "w-5 h-5" }), "JSON"] })] })] }), showFilterPanel && (_jsx(AuditLogsFilter, { filters: filters, onFiltersChange: setFilters, onClose: () => setShowFilterPanel(false) }))] }), _jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: _jsxs("p", { className: "text-sm text-blue-800", children: ["Showing ", _jsx("strong", { children: logs.length }), " of ", _jsx("strong", { children: total }), " audit logs"] }) }), loading && (_jsx("div", { className: "bg-white rounded-lg shadow p-6", children: _jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => (_jsx("div", { className: "h-12 bg-gray-200 rounded animate-pulse" }, i))) }) })), !loading && logs.length === 0 && (_jsxs("div", { className: "bg-white rounded-lg shadow p-12 text-center", children: [_jsx(AlertCircle, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "No audit logs found" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Try adjusting your filters" })] })), !loading && logs.length > 0 && (_jsx("div", { className: "bg-white rounded-lg shadow overflow-hidden", children: _jsx(AuditLogsTable, { logs: logs, onSelectLog: setSelectedLog }) })), selectedLog && (_jsx(AuditLogDetailModal, { log: selectedLog, onClose: () => setSelectedLog(null) }))] }));
}
//# sourceMappingURL=AuditLogsPage.js.map