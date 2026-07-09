import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useUsers } from '../../../hooks/useUsers';
import { AdminTable, SearchBar, Toast } from '../shared';
import UserFormModal from './UserFormModal';
import DeleteUserDialog from './DeleteUserDialog';
export default function UsersPage() {
    const { users, loading, error, fetchUsers, deleteUser } = useUsers();
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [toast, setToast] = useState(null);
    useEffect(() => {
        fetchUsers(search, roleFilter);
    }, [search, roleFilter]);
    const handleDelete = async (userId) => {
        try {
            await deleteUser(userId);
            setToast({ message: 'User deleted successfully', type: 'success' });
            setDeleteConfirm(null);
        }
        catch (err) {
            setToast({ message: 'Failed to delete user', type: 'error' });
        }
    };
    const handleModalClose = () => {
        setShowModal(false);
        setEditingUser(null);
    };
    const handleSuccess = () => {
        handleModalClose();
        setToast({ message: editingUser ? 'User updated successfully' : 'User created successfully', type: 'success' });
    };
    return (_jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Users" }), _jsxs("p", { className: "text-gray-600 mt-1", children: [users.length, " users total"] })] }), _jsxs("button", { onClick: () => setShowModal(true), className: "flex items-center gap-2 px-4 py-2 bg-brand-accentblue text-white rounded-lg hover:bg-blue-700 transition", children: [_jsx(Plus, { className: "w-5 h-5" }), "Add User"] })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsx(SearchBar, { onSearch: setSearch, placeholder: "Search by email or name..." }), _jsxs("select", { value: roleFilter, onChange: (e) => setRoleFilter(e.target.value), className: "px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accentblue", children: [_jsx("option", { value: "", children: "All Roles" }), _jsx("option", { value: "employee", children: "Employee" }), _jsx("option", { value: "technician", children: "Technician" }), _jsx("option", { value: "supervisor", children: "Supervisor" }), _jsx("option", { value: "admin", children: "Admin" })] })] }), error && (_jsx("div", { className: "p-4 bg-red-50 border border-red-200 rounded-lg text-red-800", children: error })), _jsx(AdminTable, { columns: [
                    { key: 'email', label: 'Email', sortable: true },
                    { key: 'name', label: 'Name', sortable: true },
                    {
                        key: 'role',
                        label: 'Role',
                        sortable: true,
                        render: (value) => (_jsx("span", { className: "px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize", children: value })),
                    },
                    {
                        key: 'isActive',
                        label: 'Status',
                        render: (value) => (_jsx("span", { className: `px-3 py-1 rounded-full text-sm font-medium ${value
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'}`, children: value ? 'Active' : 'Inactive' })),
                    },
                    {
                        key: 'lastLogin',
                        label: 'Last Login',
                        render: (value) => (_jsx("span", { className: "text-gray-600", children: value ? new Date(value).toLocaleDateString() : 'Never' })),
                    },
                ], data: users, loading: loading, rowActions: (user) => (_jsxs("div", { className: "flex gap-2 justify-end", children: [_jsx("button", { onClick: () => {
                                setEditingUser(user);
                                setShowModal(true);
                            }, className: "p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition", title: "Edit user", children: _jsx(Edit2, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => setDeleteConfirm(user), className: "p-2 hover:bg-red-100 text-red-600 rounded-lg transition", title: "Delete user", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })) }), _jsx(UserFormModal, { isOpen: showModal, user: editingUser, onClose: handleModalClose, onSuccess: handleSuccess }), _jsx(DeleteUserDialog, { isOpen: !!deleteConfirm, user: deleteConfirm, onConfirm: () => handleDelete(deleteConfirm.id), onCancel: () => setDeleteConfirm(null) }), toast && (_jsx(Toast, { message: toast.message, type: toast.type, onClose: () => setToast(null) }))] }));
}
//# sourceMappingURL=UsersPage.js.map