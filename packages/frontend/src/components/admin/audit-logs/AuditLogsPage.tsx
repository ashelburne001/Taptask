import { useEffect, useState } from 'react'
import { Download, Filter, AlertCircle } from 'lucide-react'
import { useAuditLogs } from '../../../hooks/useAuditLogs'
import { SearchBar } from '../shared'
import AuditLogsFilter from './AuditLogsFilter'
import AuditLogsTable from './AuditLogsTable'
import AuditLogDetailModal from './AuditLogDetailModal'
import type { AuditLog, AuditLogFilters } from '../../../hooks/useAuditLogs'

export default function AuditLogsPage() {
  const { logs, loading, error, total, fetchLogs, exportLogs, clearError } =
    useAuditLogs()
  const [filters, setFilters] = useState<AuditLogFilters>({})
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    fetchLogs(filters)
  }, [filters])

  async function handleExport(format: 'csv' | 'json') {
    setExporting(true)
    try {
      await exportLogs(format, filters)
    } finally {
      setExporting(false)
    }
  }

  function handleSearch(value: string) {
    setFilters({ ...filters, search: value })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
        <p className="text-gray-600 mt-1">Track all system activity and user actions</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">Error loading audit logs</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
          <button
            onClick={clearError}
            className="text-red-600 hover:text-red-800 font-medium text-sm"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} placeholder="Search logs..." />
          </div>
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('csv')}
              disabled={exporting || logs.length === 0}
              className="px-4 py-2 bg-brand-accentblue text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              CSV
            </button>
            <button
              onClick={() => handleExport('json')}
              disabled={exporting || logs.length === 0}
              className="px-4 py-2 bg-brand-accentblue text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              JSON
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilterPanel && (
          <AuditLogsFilter
            filters={filters}
            onFiltersChange={setFilters}
            onClose={() => setShowFilterPanel(false)}
          />
        )}
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          Showing <strong>{logs.length}</strong> of <strong>{total}</strong> audit logs
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && logs.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No audit logs found</p>
          <p className="text-sm text-gray-500 mt-1">Try adjusting your filters</p>
        </div>
      )}

      {/* Logs Table */}
      {!loading && logs.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <AuditLogsTable logs={logs} onSelectLog={setSelectedLog} />
        </div>
      )}

      {/* Detail Modal */}
      {selectedLog && (
        <AuditLogDetailModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </div>
  )
}
