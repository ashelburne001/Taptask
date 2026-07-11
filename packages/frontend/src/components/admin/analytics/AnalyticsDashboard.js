import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { TrendingUp, AlertCircle, RefreshCw, Download } from 'lucide-react';
import { useAnalytics } from '../../../hooks/useAnalytics';
import MetricsGrid from './MetricsGrid';
import InventoryChart from './InventoryChart';
import RequestsTrendChart from './RequestsTrendChart';
import UserActivityChart from './UserActivityChart';
import DepartmentChart from './DepartmentChart';
export default function AnalyticsDashboard() {
    const { metrics, chartData, loading, error, fetchAnalytics, clearError } = useAnalytics();
    const [dateRange, setDateRange] = useState('week');
    const [exporting, setExporting] = useState(false);
    useEffect(() => {
        fetchAnalytics();
    }, []);
    async function handleRefresh() {
        await fetchAnalytics();
    }
    async function handleExport() {
        setExporting(true);
        try {
            // TODO: Implement analytics export
            const data = {
                metrics,
                chartData,
                exportedAt: new Date().toISOString(),
            };
            const dataStr = JSON.stringify(data, null, 2);
            downloadFile(dataStr, 'analytics.json', 'application/json');
        }
        finally {
            setExporting(false);
        }
    }
    return (_jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Analytics Dashboard" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Real-time insights and system performance" })] }), _jsxs("div", { className: "flex gap-3", children: [_jsxs("button", { onClick: handleRefresh, disabled: loading, className: "px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 flex items-center gap-2", children: [_jsx(RefreshCw, { className: "w-5 h-5" }), "Refresh"] }), _jsxs("button", { onClick: handleExport, disabled: exporting || !metrics, className: "px-4 py-2 bg-brand-accentblue text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2", children: [_jsx(Download, { className: "w-5 h-5" }), "Export"] })] })] }), error && (_jsxs("div", { className: "p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-start gap-3", children: [_jsx(AlertCircle, { className: "w-5 h-5 flex-shrink-0 mt-0.5" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "font-medium", children: "Error loading analytics" }), _jsx("p", { className: "text-sm mt-1", children: error })] }), _jsx("button", { onClick: clearError, className: "text-red-600 hover:text-red-800 font-medium text-sm", children: "Dismiss" })] })), _jsx("div", { className: "flex gap-2", children: ['week', 'month', 'quarter'].map((range) => (_jsx("button", { onClick: () => setDateRange(range), className: `px-4 py-2 rounded-lg transition capitalize ${dateRange === range
                        ? 'bg-brand-accentblue text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`, children: range }, range))) }), loading && (_jsx("div", { className: "grid md:grid-cols-2 gap-6", children: [1, 2, 3, 4].map((i) => (_jsx("div", { className: "h-40 bg-gray-200 rounded-lg animate-pulse" }, i))) })), !loading && metrics && (_jsxs(_Fragment, { children: [_jsx(MetricsGrid, { metrics: metrics }), _jsxs("div", { className: "grid lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsxs("div", { className: "flex items-center gap-2 mb-6", children: [_jsx(TrendingUp, { className: "w-5 h-5 text-brand-accentblue" }), _jsx("h2", { className: "text-lg font-bold text-gray-900", children: "Inventory Status" })] }), _jsx(InventoryChart, { data: chartData.inventoryStatus })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsxs("div", { className: "flex items-center gap-2 mb-6", children: [_jsx(TrendingUp, { className: "w-5 h-5 text-brand-accentblue" }), _jsx("h2", { className: "text-lg font-bold text-gray-900", children: "User Activity" })] }), _jsx(UserActivityChart, { data: chartData.userActivity })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsxs("div", { className: "flex items-center gap-2 mb-6", children: [_jsx(TrendingUp, { className: "w-5 h-5 text-brand-accentblue" }), _jsx("h2", { className: "text-lg font-bold text-gray-900", children: "Requests Trend (7 Days)" })] }), _jsx(RequestsTrendChart, { data: chartData.requestsTrend })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsxs("div", { className: "flex items-center gap-2 mb-6", children: [_jsx(TrendingUp, { className: "w-5 h-5 text-brand-accentblue" }), _jsx("h2", { className: "text-lg font-bold text-gray-900", children: "Department Performance" })] }), _jsx(DepartmentChart, { data: chartData.departmentPerformance })] })] }))] }));
}
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}
//# sourceMappingURL=AnalyticsDashboard.js.map