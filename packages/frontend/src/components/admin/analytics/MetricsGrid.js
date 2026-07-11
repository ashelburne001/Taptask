import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Package, Users, TrendingUp, Clock, AlertTriangle, DollarSign } from 'lucide-react';
export default function MetricsGrid({ metrics }) {
    const cards = [
        {
            label: 'Total Items',
            value: metrics.totalItems,
            icon: _jsx(Package, { className: "w-6 h-6" }),
            color: 'bg-blue-50 border-blue-200',
            trend: 5,
        },
        {
            label: 'Low Stock Items',
            value: metrics.lowStockItems,
            icon: _jsx(AlertTriangle, { className: "w-6 h-6 text-orange-600" }),
            color: 'bg-orange-50 border-orange-200',
            trend: -2,
        },
        {
            label: 'Total Users',
            value: metrics.totalUsers,
            icon: _jsx(Users, { className: "w-6 h-6" }),
            color: 'bg-green-50 border-green-200',
            trend: 8,
        },
        {
            label: 'Active Users',
            value: metrics.activeUsers,
            icon: _jsx(TrendingUp, { className: "w-6 h-6 text-green-600" }),
            color: 'bg-green-50 border-green-200',
            trend: 3,
        },
        {
            label: 'Completion Rate',
            value: metrics.completionRate,
            unit: '%',
            icon: _jsx(TrendingUp, { className: "w-6 h-6 text-purple-600" }),
            color: 'bg-purple-50 border-purple-200',
            trend: 2.1,
        },
        {
            label: 'Avg Response Time',
            value: metrics.averageResponseTime,
            unit: 'hrs',
            icon: _jsx(Clock, { className: "w-6 h-6 text-indigo-600" }),
            color: 'bg-indigo-50 border-indigo-200',
            trend: -0.5,
        },
        {
            label: 'Inventory Value',
            value: `$${(metrics.inventoryValue / 1000).toFixed(1)}k`,
            icon: _jsx(DollarSign, { className: "w-6 h-6 text-yellow-600" }),
            color: 'bg-yellow-50 border-yellow-200',
            trend: 12.3,
        },
        {
            label: 'Pending Requests',
            value: metrics.pendingRequests,
            icon: _jsx(TrendingUp, { className: "w-6 h-6 text-red-600" }),
            color: 'bg-red-50 border-red-200',
            trend: -5,
        },
    ];
    return (_jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-4 gap-4", children: cards.map((card, idx) => (_jsxs("div", { className: `border rounded-lg p-4 ${card.color} transition hover:shadow-md`, children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsx("div", { className: "p-2 bg-white rounded-lg", children: card.icon }), card.trend && (_jsxs("span", { className: `text-xs font-semibold px-2 py-1 rounded ${card.trend > 0
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'}`, children: [card.trend > 0 ? '+' : '', card.trend, "%"] }))] }), _jsx("p", { className: "text-sm text-gray-600 mb-1", children: card.label }), _jsxs("p", { className: "text-2xl font-bold text-gray-900", children: [card.value, card.unit && _jsx("span", { className: "text-sm text-gray-600 ml-1", children: card.unit })] })] }, idx))) }));
}
//# sourceMappingURL=MetricsGrid.js.map