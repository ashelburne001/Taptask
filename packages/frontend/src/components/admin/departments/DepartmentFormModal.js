import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { AdminModal, FormField } from '../shared';
import { useDepartments } from '../../../hooks/useDepartments';
export default function DepartmentFormModal({ isOpen, department, onClose, onSuccess, }) {
    const { createDepartment, updateDepartment } = useDepartments();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        location: '',
        isActive: true,
    });
    useEffect(() => {
        if (isOpen) {
            if (department) {
                setFormData({
                    code: department.code,
                    name: department.name,
                    location: department.location || '',
                    isActive: department.isActive,
                });
            }
            else {
                setFormData({
                    code: '',
                    name: '',
                    location: '',
                    isActive: true,
                });
            }
            setErrors({});
        }
    }, [isOpen, department]);
    function validateForm() {
        const newErrors = {};
        // Code validation
        if (!formData.code) {
            newErrors.code = 'Code is required';
        }
        else if (!/^[A-Z0-9\-_]+$/.test(formData.code)) {
            newErrors.code = 'Code must contain only uppercase letters, numbers, hyphens, and underscores';
        }
        // Name validation
        if (!formData.name) {
            newErrors.name = 'Name is required';
        }
        else if (formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }
    async function handleSubmit() {
        if (!validateForm())
            return;
        setLoading(true);
        try {
            if (department) {
                // Update department
                await updateDepartment(department.id, {
                    code: formData.code,
                    name: formData.name,
                    location: formData.location || undefined,
                    isActive: formData.isActive,
                });
            }
            else {
                // Create department
                await createDepartment({
                    code: formData.code,
                    name: formData.name,
                    location: formData.location || undefined,
                });
            }
            onSuccess();
        }
        catch (err) {
            console.error('Failed to save department:', err);
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsx(AdminModal, { isOpen: isOpen, title: department ? 'Edit Department' : 'Add New Department', onClose: onClose, onSubmit: handleSubmit, submitLabel: department ? 'Update Department' : 'Create Department', loading: loading, children: _jsxs("div", { className: "space-y-4", children: [_jsx(FormField, { label: "Department Code", name: "code", type: "text", value: formData.code, onChange: (value) => setFormData({ ...formData, code: value.toUpperCase() }), placeholder: "e.g., ICU, ER, SURGERY", required: true, error: errors.code, helpText: "Uppercase letters, numbers, hyphens, and underscores only" }), _jsx(FormField, { label: "Department Name", name: "name", type: "text", value: formData.name, onChange: (value) => setFormData({ ...formData, name: value }), placeholder: "e.g., Intensive Care Unit", required: true, error: errors.name }), _jsx(FormField, { label: "Location", name: "location", type: "text", value: formData.location, onChange: (value) => setFormData({ ...formData, location: value }), placeholder: "e.g., Building A, Floor 3", helpText: "Optional - physical location of the department" }), department && (_jsx(FormField, { label: "Active", name: "isActive", type: "toggle", value: formData.isActive, onChange: (value) => setFormData({ ...formData, isActive: value }) }))] }) }));
}
//# sourceMappingURL=DepartmentFormModal.js.map