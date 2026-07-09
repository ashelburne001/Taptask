import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Wifi, Radio, Upload } from 'lucide-react';
import NFCReader from './NFCReader';
import NFCWriter from './NFCWriter';
import NFCBulkAssign from './NFCBulkAssign';
export default function NFCManagementPage() {
    const [activeTab, setActiveTab] = useState('read');
    const tabs = [
        { id: 'read', label: 'Read', icon: _jsx(Radio, { className: "w-5 h-5" }) },
        { id: 'write', label: 'Write', icon: _jsx(Wifi, { className: "w-5 h-5" }) },
        { id: 'bulk', label: 'Bulk Assign', icon: _jsx(Upload, { className: "w-5 h-5" }) },
    ];
    return (_jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "NFC Management" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Read, write, and manage NFC tags for inventory items" })] }), _jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: _jsxs("p", { className: "text-sm text-blue-800", children: [_jsx("strong", { children: "Note:" }), " NFC functionality requires Chrome on Android or another NFC-enabled device. Desktop browsers may not support NFC operations."] }) }), _jsx("div", { className: "bg-white rounded-lg shadow border-b border-gray-200", children: _jsx("div", { className: "flex flex-wrap gap-0", children: tabs.map((tab) => (_jsxs("button", { onClick: () => setActiveTab(tab.id), className: `flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition ${activeTab === tab.id
                            ? 'border-brand-navy text-brand-navy'
                            : 'border-transparent text-gray-600 hover:text-gray-900'}`, children: [tab.icon, tab.label] }, tab.id))) }) }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [activeTab === 'read' && _jsx(NFCReader, {}), activeTab === 'write' && _jsx(NFCWriter, {}), activeTab === 'bulk' && _jsx(NFCBulkAssign, {})] }), _jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-lg p-4", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-2", children: "\uD83D\uDCD6 Read" }), _jsx("p", { className: "text-sm text-gray-600", children: "Scan existing NFC tags to view their data and verify tag contents." })] }), _jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-lg p-4", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-2", children: "\u270F\uFE0F Write" }), _jsx("p", { className: "text-sm text-gray-600", children: "Program blank NFC tags with bin and item codes for your inventory system." })] }), _jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-lg p-4", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-2", children: "\uD83D\uDCCA Bulk" }), _jsx("p", { className: "text-sm text-gray-600", children: "Assign NFC tag codes to multiple inventory items using CSV import." })] })] })] }));
}
//# sourceMappingURL=NFCManagementPage.js.map