import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { TrendingUp, AlertTriangle, Clock, Package, Zap, BarChart3, Loader } from 'lucide-react';
export default function SupervisorDashboard() {
    const [kpis, setKpis] = useState(null);
    const [techStats, setTechStats] = useState([]);
    const [inventory, setInventory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    useEffect(() => {
        fetchDashboardData();
    }, []);
    async function fetchDashboardData() {
        try {
            setLoading(true);
            const [kpiData, techData, invData] = await Promise.all([
                apiClient.getDashboardKpis(),
                apiClient.getTechnicianStats(),
                apiClient.getInventoryHealth(),
            ]);
            setKpis(kpiData);
            setTechStats(techData.stats || []);
            setInventory(invData);
        }
        catch (err) {
            console.error('Failed to fetch dashboard data:', err);
        }
        finally {
            setLoading(false);
        }
    }
    const StatCard = ({ icon: Icon, label, value, color = 'blue' }) => (_jsx("div", { className: `card bg-gradient-to-br from-${color}-50 to-${color}-100 border-${color}-200`, children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 mb-1", children: label }), _jsx("p", { className: "text-3xl font-bold text-gray-900", children: value })] }), _jsx(Icon, { className: `w-10 h-10 text-${color}-600` })] }) }));
    if (loading) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsx(Loader, { className: "w-12 h-12 animate-spin text-brand-accentblue" }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 safe-area", children: [_jsxs("div", { className: "bg-brand-navy text-white p-6", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Supervisor Dashboard" }), _jsx("p", { className: "text-blue-200", children: "Real-time operational metrics" })] }), _jsxs("div", { className: "max-w-7xl mx-auto p-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8", children: [_jsx(StatCard, { icon: Package, label: "Open Requests", value: kpis?.openRequests, color: "orange" }), _jsx(StatCard, { icon: TrendingUp, label: "Completed Today", value: kpis?.completedToday, color: "green" }), _jsx(StatCard, { icon: Clock, label: "Avg Response Time (min)", value: kpis?.avgResponseTime, color: "blue" }), _jsx(StatCard, { icon: AlertTriangle, label: "Overdue Requests", value: kpis?.overdueRequests, color: kpis?.overdueRequests ? 'red' : 'gray' })] }), _jsx("div", { className: "bg-white rounded-lg shadow mb-6 border-b border-gray-200", children: _jsx("div", { className: "flex flex-wrap", children: [
                                { id: 'overview', label: 'Overview' },
                                { id: 'technicians', label: 'Technician Performance' },
                                { id: 'inventory', label: 'Inventory Health' },
                            ].map((tab) => (_jsx("button", { onClick: () => setActiveTab(tab.id), className: `flex-1 py-4 px-6 font-medium border-b-2 transition text-center ${activeTab === tab.id
                                    ? 'border-brand-navy text-brand-navy'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'}`, children: tab.label }, tab.id))) }) }), activeTab === 'overview' && (_jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "card", children: [_jsxs("h3", { className: "text-lg font-bold text-gray-900 mb-4 flex items-center gap-2", children: [_jsx(BarChart3, { className: "w-5 h-5" }), "Requests by Department"] }), _jsx("div", { className: "space-y-3", children: kpis?.requestsByDepartment.map((dept) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-gray-700", children: dept.name }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-32 bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-brand-accentblue h-2 rounded-full", style: { width: `${(dept.count / (kpis?.openRequests || 1)) * 100}%` } }) }), _jsx("span", { className: "font-semibold text-gray-900 w-8", children: dept.count })] })] }, dept.name))) })] }), _jsxs("div", { className: "card", children: [_jsxs("h3", { className: "text-lg font-bold text-gray-900 mb-4 flex items-center gap-2", children: [_jsx(TrendingUp, { className: "w-5 h-5" }), "Most Requested Items"] }), _jsx("div", { className: "space-y-2", children: kpis?.mostRequestedItems.map((item, idx) => (_jsxs("div", { className: "flex items-center justify-between p-2 bg-gray-50 rounded", children: [_jsxs("span", { className: "text-gray-700", children: [idx + 1, ". ", item.name] }), _jsx("span", { className: "font-semibold text-brand-accentblue", children: item.count })] }, item.name))) })] })] })), activeTab === 'technicians' && (_jsxs("div", { className: "card", children: [_jsxs("h3", { className: "text-lg font-bold text-gray-900 mb-4 flex items-center gap-2", children: [_jsx(Zap, { className: "w-5 h-5" }), "Technician Performance"] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-200", children: [_jsx("th", { className: "text-left py-3 px-4 text-sm font-semibold text-gray-700", children: "Technician" }), _jsx("th", { className: "text-right py-3 px-4 text-sm font-semibold text-gray-700", children: "Completed" }), _jsx("th", { className: "text-right py-3 px-4 text-sm font-semibold text-gray-700", children: "Avg Response" })] }) }), _jsx("tbody", { children: techStats.map((tech) => (_jsxs("tr", { className: "border-b border-gray-200 hover:bg-gray-50", children: [_jsx("td", { className: "py-3 px-4 text-gray-900 font-medium", children: tech.name }), _jsx("td", { className: "py-3 px-4 text-right text-gray-900 font-semibold", children: tech.completed_count }), _jsxs("td", { className: "py-3 px-4 text-right text-gray-600", children: [Math.round(tech.avg_response_minutes), " min"] })] }, tech.name))) })] }) })] })), activeTab === 'inventory' && (_jsxs("div", { className: "grid md:grid-cols-3 gap-6", children: [_jsxs("div", { className: "card border-l-4 border-red-600", children: [_jsxs("h3", { className: "text-lg font-bold text-red-700 mb-4 flex items-center gap-2", children: [_jsx(AlertTriangle, { className: "w-5 h-5" }), "Critical (", inventory?.critical.count, ")"] }), _jsx("div", { className: "space-y-2 max-h-64 overflow-y-auto", children: inventory?.critical.items.map((item) => (_jsxs("div", { className: "p-2 bg-red-50 rounded text-sm", children: [_jsx("p", { className: "font-medium text-red-900", children: item.name }), _jsxs("p", { className: "text-red-700", children: [item.current_quantity, " / ", item.par_level, " units"] })] }, item.bin_code))) })] }), _jsxs("div", { className: "card border-l-4 border-yellow-600", children: [_jsxs("h3", { className: "text-lg font-bold text-yellow-700 mb-4", children: ["Low Stock (", inventory?.low.count, ")"] }), _jsx("div", { className: "space-y-2 max-h-64 overflow-y-auto", children: inventory?.low.items.map((item) => (_jsxs("div", { className: "p-2 bg-yellow-50 rounded text-sm", children: [_jsx("p", { className: "font-medium text-yellow-900", children: item.name }), _jsxs("p", { className: "text-yellow-700", children: [item.current_quantity, " / ", item.par_level, " units"] })] }, item.bin_code))) })] }), _jsxs("div", { className: "card border-l-4 border-gray-600", children: [_jsxs("h3", { className: "text-lg font-bold text-gray-700 mb-4", children: ["Out of Stock (", inventory?.stockedOut.count, ")"] }), _jsx("div", { className: "space-y-2 max-h-64 overflow-y-auto", children: inventory?.stockedOut.items.map((item) => (_jsxs("div", { className: "p-2 bg-gray-50 rounded text-sm", children: [_jsx("p", { className: "font-medium text-gray-900", children: item.name }), _jsx("p", { className: "text-gray-600", children: item.bin_code })] }, item.bin_code))) })] })] })), _jsx("div", { className: "mt-8 text-center", children: _jsx("button", { onClick: fetchDashboardData, className: "btn-secondary", children: "\uD83D\uDD04 Refresh Data" }) })] })] }));
}
//# sourceMappingURL=SupervisorDashboard.js.map