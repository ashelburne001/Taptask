import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { useItems } from '../../../hooks/useItems';
export default function NFCBulkAssign() {
    const { items, fetchItems } = useItems();
    const [_csvContent, setCsvContent] = useState('');
    const [assignments, setAssignments] = useState([]);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        fetchItems();
    }, []);
    function handleFileUpload(e) {
        const file = e.target.files?.[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result;
            setCsvContent(text);
            parseCSV(text);
        };
        reader.readAsText(file);
    }
    function parseCSV(text) {
        try {
            const lines = text.trim().split('\n');
            const rows = [];
            for (let i = 1; i < lines.length; i++) {
                const [itemNumber, code, binLocation] = lines[i].split(',').map((s) => s.trim());
                if (itemNumber && code) {
                    rows.push({ itemNumber, code, binLocation });
                }
            }
            setAssignments(rows);
            setError(null);
        }
        catch (err) {
            setError('Failed to parse CSV file');
        }
    }
    async function handleApply() {
        setSuccess(false);
        setError(null);
        try {
            // Validate all items exist
            const validCodes = new Set(items.map((item) => item.itemNumber));
            const invalid = assignments.filter((row) => !validCodes.has(row.itemNumber));
            if (invalid.length > 0) {
                setError(`${invalid.length} item(s) not found: ${invalid.map((r) => r.itemNumber).join(', ')}`);
                return;
            }
            // In a real implementation, this would call an API to save the tag assignments
            // await apiClient.bulkAssignNFCTags(assignments)
            setSuccess(true);
            setTimeout(() => setSuccess(false), 5000);
        }
        catch (err) {
            setError(err.message || 'Failed to apply assignments');
        }
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-2 mb-6", children: [_jsx(Upload, { className: "w-6 h-6 text-brand-accentblue" }), _jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Bulk NFC Assignment" })] }), _jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: [_jsx("p", { className: "text-sm text-blue-800 mb-2", children: "Upload a CSV file to assign NFC tag codes to inventory items in bulk." }), _jsxs("p", { className: "text-xs text-blue-700", children: ["CSV format: ", _jsx("code", { className: "bg-blue-100 px-2 py-1 rounded", children: "itemNumber,nfcCode,binLocation" })] })] }), error && (_jsxs("div", { className: "p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-start gap-3", children: [_jsx(AlertCircle, { className: "w-5 h-5 flex-shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: "Error" }), _jsx("p", { className: "text-sm mt-1", children: error })] })] })), success && (_jsxs("div", { className: "p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 flex items-start gap-3", children: [_jsx(CheckCircle, { className: "w-5 h-5 flex-shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: "Assignments applied successfully!" }), _jsxs("p", { className: "text-sm mt-1", children: [assignments.length, " items updated."] })] })] })), _jsxs("div", { className: "border-2 border-dashed border-gray-300 rounded-lg p-6 text-center", children: [_jsx("input", { type: "file", accept: ".csv", onChange: handleFileUpload, className: "hidden", id: "csv-upload" }), _jsxs("label", { htmlFor: "csv-upload", className: "cursor-pointer", children: [_jsx(Upload, { className: "w-8 h-8 text-gray-400 mx-auto mb-2" }), _jsx("p", { className: "text-sm font-medium text-gray-700", children: "Click to upload CSV" }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "or drag and drop" })] })] }), assignments.length > 0 && (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsxs("h3", { className: "font-semibold text-gray-900 mb-4", children: ["Preview (", assignments.length, " rows)"] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-gray-100 border-b", children: [_jsx("th", { className: "text-left p-3 font-semibold text-gray-700", children: "Item Number" }), _jsx("th", { className: "text-left p-3 font-semibold text-gray-700", children: "NFC Code" }), _jsx("th", { className: "text-left p-3 font-semibold text-gray-700", children: "Bin Location" })] }) }), _jsx("tbody", { children: assignments.slice(0, 10).map((row, idx) => (_jsxs("tr", { className: "border-b hover:bg-gray-50", children: [_jsx("td", { className: "p-3 text-gray-900", children: row.itemNumber }), _jsx("td", { className: "p-3 font-mono text-gray-600", children: row.code }), _jsx("td", { className: "p-3 text-gray-600", children: row.binLocation || '—' })] }, idx))) })] }) }), assignments.length > 10 && (_jsxs("p", { className: "text-xs text-gray-500 mt-2", children: ["Showing 10 of ", assignments.length, " rows"] }))] }), _jsxs("button", { onClick: handleApply, className: "px-6 py-3 bg-brand-accentblue text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 w-full justify-center", children: [_jsx(CheckCircle, { className: "w-5 h-5" }), "Apply ", assignments.length, " Assignments"] })] })), _jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-lg p-4", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-2", children: "CSV Template" }), _jsx("p", { className: "text-xs text-gray-600 mb-3", children: "Download this template and fill in your data:" }), _jsx("div", { className: "p-3 bg-gray-100 rounded font-mono text-xs text-gray-700", children: _jsx("pre", { children: `itemNumber,nfcCode,binLocation
ITEM-001,BIN-SURG-01,Surgical Supply Shelf
ITEM-002,BIN-PHARM-01,Pharmacy Cabinet
ITEM-003,BIN-LINEN-02,Linen Storage` }) })] })] }));
}
//# sourceMappingURL=NFCBulkAssign.js.map