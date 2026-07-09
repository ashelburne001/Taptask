import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { AdminModal } from '../shared';
import { apiClient } from '../../../api/client';
export default function ItemsImportModal({ isOpen, onClose, onSuccess, }) {
    const [step, setStep] = useState('upload');
    const [_file, setFile] = useState(null);
    const [csvData, setCsvData] = useState([]);
    const [columnMap, setColumnMap] = useState({});
    const [errors, setErrors] = useState([]);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const EXPECTED_COLUMNS = [
        'Item_Number',
        'Item_Name',
        'Description',
        'UPC',
        'GTIN',
        'Unit_of_Measure',
        'PAR_Level',
        'Bin_Size',
    ];
    function handleFileChange(event) {
        const selectedFile = event.target.files?.[0];
        if (!selectedFile)
            return;
        if (!selectedFile.name.endsWith('.csv')) {
            setErrors(['Only CSV files are supported']);
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const csv = e.target?.result;
                const lines = csv.split('\n').filter((line) => line.trim());
                const headers = lines[0].split(',').map((h) => h.trim());
                const data = lines.slice(1).map((line) => {
                    const values = line.split(',').map((v) => v.trim());
                    return headers.reduce((obj, header, i) => {
                        obj[header] = values[i] || '';
                        return obj;
                    }, {});
                });
                setFile(selectedFile);
                setCsvData(data);
                setErrors([]);
                // Auto-map common headers
                const map = {};
                const headerLower = headers.map((h) => h.toLowerCase());
                EXPECTED_COLUMNS.forEach((expected) => {
                    const idx = headerLower.findIndex((h) => h === expected.toLowerCase() ||
                        h === expected.toLowerCase().replace(/_/g, ' ') ||
                        h === expected.toLowerCase().replace(/_/g, '-'));
                    if (idx !== -1) {
                        map[expected] = headers[idx];
                    }
                });
                setColumnMap(map);
                setStep('preview');
            }
            catch (error) {
                setErrors(['Failed to parse CSV file']);
            }
        };
        reader.readAsText(selectedFile);
    }
    async function handleImport() {
        setLoading(true);
        try {
            const itemsToImport = csvData.slice(0, 100).map((row) => ({
                itemNumber: row[columnMap['Item_Number'] || 'Item_Number'] || '',
                name: row[columnMap['Item_Name'] || 'Item_Name'] || '',
                description: row[columnMap['Description'] || 'Description'],
                upc: row[columnMap['UPC'] || 'UPC'],
                gtin: row[columnMap['GTIN'] || 'GTIN'],
                unitOfMeasure: row[columnMap['Unit_of_Measure'] || 'Unit_of_Measure'] || 'Unit',
                parLevel: parseInt(row[columnMap['PAR_Level'] || 'PAR_Level'] || '10') || 10,
                binSize: parseInt(row[columnMap['Bin_Size'] || 'Bin_Size'] || '50') || 50,
            }));
            // Validate required fields
            const validItems = itemsToImport.filter((item) => {
                if (!item.itemNumber || !item.name) {
                    return false;
                }
                return true;
            });
            const importErrors = [];
            let created = 0;
            let updated = 0;
            // Simple import - just create items (in production, would need to check for duplicates)
            for (const item of validItems) {
                try {
                    await apiClient.createItem(item);
                    created++;
                }
                catch (err) {
                    importErrors.push(`${item.itemNumber}: ${err.response?.data?.error || 'Failed to create'}`);
                }
            }
            setStep('importing');
            setResult({
                created,
                updated,
                errors: importErrors,
            });
            setTimeout(() => {
                onSuccess();
                handleClose();
            }, 2000);
        }
        catch (error) {
            setErrors(['Import failed']);
        }
        finally {
            setLoading(false);
        }
    }
    function handleClose() {
        setStep('upload');
        setFile(null);
        setCsvData([]);
        setColumnMap({});
        setErrors([]);
        setResult(null);
        onClose();
    }
    return (_jsxs(AdminModal, { isOpen: isOpen, title: "Import Items from CSV", onClose: handleClose, onSubmit: step === 'preview' ? handleImport : undefined, submitLabel: "Import Items", loading: loading, size: "lg", children: [step === 'upload' && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: [_jsxs("p", { className: "text-sm text-blue-800 mb-2", children: [_jsx("strong", { children: "CSV Format:" }), " Expected columns (optional):"] }), _jsx("code", { className: "text-xs text-blue-700 block", children: "Item_Number, Item_Name, Description, UPC, GTIN, Unit_of_Measure, PAR_Level, Bin_Size" })] }), _jsx("div", { className: "border-2 border-dashed border-gray-300 rounded-lg p-8 text-center", children: _jsxs("label", { className: "cursor-pointer block", children: [_jsx(Upload, { className: "w-12 h-12 text-gray-400 mx-auto mb-3" }), _jsx("p", { className: "text-lg font-medium text-gray-900 mb-1", children: "Drag and drop CSV file" }), _jsx("p", { className: "text-sm text-gray-600 mb-4", children: "or click to select file" }), _jsx("input", { type: "file", accept: ".csv", onChange: handleFileChange, className: "hidden" })] }) }), errors.map((error, i) => (_jsxs("div", { className: "p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" }), _jsx("p", { className: "text-sm text-red-700", children: error })] }, i)))] })), step === 'preview' && csvData.length > 0 && (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-3", children: _jsxs("p", { className: "text-sm text-blue-800", children: ["Found ", csvData.length, " rows. Showing first 5 items:"] }) }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "bg-gray-100", children: _jsxs("tr", { children: [_jsx("th", { className: "px-3 py-2 text-left", children: "Number" }), _jsx("th", { className: "px-3 py-2 text-left", children: "Name" }), _jsx("th", { className: "px-3 py-2 text-left", children: "UPC" }), _jsx("th", { className: "px-3 py-2 text-left", children: "PAR" })] }) }), _jsx("tbody", { children: csvData.slice(0, 5).map((row, i) => (_jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "px-3 py-2 font-mono", children: row[columnMap['Item_Number'] || 'Item_Number'] }), _jsx("td", { className: "px-3 py-2", children: row[columnMap['Item_Name'] || 'Item_Name'] }), _jsx("td", { className: "px-3 py-2 text-gray-600", children: row[columnMap['UPC'] || 'UPC'] }), _jsx("td", { className: "px-3 py-2", children: row[columnMap['PAR_Level'] || 'PAR_Level'] })] }, i))) })] }) }), csvData.length > 5 && (_jsxs("p", { className: "text-sm text-gray-600 text-center", children: ["... and ", csvData.length - 5, " more items"] }))] })), step === 'importing' && result && (_jsxs("div", { className: "space-y-4 text-center", children: [_jsx(CheckCircle, { className: "w-16 h-16 text-green-600 mx-auto" }), _jsxs("div", { children: [_jsx("p", { className: "text-lg font-bold text-gray-900 mb-1", children: "Import Complete" }), _jsxs("p", { className: "text-sm text-gray-600 mb-4", children: ["Created ", result.created, " items", result.updated > 0 && `, Updated ${result.updated} items`] }), result.errors.length > 0 && (_jsxs("div", { className: "bg-red-50 border border-red-200 rounded-lg p-3 text-left", children: [_jsxs("p", { className: "text-sm font-medium text-red-800 mb-2", children: [result.errors.length, " errors:"] }), _jsxs("ul", { className: "text-xs text-red-700 space-y-1", children: [result.errors.slice(0, 5).map((err, i) => (_jsxs("li", { children: ["\u2022 ", err] }, i))), result.errors.length > 5 && (_jsxs("li", { children: ["... and ", result.errors.length - 5, " more"] }))] })] }))] })] }))] }));
}
//# sourceMappingURL=ItemsImportModal.js.map