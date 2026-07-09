import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Upload } from 'lucide-react';
import { useItems } from '../../../hooks/useItems';
import { AdminTable, SearchBar, Toast } from '../shared';
import ItemFormModal from './ItemFormModal';
import DeleteItemDialog from './DeleteItemDialog';
import ItemsImportModal from './ItemsImportModal';
export default function ItemsPage() {
    const { items, loading, error, fetchItems, deleteItem } = useItems();
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showImport, setShowImport] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [toast, setToast] = useState(null);
    useEffect(() => {
        fetchItems(search);
    }, [search]);
    const handleDelete = async (itemId) => {
        try {
            await deleteItem(itemId);
            setToast({ message: 'Item deleted successfully', type: 'success' });
            setDeleteConfirm(null);
        }
        catch (err) {
            setToast({ message: 'Failed to delete item', type: 'error' });
        }
    };
    const handleModalClose = () => {
        setShowModal(false);
        setEditingItem(null);
    };
    const handleSuccess = () => {
        handleModalClose();
        setToast({
            message: editingItem ? 'Item updated successfully' : 'Item created successfully',
            type: 'success',
        });
    };
    const handleImportSuccess = () => {
        setShowImport(false);
        setToast({ message: 'Items imported successfully', type: 'success' });
    };
    return (_jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Items" }), _jsxs("p", { className: "text-gray-600 mt-1", children: [items.length, " items total"] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: () => setShowImport(true), className: "flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition", children: [_jsx(Upload, { className: "w-5 h-5" }), "Import CSV"] }), _jsxs("button", { onClick: () => setShowModal(true), className: "flex items-center gap-2 px-4 py-2 bg-brand-accentblue text-white rounded-lg hover:bg-blue-700 transition", children: [_jsx(Plus, { className: "w-5 h-5" }), "Add Item"] })] })] }), _jsx("div", { className: "max-w-md", children: _jsx(SearchBar, { onSearch: setSearch, placeholder: "Search by number or name..." }) }), error && (_jsx("div", { className: "p-4 bg-red-50 border border-red-200 rounded-lg text-red-800", children: error })), _jsx(AdminTable, { columns: [
                    { key: 'itemNumber', label: 'Item Number', sortable: true, width: 'w-32' },
                    { key: 'name', label: 'Name', sortable: true },
                    {
                        key: 'gtin',
                        label: 'GTIN/UPC',
                        render: (_value, row) => (_jsx("span", { className: "text-gray-600 text-sm", children: row.gtin || row.upc || 'N/A' })),
                    },
                    {
                        key: 'unitOfMeasure',
                        label: 'Unit',
                        sortable: true,
                        render: (value) => (_jsx("span", { className: "px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium", children: value })),
                    },
                    {
                        key: 'parLevel',
                        label: 'PAR',
                        sortable: true,
                        width: 'w-16',
                    },
                    {
                        key: 'binSize',
                        label: 'Bin Size',
                        sortable: true,
                        width: 'w-24',
                    },
                    {
                        key: 'isActive',
                        label: 'Status',
                        render: (value) => (_jsx("span", { className: `px-3 py-1 rounded-full text-sm font-medium ${value
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'}`, children: value ? 'Active' : 'Inactive' })),
                    },
                ], data: items, loading: loading, rowActions: (item) => (_jsxs("div", { className: "flex gap-2 justify-end", children: [_jsx("button", { onClick: () => {
                                setEditingItem(item);
                                setShowModal(true);
                            }, className: "p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition", title: "Edit item", children: _jsx(Edit2, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => setDeleteConfirm(item), className: "p-2 hover:bg-red-100 text-red-600 rounded-lg transition", title: "Delete item", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })) }), _jsx(ItemFormModal, { isOpen: showModal, item: editingItem, onClose: handleModalClose, onSuccess: handleSuccess }), _jsx(DeleteItemDialog, { isOpen: !!deleteConfirm, item: deleteConfirm, onConfirm: () => handleDelete(deleteConfirm.id), onCancel: () => setDeleteConfirm(null) }), _jsx(ItemsImportModal, { isOpen: showImport, onClose: () => setShowImport(false), onSuccess: handleImportSuccess }), toast && (_jsx(Toast, { message: toast.message, type: toast.type, onClose: () => setToast(null) }))] }));
}
//# sourceMappingURL=ItemsPage.js.map