import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];
export default function UserActivityChart({ data }) {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "space-y-4", children: data.map((item, idx) => {
                    const percentage = (item.value / total) * 100;
                    return (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center mb-1", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: item.name }), _jsx("p", { className: "text-sm font-bold text-gray-600", children: item.value })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-3 overflow-hidden", children: _jsx("div", { className: "h-full rounded-full transition-all duration-300", style: {
                                        width: `${percentage}%`,
                                        backgroundColor: COLORS[idx % COLORS.length],
                                    } }) }), _jsxs("p", { className: "text-xs text-gray-500", children: [percentage.toFixed(1), "% of total"] })] }, idx));
                }) }), _jsxs("div", { className: "bg-gray-50 rounded-lg p-4 space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("p", { className: "text-sm text-gray-600", children: "Total Active Users" }), _jsx("p", { className: "text-lg font-bold text-gray-900", children: total })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("p", { className: "text-sm text-gray-600", children: "Most Active Role" }), _jsx("p", { className: "text-lg font-bold text-gray-900", children: data.reduce((max, item) => (item.value > max.value ? item : max)).name })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("p", { className: "text-sm text-gray-600", children: "Least Active Role" }), _jsx("p", { className: "text-lg font-bold text-gray-900", children: data.reduce((min, item) => (item.value < min.value ? item : min)).name })] })] })] }));
}
//# sourceMappingURL=UserActivityChart.js.map