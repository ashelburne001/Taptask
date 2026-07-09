import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { useUsers } from '../../../hooks/useUsers'
import { AdminTable, SearchBar, Toast } from '../shared'
import UserFormModal from './UserFormModal'
import DeleteUserDialog from './DeleteUserDialog'

export default function UsersPage() {
  const { users, loading, error, fetchUsers, deleteUser } = useUsers()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<any | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<any | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    fetchUsers(search, roleFilter)
  }, [search, roleFilter])

  const handleDelete = async (userId: string) => {
    try {
      await deleteUser(userId)
      setToast({ message: 'User deleted successfully', type: 'success' })
      setDeleteConfirm(null)
    } catch (err) {
      setToast({ message: 'Failed to delete user', type: 'error' })
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    setEditingUser(null)
  }

  const handleSuccess = () => {
    handleModalClose()
    setToast({ message: editingUser ? 'User updated successfully' : 'User created successfully', type: 'success' })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">{users.length} users total</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-accentblue text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-2 gap-4">
        <SearchBar onSearch={setSearch} placeholder="Search by email or name..." />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accentblue"
        >
          <option value="">All Roles</option>
          <option value="employee">Employee</option>
          <option value="technician">Technician</option>
          <option value="supervisor">Supervisor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {/* Table */}
      <AdminTable
        columns={[
          { key: 'email', label: 'Email', sortable: true },
          { key: 'name', label: 'Name', sortable: true },
          {
            key: 'role',
            label: 'Role',
            sortable: true,
            render: (value) => (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize">
                {value}
              </span>
            ),
          },
          {
            key: 'isActive',
            label: 'Status',
            render: (value) => (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                value
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {value ? 'Active' : 'Inactive'}
              </span>
            ),
          },
          {
            key: 'lastLogin',
            label: 'Last Login',
            render: (value) => (
              <span className="text-gray-600">
                {value ? new Date(value).toLocaleDateString() : 'Never'}
              </span>
            ),
          },
        ]}
        data={users}
        loading={loading}
        rowActions={(user) => (
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setEditingUser(user)
                setShowModal(true)
              }}
              className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition"
              title="Edit user"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeleteConfirm(user)}
              className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition"
              title="Delete user"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      />

      {/* Modals */}
      <UserFormModal
        isOpen={showModal}
        user={editingUser}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
      />

      <DeleteUserDialog
        isOpen={!!deleteConfirm}
        user={deleteConfirm}
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
