import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { ConfirmDialog } from '../shared';
export default function DeleteDepartmentDialog({ isOpen, department, onConfirm, onCancel, }) {
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
    return (_jsx(ConfirmDialog, { isOpen: isOpen, title: "Delete Department", message: `Are you sure you want to delete the ${department?.name} (${department?.code}) department?`, warning: "Deleting a department may impact users and items assigned to it. Consider reassigning them first.", confirmLabel: "Delete Department", cancelLabel: "Cancel", loading: loading, isDangerous: true, onConfirm: handleConfirm, onCancel: onCancel }));
}
//# sourceMappingURL=DeleteDepartmentDialog.js.map