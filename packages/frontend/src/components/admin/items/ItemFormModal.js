import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { AdminModal, FormField } from '../shared';
import { useItems } from '../../../hooks/useItems';
import { ExternalLink } from 'lucide-react';
const UNITS = [
    { label: 'Unit', value: 'Unit' },
    { label: 'Box', value: 'Box' },
    { label: 'Case', value: 'Case' },
    { label: 'Pack', value: 'Pack' },
    { label: 'Carton', value: 'Carton' },
    { label: 'Pallet', value: 'Pallet' },
    { label: 'Roll', value: 'Roll' },
    { label: 'Bottle', value: 'Bottle' },
];
export default function ItemFormModal({ isOpen, item, onClose, onSuccess, }) {
    const { createItem, updateItem } = useItems();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        itemNumber: '',
        name: '',
        description: '',
        gtin: '',
        upc: '',
        unitOfMeasure: 'Unit',
        parLevel: 10,
        binSize: 50,
        imageUrl: '',
        isActive: true,
    });
    useEffect(() => {
        if (isOpen) {
            if (item) {
                setFormData({
                    itemNumber: item.itemNumber,
                    name: item.name,
                    description: item.description || '',
                    gtin: item.gtin || '',
                    upc: item.upc || '',
                    unitOfMeasure: item.unitOfMeasure || 'Unit',
                    parLevel: item.parLevel || 10,
                    binSize: item.binSize || 50,
                    imageUrl: item.imageUrl || '',
                    isActive: item.isActive,
                });
            }
            else {
                setFormData({
                    itemNumber: '',
                    name: '',
                    description: '',
                    gtin: '',
                    upc: '',
                    unitOfMeasure: 'Unit',
                    parLevel: 10,
                    binSize: 50,
                    imageUrl: '',
                    isActive: true,
                });
            }
            setErrors({});
        }
    }, [isOpen, item]);
    function validateForm() {
        const newErrors = {};
        if (!formData.itemNumber) {
            newErrors.itemNumber = 'Item number is required';
        }
        if (!formData.name) {
            newErrors.name = 'Name is required';
        }
        else if (formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }
        if (formData.parLevel < 1) {
            newErrors.parLevel = 'PAR level must be at least 1';
        }
        if (formData.binSize < 1) {
            newErrors.binSize = 'Bin size must be at least 1';
        }
        if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
            newErrors.imageUrl = 'Invalid image URL';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }
    function isValidUrl(str) {
        try {
            new URL(str);
            return true;
        }
        catch {
            return false;
        }
    }
    async function handleSubmit() {
        if (!validateForm())
            return;
        setLoading(true);
        try {
            if (item) {
                await updateItem(item.id, {
                    itemNumber: formData.itemNumber,
                    name: formData.name,
                    description: formData.description || undefined,
                    gtin: formData.gtin || undefined,
                    upc: formData.upc || undefined,
                    unitOfMeasure: formData.unitOfMeasure,
                    parLevel: formData.parLevel,
                    binSize: formData.binSize,
                    imageUrl: formData.imageUrl || undefined,
                    isActive: formData.isActive,
                });
            }
            else {
                await createItem({
                    itemNumber: formData.itemNumber,
                    name: formData.name,
                    description: formData.description || undefined,
                    gtin: formData.gtin || undefined,
                    upc: formData.upc || undefined,
                    unitOfMeasure: formData.unitOfMeasure,
                    parLevel: formData.parLevel,
                    binSize: formData.binSize,
                    imageUrl: formData.imageUrl || undefined,
                });
            }
            onSuccess();
        }
        catch (err) {
            console.error('Failed to save item:', err);
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsx(AdminModal, { isOpen: isOpen, title: item ? 'Edit Item' : 'Add New Item', onClose: onClose, onSubmit: handleSubmit, submitLabel: item ? 'Update Item' : 'Create Item', loading: loading, size: "lg", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsx(FormField, { label: "Item Number", name: "itemNumber", type: "text", value: formData.itemNumber, onChange: (value) => setFormData({ ...formData, itemNumber: value }), placeholder: "e.g., INV-001", required: true, error: errors.itemNumber }), _jsx(FormField, { label: "Item Name", name: "name", type: "text", value: formData.name, onChange: (value) => setFormData({ ...formData, name: value }), placeholder: "e.g., Saline Solution", required: true, error: errors.name })] }), _jsx(FormField, { label: "Description", name: "description", type: "textarea", value: formData.description, onChange: (value) => setFormData({ ...formData, description: value }), placeholder: "Optional item description" }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsx(FormField, { label: "GTIN", name: "gtin", type: "text", value: formData.gtin, onChange: (value) => setFormData({ ...formData, gtin: value }), placeholder: "Global Trade Item Number" }), _jsx(FormField, { label: "UPC", name: "upc", type: "text", value: formData.upc, onChange: (value) => setFormData({ ...formData, upc: value }), placeholder: "Universal Product Code" })] }), _jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [_jsx(FormField, { label: "Unit of Measure", name: "unitOfMeasure", type: "select", value: formData.unitOfMeasure, onChange: (value) => setFormData({ ...formData, unitOfMeasure: value }), required: true, options: UNITS }), _jsx(FormField, { label: "PAR Level", name: "parLevel", type: "number", value: formData.parLevel, onChange: (value) => setFormData({ ...formData, parLevel: Number(value) }), required: true, error: errors.parLevel }), _jsx(FormField, { label: "Bin Size", name: "binSize", type: "number", value: formData.binSize, onChange: (value) => setFormData({ ...formData, binSize: Number(value) }), required: true, error: errors.binSize })] }), _jsx(FormField, { label: "Image URL", name: "imageUrl", type: "text", value: formData.imageUrl, onChange: (value) => setFormData({ ...formData, imageUrl: value }), placeholder: "https://example.com/image.jpg", error: errors.imageUrl }), formData.imageUrl && !errors.imageUrl && (_jsx("div", { className: "border border-gray-200 rounded-lg p-3", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("img", { src: formData.imageUrl, alt: "Preview", className: "w-20 h-20 object-cover rounded", onError: (e) => {
                                    e.currentTarget.style.display = 'none';
                                } }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm text-gray-600 break-all", children: formData.imageUrl }), _jsxs("a", { href: formData.imageUrl, target: "_blank", rel: "noopener noreferrer", className: "text-xs text-brand-accentblue hover:underline flex items-center gap-1 mt-1", children: ["Open in new tab", _jsx(ExternalLink, { className: "w-3 h-3" })] })] })] }) })), item && (_jsx(FormField, { label: "Active", name: "isActive", type: "toggle", value: formData.isActive, onChange: (value) => setFormData({ ...formData, isActive: value }) }))] }) }));
}
//# sourceMappingURL=ItemFormModal.js.map