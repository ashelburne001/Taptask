import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react'
import { useDepartments } from '../../../hooks/useDepartments'
import { SearchBar, Toast } from '../shared'
import DepartmentFormModal from './DepartmentFormModal'
import DeleteDepartmentDialog from './DeleteDepartmentDialog'

export default function DepartmentsPage() {
  const { departments, loading, error, fetchDepartments, deleteDepartment } =
    useDepartments()
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingDept, setEditingDept] = useState<any | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<any | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    fetchDepartments(search)
  }, [search])

  const handleDelete = async (deptId: string) => {
    try {
      await deleteDepartment(deptId)
      setToast({ message: 'Department deleted successfully', type: 'success' })
      setDeleteConfirm(null)
    } catch (err) {
      setToast({ message: 'Failed to delete department', type: 'error' })
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    setEditingDept(null)
  }

  const handleSuccess = () => {
    handleModalClose()
    setToast({
      message: editingDept
        ? 'Department updated successfully'
        : 'Department created successfully',
      type: 'success',
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-600 mt-1">{departments.length} departments total</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-accentblue text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          Add Department
        </button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <SearchBar onSearch={setSearch} placeholder="Search by code or name..." />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {/* Grid View */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : departments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No departments found</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-brand-accentblue text-white rounded-lg hover:bg-blue-700 transition"
          >
            Create First Department
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 border-l-4 border-brand-accentblue"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-mono font-bold mb-2">
                    {dept.code}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{dept.name}</h3>
                </div>
                <div
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    dept.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {dept.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>

              {/* Location */}
              {dept.location && (
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                  <MapPin className="w-4 h-4" />
                  {dept.location}
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-gray-200 my-4" />

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingDept(dept)
                    setShowModal(true)
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                >
                  <Edit2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Edit</span>
                </button>
                <button
                  onClick={() => setDeleteConfirm(dept)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <DepartmentFormModal
        isOpen={showModal}
        department={editingDept}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
      />

      <DeleteDepartmentDialog
        isOpen={!!deleteConfirm}
        department={deleteConfirm}
        onConfirm={() => handleDelete(deleteConfirm.id)}
        onCancel={() => setDeleteConfirm(null)}
      />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
