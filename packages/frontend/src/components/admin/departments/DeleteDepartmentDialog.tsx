import { useState } from 'react'
import { ConfirmDialog } from '../shared'

interface DeleteDepartmentDialogProps {
  isOpen: boolean
  department?: any | null
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteDepartmentDialog({
  isOpen,
  department,
  onConfirm,
  onCancel,
}: DeleteDepartmentDialogProps) {
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
      title="Delete Department"
      message={`Are you sure you want to delete the ${department?.name} (${department?.code}) department?`}
      warning="Deleting a department may impact users and items assigned to it. Consider reassigning them first."
      confirmLabel="Delete Department"
      cancelLabel="Cancel"
      loading={loading}
      isDangerous
      onConfirm={handleConfirm}
      onCancel={onCancel}
    />
  )
}
