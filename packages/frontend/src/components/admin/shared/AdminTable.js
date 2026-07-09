import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
export default function AdminTable({ columns, data, loading = false, onRowClick, rowActions, }) {
    const [sortKey, setSortKey] = useState(null);
    const [sortDir, setSortDir] = useState('asc');
    const handleSort = (key) => {
        if (sortKey === key) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        }
        else {
            setSortKey(key);
            setSortDir('asc');
        }
    };
    const sortedData = [...data].sort((a, b) => {
        if (!sortKey)
            return 0;
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (aVal === bVal)
            return 0;
        const comparison = aVal < bVal ? -1 : 1;
        return sortDir === 'asc' ? comparison : -comparison;
    });
    if (loading) {
        return (_jsx("div", { className: "bg-white rounded-lg shadow", children: _jsx("div", { className: "p-6 space-y-4", children: [...Array(5)].map((_, i) => (_jsx("div", { className: "h-12 bg-gray-200 rounded animate-pulse" }, i))) }) }));
    }
    return (_jsx("div", { className: "bg-white rounded-lg shadow overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50 border-b border-gray-200", children: _jsxs("tr", { children: [columns.map((col) => (_jsx("th", { className: `px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${col.sortable ? 'cursor-pointer hover:bg-gray-100' : ''} ${col.width || ''}`, onClick: () => col.sortable && handleSort(String(col.key)), children: _jsxs("div", { className: "flex items-center gap-2", children: [col.label, col.sortable && sortKey === String(col.key) && (sortDir === 'asc' ? (_jsx(ChevronUp, { className: "w-4 h-4" })) : (_jsx(ChevronDown, { className: "w-4 h-4" })))] }) }, String(col.key)))), rowActions && _jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: sortedData.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: columns.length + (rowActions ? 1 : 0), className: "px-6 py-12 text-center text-gray-500", children: "No data available" }) })) : (sortedData.map((row) => (_jsxs("tr", { className: "hover:bg-gray-50 transition", onClick: () => onRowClick?.(row), children: [columns.map((col) => (_jsx("td", { className: `px-6 py-4 text-sm text-gray-900 ${col.width || ''}`, children: col.render ? col.render(row[String(col.key)], row) : String(row[String(col.key)] || '') }, String(col.key)))), rowActions && (_jsx("td", { className: "px-6 py-4 text-right space-x-2", children: rowActions(row) }))] }, row.id)))) })] }) }) }));
}
//# sourceMappingURL=AdminTable.js.map