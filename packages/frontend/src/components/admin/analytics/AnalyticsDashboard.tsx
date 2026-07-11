import { useEffect, useState } from 'react'
import { TrendingUp, AlertCircle, RefreshCw, Download } from 'lucide-react'
import { useAnalytics } from '../../../hooks/useAnalytics'
import MetricsGrid from './MetricsGrid'
import InventoryChart from './InventoryChart'
import RequestsTrendChart from './RequestsTrendChart'
import UserActivityChart from './UserActivityChart'
import DepartmentChart from './DepartmentChart'

export default function AnalyticsDashboard() {
  const { metrics, chartData, loading, error, fetchAnalytics, clearError } =
    useAnalytics()
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter'>('week')
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  async function handleRefresh() {
    await fetchAnalytics()
  }

  async function handleExport() {
    setExporting(true)
    try {
      // TODO: Implement analytics export
      const data = {
        metrics,
        chartData,
        exportedAt: new Date().toISOString(),
      }
      const dataStr = JSON.stringify(data, null, 2)
      downloadFile(dataStr, 'analytics.json', 'application/json')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time insights and system performance</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh
          </button>
          <button
            onClick={handleExport}
            disabled={exporting || !metrics}
            className="px-4 py-2 bg-brand-accentblue text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">Error loading analytics</p>
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

      {/* Date Range Selector */}
      <div className="flex gap-2">
        {(['week', 'month', 'quarter'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setDateRange(range)}
            className={`px-4 py-2 rounded-lg transition capitalize ${
              dateRange === range
                ? 'bg-brand-accentblue text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {/* Metrics Grid */}
      {!loading && metrics && (
        <>
          <MetricsGrid metrics={metrics} />

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Inventory Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-brand-accentblue" />
                <h2 className="text-lg font-bold text-gray-900">Inventory Status</h2>
              </div>
              <InventoryChart data={chartData.inventoryStatus} />
            </div>

            {/* User Activity */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-brand-accentblue" />
                <h2 className="text-lg font-bold text-gray-900">User Activity</h2>
              </div>
              <UserActivityChart data={chartData.userActivity} />
            </div>
          </div>

          {/* Requests Trend - Full Width */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-brand-accentblue" />
              <h2 className="text-lg font-bold text-gray-900">Requests Trend (7 Days)</h2>
            </div>
            <RequestsTrendChart data={chartData.requestsTrend} />
          </div>

          {/* Department Performance */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-brand-accentblue" />
              <h2 className="text-lg font-bold text-gray-900">Department Performance</h2>
            </div>
            <DepartmentChart data={chartData.departmentPerformance} />
          </div>
        </>
      )}
    </div>
  )
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
