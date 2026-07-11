import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const COLORS = ['#10b981', '#f59e0b', '#ef4444'];
export default function InventoryChart({ data }) {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const percentages = data.map((item) => (item.value / total) * 100);
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex justify-center", children: _jsxs("div", { className: "relative w-48 h-48", children: [_jsx("svg", { viewBox: "0 0 100 100", className: "w-full h-full transform -rotate-90", children: data.map((item, idx) => {
                                let offset = 0;
                                for (let i = 0; i < idx; i++) {
                                    offset += (data[i].value / total) * 360;
                                }
                                const angle = (item.value / total) * 360;
                                const radius = 30;
                                const circumference = 2 * Math.PI * radius;
                                return (_jsx("circle", { cx: "50", cy: "50", r: radius, fill: "none", stroke: COLORS[idx % COLORS.length], strokeWidth: "20", strokeDasharray: (angle / 360) * circumference, strokeDashoffset: -(offset / 360) * circumference, style: {
                                        transition: 'all 0.3s ease',
                                    } }, idx));
                            }) }), _jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-3xl font-bold text-gray-900", children: total }), _jsx("p", { className: "text-sm text-gray-600", children: "Total Items" })] }) })] }) }), _jsx("div", { className: "space-y-2", children: data.map((item, idx) => (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-4 h-4 rounded-full", style: { backgroundColor: COLORS[idx % COLORS.length] } }), _jsx("div", { className: "flex-1", children: _jsx("p", { className: "text-sm font-medium text-gray-900", children: item.name }) }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-sm font-bold text-gray-900", children: item.value }), _jsxs("p", { className: "text-xs text-gray-600", children: [percentages[idx].toFixed(1), "%"] })] })] }, idx))) })] }));
}
//# sourceMappingURL=InventoryChart.js.map