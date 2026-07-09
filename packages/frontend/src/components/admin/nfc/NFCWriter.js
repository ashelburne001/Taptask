import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Wifi, AlertCircle, CheckCircle } from 'lucide-react';
import { FormField } from '../shared';
import { useNFC } from '../../../hooks/useNFC';
export default function NFCWriter() {
    const { isSupported, writing, error, writeTag, clearError } = useNFC();
    const [tagType, setTagType] = useState('bin');
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [success, setSuccess] = useState(false);
    async function handleWrite() {
        clearError();
        setSuccess(false);
        if (!code.trim()) {
            return;
        }
        const data = {
            type: tagType,
            code: code.trim(),
            name: name.trim() || undefined,
            quantity: quantity ? Number(quantity) : undefined,
            timestamp: Date.now(),
        };
        const result = await writeTag(data);
        if (result) {
            setSuccess(true);
            setCode('');
            setName('');
            setQuantity('');
            setTimeout(() => setSuccess(false), 5000);
        }
    }
    if (!isSupported) {
        return (_jsx("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-6", children: _jsx("p", { className: "text-yellow-800", children: "NFC is not supported on this device. Please use Chrome on Android or another NFC-enabled device." }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-2 mb-6", children: [_jsx(Wifi, { className: "w-6 h-6 text-brand-accentblue" }), _jsx("h2", { className: "text-xl font-bold text-gray-900", children: "NFC Tag Writer" })] }), _jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: _jsx("p", { className: "text-sm text-blue-800", children: "Write data to a blank NFC tag. Have the tag ready and tap it to your device when prompted." }) }), error && (_jsxs("div", { className: "p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-start gap-3", children: [_jsx(AlertCircle, { className: "w-5 h-5 flex-shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: "Error writing tag" }), _jsx("p", { className: "text-sm mt-1", children: error })] })] })), success && (_jsxs("div", { className: "p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 flex items-start gap-3", children: [_jsx(CheckCircle, { className: "w-5 h-5 flex-shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: "Tag written successfully!" }), _jsx("p", { className: "text-sm mt-1", children: "The NFC tag has been programmed with the data." })] })] })), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(FormField, { label: "Tag Type", name: "tagType", type: "select", value: tagType, onChange: (value) => setTagType(value), options: [
                                    { label: 'Bin', value: 'bin' },
                                    { label: 'Item', value: 'item' },
                                ] }), _jsx(FormField, { label: "Code", name: "code", type: "text", value: code, onChange: (value) => setCode(value), placeholder: "BIN-001 or ITEM-12345", required: true })] }), _jsx(FormField, { label: "Name (Optional)", name: "name", type: "text", value: name, onChange: (value) => setName(value), placeholder: "e.g., Surgical Supplies Bin" }), tagType === 'item' && (_jsx(FormField, { label: "Quantity (Optional)", name: "quantity", type: "number", value: quantity, onChange: (value) => setQuantity(value), placeholder: "Number of units" }))] }), _jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-lg p-4", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-3", children: "Tag Data Preview" }), _jsx("div", { className: "p-3 bg-gray-100 rounded font-mono text-xs text-gray-700 overflow-auto", children: _jsx("pre", { children: JSON.stringify({
                                type: tagType,
                                code: code || 'CODE',
                                name: name || undefined,
                                quantity: quantity ? Number(quantity) : undefined,
                                timestamp: new Date().toISOString(),
                            }, null, 2) }) })] }), _jsxs("button", { onClick: handleWrite, disabled: writing || !code.trim(), className: "px-6 py-3 bg-brand-accentblue text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2 w-full justify-center", children: [_jsx(Wifi, { className: "w-5 h-5" }), writing ? 'Writing to tag...' : 'Write to NFC Tag'] })] }));
}
//# sourceMappingURL=NFCWriter.js.map