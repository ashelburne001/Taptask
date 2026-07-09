import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
export default function NotFound() {
    const navigate = useNavigate();
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-brand-navy to-blue-900 flex items-center justify-center p-4", children: _jsxs("div", { className: "text-center", children: [_jsx(AlertCircle, { className: "w-20 h-20 text-white mx-auto mb-6 opacity-80" }), _jsx("h1", { className: "text-5xl font-bold text-white mb-4", children: "404" }), _jsx("h2", { className: "text-2xl font-semibold text-blue-100 mb-2", children: "Page Not Found" }), _jsx("p", { className: "text-blue-200 mb-8", children: "The page you're looking for doesn't exist." }), _jsxs("button", { onClick: () => navigate('/'), className: "btn-primary inline-flex items-center gap-2", children: [_jsx(Home, { className: "w-5 h-5" }), "Back to Home"] })] }) }));
}
//# sourceMappingURL=NotFound.js.map