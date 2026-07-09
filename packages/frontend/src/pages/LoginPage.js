import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { useAuthStore } from '../store/authStore';
import { Lock, Mail, AlertCircle } from 'lucide-react';
export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const [email, setEmail] = useState('admin@hospital.local');
    const [password, setPassword] = useState('admin123');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    async function handleLogin(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const result = await apiClient.login(email, password);
            login(result.token, result.user);
            navigate('/', { replace: true });
        }
        catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-brand-navy to-blue-900 flex items-center justify-center p-4", children: _jsxs("div", { className: "w-full max-w-md", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4", children: _jsx("span", { className: "text-2xl font-bold text-brand-navy", children: "\uD83D\uDCF1" }) }), _jsx("h1", { className: "text-3xl font-bold text-white mb-2", children: "TapTask" }), _jsx("p", { className: "text-blue-200", children: "NFC-powered Kanban Replenishment" })] }), _jsxs("div", { className: "card bg-white", children: [_jsxs("form", { onSubmit: handleLogin, className: "space-y-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [_jsx(Mail, { className: "inline w-4 h-4 mr-2" }), "Email"] }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "input-field", placeholder: "admin@hospital.local", required: true })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [_jsx(Lock, { className: "inline w-4 h-4 mr-2" }), "Password"] }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), className: "input-field", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", required: true })] }), error && (_jsxs("div", { className: "p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" }), _jsx("p", { className: "text-sm text-red-700", children: error })] })), _jsx("button", { type: "submit", className: "btn-primary w-full", disabled: loading, children: loading ? 'Signing in...' : 'Sign In' })] }), _jsxs("div", { className: "mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200", children: [_jsx("p", { className: "text-sm font-semibold text-blue-900 mb-2", children: "Demo Credentials:" }), _jsxs("div", { className: "space-y-1 text-sm text-blue-800", children: [_jsxs("p", { children: [_jsx("strong", { children: "Admin:" }), " admin@hospital.local / admin123"] }), _jsxs("p", { children: [_jsx("strong", { children: "Technician:" }), " tech@hospital.local / tech123"] }), _jsxs("p", { children: [_jsx("strong", { children: "Employee:" }), " emp@hospital.local / emp123"] })] })] })] }), _jsx("p", { className: "text-center text-blue-200 text-sm mt-6", children: "Healthcare Inventory Management System" })] }) }));
}
//# sourceMappingURL=LoginPage.js.map