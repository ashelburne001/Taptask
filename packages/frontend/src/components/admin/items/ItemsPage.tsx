import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Upload } from 'lucide-react'
import { useItems } from '../../../hooks/useItems'
import { AdminTable, SearchBar, Toast } from '../shared'
import ItemFormModal from './ItemFormModal'
import DeleteItemDialog from './DeleteItemDialog'
import ItemsImportModal from './ItemsImportModal'

export default function ItemsPage() {
  const { items, loading, error, fetchItems, deleteItem } = useItems()
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [editingItem, setEditingItem] = useState<any | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<any | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    fetchItems(search)
  }, [search])

  const handleDelete = async (itemId: string) => {
    try {
      await deleteItem(itemId)
      setToast({ message: 'Item deleted successfully', type: 'success' })
      setDeleteConfirm(null)
    } catch (err) {
      setToast({ message: 'Failed to delete item', type: 'error' })
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    setEditingItem(null)
  }

  const handleSuccess = () => {
    handleModalClose()
    setToast({
      message: editingItem ? 'Item updated successfully' : 'Item created successfully',
      type: 'success',
    })
  }

  const handleImportSuccess = () => {
    setShowImport(false)
    setToast({ message: 'Items imported successfully', type: 'success' })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Items</h1>
          <p className="text-gray-600 mt-1">{items.length} items total</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowImport(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            <Upload className="w-5 h-5" />
            Import CSV
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-accentblue text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            Add Item
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <SearchBar onSearch={setSearch} placeholder="Search by number or name..." />
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
          { key: 'itemNumber', label: 'Item Number', sortable: true, width: 'w-32' },
          { key: 'name', label: 'Name', sortable: true },
          {
            key: 'gtin',
            label: 'GTIN/UPC',
            render: (_value, row: any) => (
              <span className="text-gray-600 text-sm">
                {row.gtin || row.upc || 'N/A'}
              </span>
            ),
          },
          {
            key: 'unitOfMeasure',
            label: 'Unit',
            sortable: true,
            render: (value) => (
              <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
                {value}
              </span>
            ),
          },
          {
            key: 'parLevel',
            label: 'PAR',
            sortable: true,
            width: 'w-16',
          },
          {
            key: 'binSize',
            label: 'Bin Size',
            sortable: true,
            width: 'w-24',
          },
          {
            key: 'isActive',
            label: 'Status',
            render: (value) => (
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  value
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {value ? 'Active' : 'Inactive'}
              </span>
            ),
          },
        ]}
        data={items}
        loading={loading}
        rowActions={(item) => (
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setEditingItem(item)
                setShowModal(true)
              }}
              className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition"
              title="Edit item"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeleteConfirm(item)}
              className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition"
              title="Delete item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      />

      {/* Modals */}
      <ItemFormModal
        isOpen={showModal}
        item={editingItem}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
      />

      <DeleteItemDialog
        isOpen={!!deleteConfirm}
        item={deleteConfirm}
        onConfirm={() => handleDelete(deleteConfirm.id)}
        onCancel={() => setDeleteConfirm(null)}
      />

      <ItemsImportModal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        onSuccess={handleImportSuccess}
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
