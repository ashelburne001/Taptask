import { ReactNode } from 'react'
import { X } from 'lucide-react'

interface AdminModalProps {
  isOpen: boolean
  title: string
  onClose: () => void
  onSubmit?: () => void
  submitLabel?: string
  loading?: boolean
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export default function AdminModal({
  isOpen,
  title,
  onClose,
  onSubmit,
  submitLabel = 'Save',
  loading = false,
  children,
  size = 'md',
}: AdminModalProps) {
  if (!isOpen) return null

  const sizeClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  }[size]

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className={`bg-white rounded-lg shadow-xl w-full ${sizeClass}`}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">{children}</div>

          {/* Footer */}
          <div className="flex gap-3 justify-end p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50"
            >
              Cancel
            </button>
            {onSubmit && (
              <button
                onClick={onSubmit}
                disabled={loading}
                className="px-4 py-2 text-white bg-brand-accentblue hover:bg-blue-700 rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : submitLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
