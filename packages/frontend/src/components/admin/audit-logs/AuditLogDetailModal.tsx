import { X, CheckCircle, XCircle } from 'lucide-react'
import type { AuditLog } from '../../../hooks/useAuditLogs'

interface AuditLogDetailModalProps {
  log: AuditLog
  onClose: () => void
}

export default function AuditLogDetailModal({ log, onClose }: AuditLogDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">Audit Log Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            {log.status === 'success' ? (
              <>
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-700">Success</p>
                  <p className="text-sm text-green-600">Action completed successfully</p>
                </div>
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6 text-red-600" />
                <div>
                  <p className="font-semibold text-red-700">Failed</p>
                  {log.errorMessage && (
                    <p className="text-sm text-red-600">{log.errorMessage}</p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Timestamp</p>
              <p className="text-gray-900 mt-1">
                {new Date(log.timestamp).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">User</p>
              <p className="text-gray-900 mt-1">{log.userName}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Action</p>
              <p className="text-gray-900 mt-1">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                  {log.action}
                </span>
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Resource Type</p>
              <p className="text-gray-900 mt-1">
                <span className="px-2 py-1 bg-slate-100 text-slate-800 rounded text-sm font-medium capitalize">
                  {log.resourceType}
                </span>
              </p>
            </div>
          </div>

          {/* Resource Info */}
          <div className="border-t pt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Resource</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">ID:</span>
                <span className="font-mono text-gray-900">{log.resourceId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="text-gray-900">{log.resourceName}</span>
              </div>
            </div>
          </div>

          {/* Changes */}
          {log.changes && Object.keys(log.changes).length > 0 && (
            <div className="border-t pt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Changes</p>
              <div className="space-y-3">
                {Object.entries(log.changes).map(([field, change]) => (
                  <div key={field} className="bg-gray-50 p-3 rounded">
                    <p className="font-medium text-gray-900 mb-2">{field}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Before</p>
                        <p className="font-mono text-gray-900">
                          {JSON.stringify(change.before)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">After</p>
                        <p className="font-mono text-gray-900">
                          {JSON.stringify(change.after)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Network Info */}
          <div className="border-t pt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Network</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">IP Address:</span>
                <span className="font-mono text-gray-900">{log.ipAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">User Agent:</span>
                <span className="font-mono text-gray-900 text-xs truncate max-w-xs">
                  {log.userAgent}
                </span>
              </div>
            </div>
          </div>

          {/* Raw JSON */}
          <div className="border-t pt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Raw Data</p>
            <div className="p-3 bg-gray-100 rounded font-mono text-xs text-gray-700 overflow-auto max-h-40">
              <pre>{JSON.stringify(log, null, 2)}</pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-brand-accentblue text-white rounded-lg hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
