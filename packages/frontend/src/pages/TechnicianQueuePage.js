import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { useAuthStore } from '../store/authStore';
import { Clock, AlertCircle, CheckCircle, Zap, Loader } from 'lucide-react';
export default function TechnicianQueuePage() {
    const { user } = useAuthStore();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('pending');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    useEffect(() => {
        fetchRequests();
    }, []);
    async function fetchRequests() {
        try {
            setLoading(true);
            const { requests } = await apiClient.listRequests();
            setRequests(requests);
        }
        catch (err) {
            console.error('Failed to fetch requests:', err);
        }
        finally {
            setLoading(false);
        }
    }
    async function handleAccept(requestId) {
        try {
            setSubmitting(true);
            await apiClient.updateRequest(requestId, {
                status: 'assigned',
                assignedTechnicianId: user?.id,
            });
            await fetchRequests();
        }
        catch (err) {
            console.error('Failed to accept request:', err);
        }
        finally {
            setSubmitting(false);
        }
    }
    async function handleStart(requestId) {
        try {
            setSubmitting(true);
            await apiClient.updateRequest(requestId, { status: 'in_progress' });
            await fetchRequests();
        }
        catch (err) {
            console.error('Failed to start request:', err);
        }
        finally {
            setSubmitting(false);
        }
    }
    async function handleComplete(requestId, quantityFilled) {
        try {
            setSubmitting(true);
            await apiClient.updateRequest(requestId, {
                status: 'completed',
                quantityFilled,
            });
            await fetchRequests();
            setSelectedRequest(null);
        }
        catch (err) {
            console.error('Failed to complete request:', err);
        }
        finally {
            setSubmitting(false);
        }
    }
    function getPriorityColor(priority) {
        const colors = {
            critical: 'bg-red-100 text-red-800',
            high: 'bg-orange-100 text-orange-800',
            normal: 'bg-blue-100 text-blue-800',
            low: 'bg-gray-100 text-gray-800',
        };
        return colors[priority] || colors.normal;
    }
    function getStatusIcon(status) {
        const icons = {
            pending: _jsx(Clock, { className: "w-5 h-5 text-yellow-600" }),
            assigned: _jsx(Zap, { className: "w-5 h-5 text-blue-600" }),
            in_progress: _jsx(Loader, { className: "w-5 h-5 animate-spin text-green-600" }),
            completed: _jsx(CheckCircle, { className: "w-5 h-5 text-green-600" }),
        };
        return icons[status] || icons.pending;
    }
    const filteredRequests = requests.filter((r) => {
        if (selectedTab === 'pending')
            return r.status === 'pending';
        if (selectedTab === 'in_progress')
            return r.status === 'in_progress' || r.status === 'assigned';
        return r.status === 'completed';
    });
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 safe-area", children: [_jsxs("div", { className: "bg-brand-navy text-white p-6 sticky top-0 z-10", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Refill Queue" }), _jsxs("p", { className: "text-blue-200", children: ["Technician: ", user?.name] })] }), _jsx("div", { className: "bg-white border-b border-gray-200 sticky top-20 z-10", children: _jsx("div", { className: "max-w-4xl mx-auto flex", children: [
                        { id: 'pending', label: 'Pending', count: requests.filter((r) => r.status === 'pending').length },
                        {
                            id: 'in_progress',
                            label: 'In Progress',
                            count: requests.filter((r) => r.status === 'in_progress' || r.status === 'assigned').length,
                        },
                        { id: 'completed', label: 'Completed', count: requests.filter((r) => r.status === 'completed').length },
                    ].map((tab) => (_jsxs("button", { onClick: () => setSelectedTab(tab.id), className: `flex-1 py-4 font-medium border-b-2 transition ${selectedTab === tab.id
                            ? 'border-brand-navy text-brand-navy'
                            : 'border-transparent text-gray-600'}`, children: [tab.label, _jsx("span", { className: "ml-2 bg-gray-200 rounded-full px-2 py-1 text-sm", children: tab.count })] }, tab.id))) }) }), _jsx("div", { className: "max-w-4xl mx-auto p-4", children: loading ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(Loader, { className: "w-12 h-12 animate-spin text-brand-accentblue mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "Loading requests..." })] })) : filteredRequests.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(AlertCircle, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "No requests in this category" })] })) : (_jsx("div", { className: "space-y-4", children: filteredRequests.map((request) => (_jsx("div", { className: "bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer border-l-4 border-brand-accentblue", onClick: () => setSelectedRequest(selectedRequest === request.id ? null : request.id), children: _jsxs("div", { className: "p-4 md:p-6", children: [_jsx("div", { className: "flex items-start justify-between gap-4", children: _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [getStatusIcon(request.status), _jsx("h3", { className: "font-bold text-gray-900 text-lg truncate", children: request.itemName })] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 uppercase", children: "Bin" }), _jsx("p", { className: "font-medium text-gray-900", children: request.binCode })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 uppercase", children: "Department" }), _jsx("p", { className: "font-medium text-gray-900", children: request.departmentName })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 uppercase", children: "Quantity" }), _jsx("p", { className: "font-medium text-gray-900", children: request.quantityRequested })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 uppercase", children: "Priority" }), _jsx("span", { className: `badge ${getPriorityColor(request.priority)}`, children: request.priority })] })] })] }) }), selectedRequest === request.id && (_jsxs("div", { className: "mt-6 pt-6 border-t border-gray-200 space-y-4", children: [_jsxs("div", { className: "grid md:grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-600", children: "Requested by" }), _jsx("p", { className: "font-medium text-gray-900", children: request.employeeName })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-600", children: "Requested at" }), _jsx("p", { className: "font-medium text-gray-900", children: new Date(request.requestedAt).toLocaleString() })] })] }), request.notes && (_jsxs("div", { children: [_jsx("p", { className: "text-gray-600 text-sm", children: "Notes" }), _jsx("p", { className: "bg-blue-50 p-3 rounded text-gray-800", children: request.notes })] })), _jsxs("div", { className: "flex flex-col gap-3 pt-4", children: [request.status === 'pending' && (_jsx("button", { onClick: () => handleAccept(request.id), disabled: submitting, className: "btn-success", children: "Accept Request" })), request.status === 'assigned' && (_jsx("button", { onClick: () => handleStart(request.id), disabled: submitting, className: "btn-primary", children: "Start Filling" })), request.status === 'in_progress' && (_jsx("button", { onClick: () => handleComplete(request.id, request.quantityRequested), disabled: submitting, className: "btn-success", children: "Mark Complete" }))] })] }))] }) }, request.id))) })) })] }));
}
//# sourceMappingURL=TechnicianQueuePage.js.map