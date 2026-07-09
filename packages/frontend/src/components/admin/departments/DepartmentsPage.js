import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import { useDepartments } from '../../../hooks/useDepartments';
import { SearchBar, Toast } from '../shared';
import DepartmentFormModal from './DepartmentFormModal';
import DeleteDepartmentDialog from './DeleteDepartmentDialog';
export default function DepartmentsPage() {
    const { departments, loading, error, fetchDepartments, deleteDepartment } = useDepartments();
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingDept, setEditingDept] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [toast, setToast] = useState(null);
    useEffect(() => {
        fetchDepartments(search);
    }, [search]);
    const handleDelete = async (deptId) => {
        try {
            await deleteDepartment(deptId);
            setToast({ message: 'Department deleted successfully', type: 'success' });
            setDeleteConfirm(null);
        }
        catch (err) {
            setToast({ message: 'Failed to delete department', type: 'error' });
        }
    };
    const handleModalClose = () => {
        setShowModal(false);
        setEditingDept(null);
    };
    const handleSuccess = () => {
        handleModalClose();
        setToast({
            message: editingDept
                ? 'Department updated successfully'
                : 'Department created successfully',
            type: 'success',
        });
    };
    return (_jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Departments" }), _jsxs("p", { className: "text-gray-600 mt-1", children: [departments.length, " departments total"] })] }), _jsxs("button", { onClick: () => setShowModal(true), className: "flex items-center gap-2 px-4 py-2 bg-brand-accentblue text-white rounded-lg hover:bg-blue-700 transition", children: [_jsx(Plus, { className: "w-5 h-5" }), "Add Department"] })] }), _jsx("div", { className: "max-w-md", children: _jsx(SearchBar, { onSearch: setSearch, placeholder: "Search by code or name..." }) }), error && (_jsx("div", { className: "p-4 bg-red-50 border border-red-200 rounded-lg text-red-800", children: error })), loading ? (_jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: [...Array(6)].map((_, i) => (_jsx("div", { className: "h-48 bg-gray-200 rounded-lg animate-pulse" }, i))) })) : departments.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx("p", { className: "text-gray-600 mb-4", children: "No departments found" }), _jsx("button", { onClick: () => setShowModal(true), className: "px-4 py-2 bg-brand-accentblue text-white rounded-lg hover:bg-blue-700 transition", children: "Create First Department" })] })) : (_jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: departments.map((dept) => (_jsxs("div", { className: "bg-white rounded-lg shadow hover:shadow-lg transition p-6 border-l-4 border-brand-accentblue", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-mono font-bold mb-2", children: dept.code }), _jsx("h3", { className: "text-xl font-bold text-gray-900 mb-1", children: dept.name })] }), _jsx("div", { className: `px-2 py-1 rounded text-xs font-medium ${dept.isActive
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'}`, children: dept.isActive ? 'Active' : 'Inactive' })] }), dept.location && (_jsxs("div", { className: "flex items-center gap-2 text-gray-600 text-sm mb-4", children: [_jsx(MapPin, { className: "w-4 h-4" }), dept.location] })), _jsx("div", { className: "border-t border-gray-200 my-4" }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: () => {
                                        setEditingDept(dept);
                                        setShowModal(true);
                                    }, className: "flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition", children: [_jsx(Edit2, { className: "w-4 h-4" }), _jsx("span", { className: "text-sm font-medium", children: "Edit" })] }), _jsxs("button", { onClick: () => setDeleteConfirm(dept), className: "flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition", children: [_jsx(Trash2, { className: "w-4 h-4" }), _jsx("span", { className: "text-sm font-medium", children: "Delete" })] })] })] }, dept.id))) })), _jsx(DepartmentFormModal, { isOpen: showModal, department: editingDept, onClose: handleModalClose, onSuccess: handleSuccess }), _jsx(DeleteDepartmentDialog, { isOpen: !!deleteConfirm, department: deleteConfirm, onConfirm: () => handleDelete(deleteConfirm.id), onCancel: () => setDeleteConfirm(null) }), toast && (_jsx(Toast, { message: toast.message, type: toast.type, onClose: () => setToast(null) }))] }));
}
//# sourceMappingURL=DepartmentsPage.js.map