import { CheckCircle, XCircle } from 'lucide-react'
import type { AuditLog } from '../../../hooks/useAuditLogs'

interface AuditLogsTableProps {
  logs: AuditLog[]
  onSelectLog: (log: AuditLog) => void
}

export default function AuditLogsTable({ logs, onSelectLog }: AuditLogsTableProps) {
  function getActionBadgeColor(action: string): string {
    const colors: Record<string, string> = {
      CREATE: 'bg-green-100 text-green-800',
      READ: 'bg-blue-100 text-blue-800',
      UPDATE: 'bg-yellow-100 text-yellow-800',
      DELETE: 'bg-red-100 text-red-800',
      LOGIN: 'bg-purple-100 text-purple-800',
      LOGOUT: 'bg-gray-100 text-gray-800',
      EXPORT: 'bg-indigo-100 text-indigo-800',
    }
    return colors[action] || 'bg-gray-100 text-gray-800'
  }

  function getResourceBadgeColor(type: string): string {
    const colors: Record<string, string> = {
      user: 'bg-slate-100 text-slate-800',
      item: 'bg-slate-100 text-slate-800',
      department: 'bg-slate-100 text-slate-800',
      bin: 'bg-slate-100 text-slate-800',
      request: 'bg-slate-100 text-slate-800',
      auth: 'bg-slate-100 text-slate-800',
      system: 'bg-slate-100 text-slate-800',
    }
    return colors[type] || 'bg-slate-100 text-slate-800'
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="text-left p-4 font-semibold text-gray-700">Timestamp</th>
            <th className="text-left p-4 font-semibold text-gray-700">User</th>
            <th className="text-left p-4 font-semibold text-gray-700">Action</th>
            <th className="text-left p-4 font-semibold text-gray-700">Resource</th>
            <th className="text-left p-4 font-semibold text-gray-700">Status</th>
            <th className="text-left p-4 font-semibold text-gray-700">Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr
              key={log.id}
              className="border-b hover:bg-gray-50 transition cursor-pointer"
              onClick={() => onSelectLog(log)}
            >
              <td className="p-4 text-gray-600 font-medium">
                {new Date(log.timestamp).toLocaleString()}
              </td>
              <td className="p-4 text-gray-900">{log.userName}</td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getActionBadgeColor(log.action)}`}>
                  {log.action}
                </span>
              </td>
              <td className="p-4">
                <div className="flex flex-col gap-1">
                  <span className={`px-2 py-1 rounded text-xs font-medium w-fit ${getResourceBadgeColor(log.resourceType)}`}>
                    {log.resourceType}
                  </span>
                  <span className="text-gray-600">{log.resourceName}</span>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  {log.status === 'success' ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-green-700">Success</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span className="text-red-700">Failed</span>
                    </>
                  )}
                </div>
              </td>
              <td className="p-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectLog(log)
                  }}
                  className="text-brand-accentblue hover:underline text-xs font-medium"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
