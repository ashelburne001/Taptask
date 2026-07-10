import { useState, useCallback } from 'react'

export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'EXPORT'
  resourceType: 'user' | 'item' | 'department' | 'bin' | 'request' | 'auth' | 'system'
  resourceId: string
  resourceName: string
  changes?: Record<string, { before: any; after: any }>
  ipAddress: string
  userAgent: string
  timestamp: number
  status: 'success' | 'failure'
  errorMessage?: string
}

interface UseAuditLogsReturn {
  logs: AuditLog[]
  loading: boolean
  error: string | null
  total: number
  fetchLogs: (filters?: AuditLogFilters) => Promise<void>
  exportLogs: (format: 'csv' | 'json', filters?: AuditLogFilters) => Promise<void>
  clearError: () => void
}

export interface AuditLogFilters {
  startDate?: number
  endDate?: number
  userId?: string
  action?: string
  resourceType?: string
  search?: string
  page?: number
  limit?: number
}

export function useAuditLogs(): UseAuditLogsReturn {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  const fetchLogs = useCallback(async (_filters?: AuditLogFilters) => {
    setLoading(true)
    setError(null)

    try {
      // TODO: Replace with actual API call
      // const response = await apiClient.listAuditLogs(_filters)
      // setLogs(response.logs)
      // setTotal(response.total)

      // Mock data for now
      const mockLogs: AuditLog[] = [
        {
          id: 'LOG-001',
          userId: 'USER-1',
          userName: 'Admin User',
          action: 'CREATE',
          resourceType: 'user',
          resourceId: 'USER-42',
          resourceName: 'John Smith',
          timestamp: Date.now() - 3600000,
          ipAddress: '192.168.1.100',
          userAgent: 'Chrome/120.0',
          status: 'success',
        },
        {
          id: 'LOG-002',
          userId: 'USER-2',
          userName: 'Manager',
          action: 'UPDATE',
          resourceType: 'item',
          resourceId: 'ITEM-123',
          resourceName: 'Surgical Gloves',
          changes: {
            quantity: { before: 100, after: 150 },
          },
          timestamp: Date.now() - 7200000,
          ipAddress: '192.168.1.101',
          userAgent: 'Safari/537.36',
          status: 'success',
        },
        {
          id: 'LOG-003',
          userId: 'USER-1',
          userName: 'Admin User',
          action: 'DELETE',
          resourceType: 'user',
          resourceId: 'USER-40',
          resourceName: 'Inactive User',
          timestamp: Date.now() - 10800000,
          ipAddress: '192.168.1.100',
          userAgent: 'Chrome/120.0',
          status: 'failure',
          errorMessage: 'User has active requests',
        },
      ]

      setLogs(mockLogs)
      setTotal(mockLogs.length)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch audit logs')
    } finally {
      setLoading(false)
    }
  }, [])

  const exportLogs = useCallback(
    async (format: 'csv' | 'json', _filters?: AuditLogFilters) => {
      try {
        if (format === 'json') {
          const dataStr = JSON.stringify(logs, null, 2)
          downloadFile(dataStr, 'audit-logs.json', 'application/json')
        } else {
          const csv = convertToCSV(logs)
          downloadFile(csv, 'audit-logs.csv', 'text/csv')
        }
      } catch (err: any) {
        setError(err.message || 'Failed to export logs')
      }
    },
    [logs]
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    logs,
    loading,
    error,
    total,
    fetchLogs,
    exportLogs,
    clearError,
  }
}

function convertToCSV(logs: AuditLog[]): string {
  const headers = [
    'Timestamp',
    'User',
    'Action',
    'Resource Type',
    'Resource',
    'Status',
    'IP Address',
  ]
  const rows = logs.map((log) => [
    new Date(log.timestamp).toISOString(),
    log.userName,
    log.action,
    log.resourceType,
    log.resourceName,
    log.status,
    log.ipAddress,
  ])

  const csv = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n')

  return csv
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
