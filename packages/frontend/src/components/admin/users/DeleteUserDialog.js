import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { ConfirmDialog } from '../shared';
export default function DeleteUserDialog({ isOpen, user, onConfirm, onCancel, }) {
    const [loading, setLoading] = useState(false);
    const handleConfirm = async () => {
        setLoading(true);
        try {
            onConfirm();
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx(ConfirmDialog, { isOpen: isOpen, title: "Delete User", message: `Are you sure you want to delete ${user?.name} (${user?.email})?`, warning: user?.role === 'admin'
            ? 'This is an admin user. Deleting it may impact system access.'
            : user?.role === 'supervisor'
                ? 'This is a supervisor. Consider reassigning their responsibilities first.'
                : undefined, confirmLabel: "Delete User", cancelLabel: "Cancel", loading: loading, isDangerous: true, onConfirm: handleConfirm, onCancel: onCancel }));
}
//# sourceMappingURL=DeleteUserDialog.js.map