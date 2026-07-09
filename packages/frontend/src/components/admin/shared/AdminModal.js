import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { X } from 'lucide-react';
export default function AdminModal({ isOpen, title, onClose, onSubmit, submitLabel = 'Save', loading = false, children, size = 'md', }) {
    if (!isOpen)
        return null;
    const sizeClass = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
    }[size];
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 z-40", onClick: onClose }), _jsx("div", { className: "fixed inset-0 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: `bg-white rounded-lg shadow-xl w-full ${sizeClass}`, children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b border-gray-200", children: [_jsx("h2", { className: "text-lg font-bold text-gray-900", children: title }), _jsx("button", { onClick: onClose, className: "p-1 hover:bg-gray-100 rounded-lg transition", children: _jsx(X, { className: "w-5 h-5 text-gray-500" }) })] }), _jsx("div", { className: "p-6", children: children }), _jsxs("div", { className: "flex gap-3 justify-end p-6 border-t border-gray-200", children: [_jsx("button", { onClick: onClose, disabled: loading, className: "px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50", children: "Cancel" }), onSubmit && (_jsx("button", { onClick: onSubmit, disabled: loading, className: "px-4 py-2 text-white bg-brand-accentblue hover:bg-blue-700 rounded-lg transition disabled:opacity-50", children: loading ? 'Saving...' : submitLabel }))] })] }) })] }));
}
//# sourceMappingURL=AdminModal.js.map