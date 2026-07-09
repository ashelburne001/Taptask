import { useState, useEffect } from 'react'
import { AdminModal, FormField } from '../shared'
import { useDepartments } from '../../../hooks/useDepartments'

interface DepartmentFormModalProps {
  isOpen: boolean
  department?: any | null
  onClose: () => void
  onSuccess: () => void
}

interface FormData {
  code: string
  name: string
  location: string
  isActive: boolean
}

interface FormErrors {
  [key: string]: string
}

export default function DepartmentFormModal({
  isOpen,
  department,
  onClose,
  onSuccess,
}: DepartmentFormModalProps) {
  const { createDepartment, updateDepartment } = useDepartments()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState<FormData>({
    code: '',
    name: '',
    location: '',
    isActive: true,
  })

  useEffect(() => {
    if (isOpen) {
      if (department) {
        setFormData({
          code: department.code,
          name: department.name,
          location: department.location || '',
          isActive: department.isActive,
        })
      } else {
        setFormData({
          code: '',
          name: '',
          location: '',
          isActive: true,
        })
      }
      setErrors({})
    }
  }, [isOpen, department])

  function validateForm(): boolean {
    const newErrors: FormErrors = {}

    // Code validation
    if (!formData.code) {
      newErrors.code = 'Code is required'
    } else if (!/^[A-Z0-9\-_]+$/.test(formData.code)) {
      newErrors.code = 'Code must contain only uppercase letters, numbers, hyphens, and underscores'
    }

    // Name validation
    if (!formData.name) {
      newErrors.name = 'Name is required'
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit() {
    if (!validateForm()) return

    setLoading(true)
    try {
      if (department) {
        // Update department
        await updateDepartment(department.id, {
          code: formData.code,
          name: formData.name,
          location: formData.location || undefined,
          isActive: formData.isActive,
        })
      } else {
        // Create department
        await createDepartment({
          code: formData.code,
          name: formData.name,
          location: formData.location || undefined,
        })
      }
      onSuccess()
    } catch (err) {
      console.error('Failed to save department:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminModal
      isOpen={isOpen}
      title={department ? 'Edit Department' : 'Add New Department'}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel={department ? 'Update Department' : 'Create Department'}
      loading={loading}
    >
      <div className="space-y-4">
        <FormField
          label="Department Code"
          name="code"
          type="text"
          value={formData.code}
          onChange={(value) => setFormData({ ...formData, code: (value as string).toUpperCase() })}
          placeholder="e.g., ICU, ER, SURGERY"
          required
          error={errors.code}
          helpText="Uppercase letters, numbers, hyphens, and underscores only"
        />

        <FormField
          label="Department Name"
          name="name"
          type="text"
          value={formData.name}
          onChange={(value) => setFormData({ ...formData, name: value as string })}
          placeholder="e.g., Intensive Care Unit"
          required
          error={errors.name}
        />

        <FormField
          label="Location"
          name="location"
          type="text"
          value={formData.location}
          onChange={(value) => setFormData({ ...formData, location: value as string })}
          placeholder="e.g., Building A, Floor 3"
          helpText="Optional - physical location of the department"
        />

        {department && (
          <FormField
            label="Active"
            name="isActive"
            type="toggle"
            value={formData.isActive}
            onChange={(value) => setFormData({ ...formData, isActive: value as boolean })}
          />
        )}
      </div>
    </AdminModal>
  )
}
