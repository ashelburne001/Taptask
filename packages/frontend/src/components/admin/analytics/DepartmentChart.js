import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function DepartmentChart({ data }) {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const sorted = [...data].sort((a, b) => b.value - a.value);
    const max = sorted[0].value;
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "bg-gray-50 rounded-lg p-6 min-h-64", children: _jsx("div", { className: "flex items-end justify-between h-48 gap-3", children: sorted.map((item, idx) => {
                        const height = (item.value / max) * 100;
                        return (_jsxs("div", { className: "flex-1 flex flex-col items-center gap-2", children: [_jsx("div", { className: "w-full bg-gradient-to-b from-brand-accentblue to-blue-600 rounded-t relative group", style: { height: `${height}%` }, children: _jsx("div", { className: "hidden group-hover:block absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap", children: item.value }) }), _jsx("p", { className: "text-xs text-gray-600 text-center mt-2 font-medium", children: item.name })] }, idx));
                    }) }) }), _jsx("div", { className: "space-y-2", children: sorted.map((item, idx) => {
                    const percentage = (item.value / total) * 100;
                    return (_jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-3 flex-1", children: [_jsx("div", { className: "w-3 h-3 rounded-full", style: {
                                            backgroundColor: [
                                                '#3b82f6',
                                                '#8b5cf6',
                                                '#ec4899',
                                                '#f59e0b',
                                                '#10b981',
                                            ][idx % 5],
                                        } }), _jsx("p", { className: "font-medium text-gray-900", children: item.name })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "font-bold text-gray-900", children: item.value }), _jsxs("p", { className: "text-xs text-gray-600", children: [percentage.toFixed(1), "%"] })] })] }, idx));
                }) }), _jsxs("div", { className: "grid md:grid-cols-3 gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-600 uppercase mb-1", children: "Top Department" }), _jsx("p", { className: "text-lg font-bold text-gray-900", children: sorted[0].name }), _jsxs("p", { className: "text-sm text-gray-600", children: [sorted[0].value, " requests"] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-600 uppercase mb-1", children: "Total Requests" }), _jsx("p", { className: "text-lg font-bold text-gray-900", children: total }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Across ", data.length, " departments"] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-600 uppercase mb-1", children: "Average" }), _jsx("p", { className: "text-lg font-bold text-gray-900", children: (total / data.length).toFixed(0) }), _jsx("p", { className: "text-sm text-gray-600", children: "Per department" })] })] })] }));
}
//# sourceMappingURL=DepartmentChart.js.map