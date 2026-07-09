import { useState } from 'react'
import { ConfirmDialog } from '../shared'

interface DeleteItemDialogProps {
  isOpen: boolean
  item?: any | null
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteItemDialog({
  isOpen,
  item,
  onConfirm,
  onCancel,
}: DeleteItemDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      onConfirm()
    } finally {
      setLoading(false)
    }
  }

  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="Delete Item"
      message={`Are you sure you want to delete ${item?.name} (${item?.itemNumber})?`}
      warning="This item may be used in bins. Deleting it could affect your inventory system."
      confirmLabel="Delete Item"
      cancelLabel="Cancel"
      loading={loading}
      isDangerous
      onConfirm={handleConfirm}
      onCancel={onCancel}
    />
  )
}
