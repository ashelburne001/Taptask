import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { AdminModal, FormField } from '../shared';
import { useUsers } from '../../../hooks/useUsers';
import { apiClient } from '../../../api/client';
import { Copy, Check } from 'lucide-react';
export default function UserFormModal({ isOpen, user, onClose, onSuccess }) {
    const { createUser, updateUser } = useUsers();
    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [errors, setErrors] = useState({});
    const [copiedPassword, setCopiedPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: '',
        role: 'employee',
        departmentId: '',
        isActive: true,
    });
    useEffect(() => {
        if (isOpen) {
            fetchDepartments();
            if (user) {
                setFormData({
                    email: user.email,
                    name: user.name,
                    password: '',
                    role: user.role,
                    departmentId: user.departmentId || '',
                    isActive: user.isActive,
                });
            }
            else {
                setFormData({
                    email: '',
                    name: '',
                    password: '',
                    role: 'employee',
                    departmentId: '',
                    isActive: true,
                });
            }
            setErrors({});
        }
    }, [isOpen, user]);
    async function fetchDepartments() {
        try {
            const { departments: data } = await apiClient.listDepartments();
            setDepartments(data);
        }
        catch (err) {
            console.error('Failed to fetch departments:', err);
        }
    }
    function validateForm() {
        const newErrors = {};
        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email is required';
        }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        // Name validation
        if (!formData.name) {
            newErrors.name = 'Name is required';
        }
        else if (formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }
        // Password validation (only on create)
        if (!user && !formData.password) {
            newErrors.password = 'Password is required';
        }
        else if (!user && formData.password && formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }
        // Role validation
        if (!formData.role) {
            newErrors.role = 'Role is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }
    async function handleSubmit() {
        if (!validateForm())
            return;
        setLoading(true);
        try {
            if (user) {
                // Update user
                await updateUser(user.id, {
                    email: formData.email,
                    name: formData.name,
                    role: formData.role,
                    departmentId: formData.departmentId || undefined,
                    isActive: formData.isActive,
                });
            }
            else {
                // Create user
                await createUser({
                    email: formData.email,
                    name: formData.name,
                    password: formData.password,
                    role: formData.role,
                    departmentId: formData.departmentId || undefined,
                });
            }
            onSuccess();
        }
        catch (err) {
            console.error('Failed to save user:', err);
        }
        finally {
            setLoading(false);
        }
    }
    function generatePassword() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
        let password = '';
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setFormData({ ...formData, password });
        setCopiedPassword(false);
    }
    function copyPassword() {
        navigator.clipboard.writeText(formData.password);
        setCopiedPassword(true);
        setTimeout(() => setCopiedPassword(false), 2000);
    }
    return (_jsx(AdminModal, { isOpen: isOpen, title: user ? 'Edit User' : 'Add New User', onClose: onClose, onSubmit: handleSubmit, submitLabel: user ? 'Update User' : 'Create User', loading: loading, children: _jsxs("div", { className: "space-y-4", children: [_jsx(FormField, { label: "Email", name: "email", type: "email", value: formData.email, onChange: (value) => setFormData({ ...formData, email: value }), placeholder: "user@hospital.local", required: true, error: errors.email }), _jsx(FormField, { label: "Full Name", name: "name", type: "text", value: formData.name, onChange: (value) => setFormData({ ...formData, name: value }), placeholder: "John Doe", required: true, error: errors.name }), _jsxs("div", { children: [_jsx(FormField, { label: user ? 'Password (leave blank to keep current)' : 'Password', name: "password", type: "password", value: formData.password, onChange: (value) => setFormData({ ...formData, password: value }), placeholder: user ? '••••••••' : 'Enter password', required: !user, error: errors.password }), !user && (_jsx("button", { type: "button", onClick: generatePassword, className: "mt-2 text-sm text-brand-accentblue hover:underline", children: "Generate password" })), formData.password && (_jsxs("div", { className: "mt-2 flex items-center gap-2 p-2 bg-gray-100 rounded", children: [_jsx("code", { className: "text-sm font-mono flex-1 break-all", children: formData.password }), _jsx("button", { type: "button", onClick: copyPassword, className: "p-1 hover:bg-gray-200 rounded transition", title: "Copy password", children: copiedPassword ? (_jsx(Check, { className: "w-4 h-4 text-green-600" })) : (_jsx(Copy, { className: "w-4 h-4 text-gray-600" })) })] }))] }), _jsx(FormField, { label: "Role", name: "role", type: "select", value: formData.role, onChange: (value) => setFormData({ ...formData, role: value }), required: true, error: errors.role, options: [
                        { label: 'Employee', value: 'employee' },
                        { label: 'Technician', value: 'technician' },
                        { label: 'Supervisor', value: 'supervisor' },
                        { label: 'Admin', value: 'admin' },
                    ] }), _jsx(FormField, { label: "Department", name: "departmentId", type: "select", value: formData.departmentId, onChange: (value) => setFormData({ ...formData, departmentId: value }), options: [
                        { label: 'None', value: '' },
                        ...departments.map((dept) => ({ label: dept.name, value: dept.id })),
                    ] }), user && (_jsx(FormField, { label: "Active", name: "isActive", type: "toggle", value: formData.isActive, onChange: (value) => setFormData({ ...formData, isActive: value }) }))] }) }));
}
//# sourceMappingURL=UserFormModal.js.map