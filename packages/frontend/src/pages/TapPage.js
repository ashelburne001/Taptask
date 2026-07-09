import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { useAuthStore } from '../store/authStore';
import { Loader, AlertCircle, Package } from 'lucide-react';
export default function TapPage() {
    const { binCode } = useParams();
    const navigate = useNavigate();
    useAuthStore();
    const [bin, setBin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        if (binCode) {
            fetchBin(binCode);
        }
    }, [binCode]);
    async function fetchBin(code) {
        try {
            setLoading(true);
            setError('');
            const { bin } = await apiClient.getBin(code);
            setBin(bin);
            // Auto-navigate to refill form after 1 second
            setTimeout(() => {
                navigate(`/request?binId=${bin.id}`);
            }, 1000);
        }
        catch (err) {
            setError(err.response?.data?.error || 'Bin not found');
            setLoading(false);
        }
    }
    if (loading) {
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-brand-navy to-blue-900 flex items-center justify-center p-4", children: _jsxs("div", { className: "text-center text-white", children: [_jsx(Loader, { className: "w-12 h-12 animate-spin mb-4 mx-auto" }), _jsx("h2", { className: "text-xl font-semibold mb-2", children: "Reading NFC Tag..." }), _jsx("p", { className: "text-blue-200", children: "Please wait" })] }) }));
    }
    if (error) {
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-brand-navy to-blue-900 flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-white rounded-lg p-8 max-w-md w-full text-center", children: [_jsx(AlertCircle, { className: "w-12 h-12 text-red-600 mx-auto mb-4" }), _jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-2", children: "Tag Not Found" }), _jsx("p", { className: "text-gray-600 mb-6", children: error }), _jsx("button", { onClick: () => window.location.reload(), className: "btn-primary", children: "Try Again" })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-brand-navy to-blue-900 flex items-center justify-center p-4", children: _jsx("div", { className: "bg-white rounded-lg p-8 max-w-md w-full", children: _jsxs("div", { className: "text-center", children: [_jsx(Package, { className: "w-12 h-12 text-brand-accentblue mx-auto mb-4" }), _jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: bin?.itemName }), _jsxs("p", { className: "text-gray-600 mb-6", children: [bin?.departmentName, " \u2022 ", bin?.binSize, " units"] }), _jsx(Loader, { className: "w-8 h-8 animate-spin mx-auto text-brand-accentblue" })] }) }) }));
}
//# sourceMappingURL=TapPage.js.map