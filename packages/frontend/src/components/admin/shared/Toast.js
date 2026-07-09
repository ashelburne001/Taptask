import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
export default function Toast({ message, type = 'info', onClose, duration = 3000, }) {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);
    const bgColor = {
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
        info: 'bg-blue-50 border-blue-200',
    }[type];
    const textColor = {
        success: 'text-green-800',
        error: 'text-red-800',
        info: 'text-blue-800',
    }[type];
    const Icon = {
        success: CheckCircle,
        error: AlertCircle,
        info: AlertCircle,
    }[type];
    return (_jsxs("div", { className: `fixed bottom-4 right-4 flex items-center gap-3 px-4 py-3 rounded-lg border ${bgColor} shadow-lg z-50`, children: [_jsx(Icon, { className: `w-5 h-5 ${textColor}` }), _jsx("p", { className: `${textColor} font-medium`, children: message }), _jsx("button", { onClick: onClose, className: `${textColor} hover:opacity-70 transition`, children: _jsx(X, { className: "w-4 h-4" }) })] }));
}
//# sourceMappingURL=Toast.js.map