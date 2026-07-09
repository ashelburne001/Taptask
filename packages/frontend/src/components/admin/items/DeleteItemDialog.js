import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { ConfirmDialog } from '../shared';
export default function DeleteItemDialog({ isOpen, item, onConfirm, onCancel, }) {
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
    return (_jsx(ConfirmDialog, { isOpen: isOpen, title: "Delete Item", message: `Are you sure you want to delete ${item?.name} (${item?.itemNumber})?`, warning: "This item may be used in bins. Deleting it could affect your inventory system.", confirmLabel: "Delete Item", cancelLabel: "Cancel", loading: loading, isDangerous: true, onConfirm: handleConfirm, onCancel: onCancel }));
}
//# sourceMappingURL=DeleteItemDialog.js.map