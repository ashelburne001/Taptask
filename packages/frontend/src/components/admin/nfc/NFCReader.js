import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Wifi, AlertCircle, CheckCircle } from 'lucide-react';
import { useNFC } from '../../../hooks/useNFC';
export default function NFCReader() {
    const { isSupported, reading, error, readTag, clearError } = useNFC();
    const [lastRead, setLastRead] = useState(null);
    async function handleRead() {
        clearError();
        const data = await readTag();
        if (data) {
            setLastRead(data);
        }
    }
    if (!isSupported) {
        return (_jsx("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-6", children: _jsx("p", { className: "text-yellow-800", children: "NFC is not supported on this device. Please use Chrome on Android or another NFC-enabled device." }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-2 mb-6", children: [_jsx(Wifi, { className: "w-6 h-6 text-brand-accentblue" }), _jsx("h2", { className: "text-xl font-bold text-gray-900", children: "NFC Tag Reader" })] }), _jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: _jsx("p", { className: "text-sm text-blue-800", children: "Tap an NFC tag to your device to read its contents. The tag must contain valid TapTask data." }) }), error && (_jsxs("div", { className: "p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-start gap-3", children: [_jsx(AlertCircle, { className: "w-5 h-5 flex-shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: "Error reading tag" }), _jsx("p", { className: "text-sm mt-1", children: error })] })] })), _jsxs("button", { onClick: handleRead, disabled: reading, className: "px-6 py-3 bg-brand-accentblue text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2", children: [_jsx(Wifi, { className: "w-5 h-5" }), reading ? 'Waiting for tag...' : 'Read NFC Tag'] }), lastRead && (_jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-lg p-6", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(CheckCircle, { className: "w-5 h-5 text-green-600" }), _jsx("h3", { className: "font-semibold text-gray-900", children: "Tag Data" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Type" }), _jsx("p", { className: "font-medium text-gray-900 capitalize", children: lastRead.type })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Code" }), _jsx("p", { className: "font-medium text-gray-900", children: lastRead.code })] }), lastRead.name && (_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Name" }), _jsx("p", { className: "font-medium text-gray-900", children: lastRead.name })] })), lastRead.quantity && (_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Quantity" }), _jsx("p", { className: "font-medium text-gray-900", children: lastRead.quantity })] })), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Written" }), _jsx("p", { className: "font-medium text-gray-900", children: new Date(lastRead.timestamp).toLocaleString() })] })] }), _jsx("div", { className: "mt-6 p-4 bg-gray-100 rounded font-mono text-xs text-gray-700 overflow-auto", children: _jsx("pre", { children: JSON.stringify(lastRead, null, 2) }) })] }))] }));
}
//# sourceMappingURL=NFCReader.js.map