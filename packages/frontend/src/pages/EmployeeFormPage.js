import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { useAuthStore } from '../store/authStore';
import { CheckCircle, AlertCircle, Camera, Plus, Minus } from 'lucide-react';
export default function EmployeeFormPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const binId = searchParams.get('binId');
    const [_loading, _setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [requestType, setRequestType] = useState('refill');
    const [quantity, setQuantity] = useState(0);
    const [notes, setNotes] = useState('');
    useEffect(() => {
        if (!binId) {
            setError('No bin selected');
            _setLoading(false);
            return;
        }
        // Fetch bin details from database using binId
        // For now, we'll simulate loading
        fetchBinDetails();
    }, [binId]);
    async function fetchBinDetails() {
        try {
            // In a real scenario, we'd fetch from API
            _setLoading(false);
        }
        catch (err) {
            setError('Failed to load bin details');
            _setLoading(false);
        }
    }
    async function handleSubmit(e) {
        e.preventDefault();
        if (!binId || !user)
            return;
        setSubmitting(true);
        setError('');
        try {
            await apiClient.createRequest(binId, requestType, quantity || undefined, notes || undefined);
            setSuccess(true);
            setTimeout(() => {
                navigate('/');
            }, 2000);
        }
        catch (err) {
            setError(err.response?.data?.error || 'Failed to submit request');
        }
        finally {
            setSubmitting(false);
        }
    }
    if (success) {
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-white rounded-lg p-8 max-w-md w-full text-center", children: [_jsx(CheckCircle, { className: "w-16 h-16 text-green-600 mx-auto mb-4" }), _jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Request Submitted!" }), _jsx("p", { className: "text-gray-600 mb-6", children: "A technician will process your request shortly." }), _jsx("p", { className: "text-sm text-gray-500", children: "Redirecting..." })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 safe-area pb-6", children: [_jsxs("div", { className: "bg-brand-navy text-white p-6 sticky top-0 z-10", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Submit Refill Request" }), _jsx("p", { className: "text-blue-200", children: user?.name })] }), _jsx("div", { className: "max-w-2xl mx-auto p-4", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [error && (_jsx("div", { className: "p-4 bg-red-50 border-l-4 border-red-600 rounded", children: _jsxs("div", { className: "flex items-center", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-red-600 mr-3" }), _jsx("p", { className: "text-red-700 font-medium", children: error })] }) })), _jsxs("div", { className: "card", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Request Type" }), _jsx("div", { className: "space-y-3", children: [
                                        { value: 'refill', label: '✅ Request Full Refill', color: 'bg-green-100 border-green-300' },
                                        { value: 'partial_refill', label: '⚠ Partial Refill Needed', color: 'bg-yellow-100 border-yellow-300' },
                                        { value: 'damaged', label: '❌ Damaged Bin', color: 'bg-red-100 border-red-300' },
                                    ].map((type) => (_jsxs("label", { className: `p-4 border-2 rounded-lg cursor-pointer transition ${requestType === type.value
                                            ? type.color
                                            : 'bg-white border-gray-200 hover:border-gray-300'}`, children: [_jsx("input", { type: "radio", name: "requestType", value: type.value, checked: requestType === type.value, onChange: (e) => setRequestType(e.target.value), className: "mr-3" }), type.label] }, type.value))) })] }), requestType !== 'damaged' && (_jsxs("div", { className: "card", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Quantity" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { type: "button", onClick: () => setQuantity(Math.max(0, quantity - 1)), className: "btn-small bg-gray-200 text-gray-700 min-h-12", children: _jsx(Minus, { className: "w-6 h-6" }) }), _jsx("input", { type: "number", min: "0", value: quantity, onChange: (e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0)), className: "input-field text-center flex-1 text-2xl font-bold" }), _jsx("button", { type: "button", onClick: () => setQuantity(quantity + 1), className: "btn-small bg-green-600 text-white min-h-12", children: _jsx(Plus, { className: "w-6 h-6" }) })] })] })), _jsxs("div", { className: "card", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Additional Notes (Optional)" }), _jsx("textarea", { value: notes, onChange: (e) => setNotes(e.target.value), className: "input-field", placeholder: "Add any additional notes...", rows: 3 })] }), _jsxs("div", { className: "card", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "\uD83D\uDCF7 Photo (Optional)" }), _jsxs("button", { type: "button", className: "btn-secondary w-full flex items-center justify-center gap-2", children: [_jsx(Camera, { className: "w-5 h-5" }), "Take Photo"] }), _jsx("p", { className: "text-sm text-gray-600 mt-3", children: "Helpful for damaged items or unusual situations" })] }), _jsxs("div", { className: "flex gap-4", children: [_jsx("button", { type: "submit", disabled: submitting, className: "btn-primary flex-1", children: submitting ? 'Submitting...' : 'Submit Request' }), _jsx("button", { type: "button", onClick: () => navigate('/'), className: "btn-secondary flex-1", children: "Cancel" })] }), _jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800", children: [_jsx("p", { className: "font-semibold mb-2", children: "\u2713 Auto-captured:" }), _jsxs("ul", { className: "space-y-1 text-xs", children: [_jsxs("li", { children: ["\u2022 Date & Time: ", new Date().toLocaleString()] }), _jsxs("li", { children: ["\u2022 User: ", user?.name] }), _jsx("li", { children: "\u2022 Device Location: Automatically recorded" }), _jsx("li", { children: "\u2022 IP Address: Automatically captured" })] })] })] }) })] }));
}
//# sourceMappingURL=EmployeeFormPage.js.map