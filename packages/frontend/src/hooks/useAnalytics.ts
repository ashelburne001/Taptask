import { useState, useCallback } from 'react'

export interface AnalyticsMetrics {
  totalItems: number
  lowStockItems: number
  totalUsers: number
  activeUsers: number
  totalRequests: number
  pendingRequests: number
  completionRate: number
  averageResponseTime: number
  inventoryValue: number
  lastUpdated: number
}

export interface ChartData {
  name: string
  value: number
}

export interface TimeSeriesData {
  timestamp: number
  requests: number
  completions: number
  users: number
}

interface UseAnalyticsReturn {
  metrics: AnalyticsMetrics | null
  chartData: {
    inventoryStatus: ChartData[]
    requestsTrend: TimeSeriesData[]
    userActivity: ChartData[]
    departmentPerformance: ChartData[]
  }
  loading: boolean
  error: string | null
  fetchAnalytics: (dateRange?: { start: number; end: number }) => Promise<void>
  clearError: () => void
}

export function useAnalytics(): UseAnalyticsReturn {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null)
  const [chartData, setChartData] = useState({
    inventoryStatus: [] as ChartData[],
    requestsTrend: [] as TimeSeriesData[],
    userActivity: [] as ChartData[],
    departmentPerformance: [] as ChartData[],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async (_dateRange?: { start: number; end: number }) => {
    setLoading(true)
    setError(null)

    try {
      // TODO: Replace with actual API calls
      // const response = await apiClient.getAnalytics(_dateRange)

      // Mock data for demonstration
      const mockMetrics: AnalyticsMetrics = {
        totalItems: 1247,
        lowStockItems: 34,
        totalUsers: 48,
        activeUsers: 32,
        totalRequests: 892,
        pendingRequests: 23,
        completionRate: 97.4,
        averageResponseTime: 2.3,
        inventoryValue: 450230.45,
        lastUpdated: Date.now(),
      }

      const mockInventoryStatus: ChartData[] = [
        { name: 'In Stock', value: 1150 },
        { name: 'Low Stock', value: 84 },
        { name: 'Out of Stock', value: 13 },
      ]

      const mockRequestsTrend: TimeSeriesData[] = [
        { timestamp: Date.now() - 604800000, requests: 142, completions: 138, users: 28 },
        { timestamp: Date.now() - 518400000, requests: 156, completions: 151, users: 31 },
        { timestamp: Date.now() - 432000000, requests: 168, completions: 163, users: 34 },
        { timestamp: Date.now() - 345600000, requests: 145, completions: 141, users: 29 },
        { timestamp: Date.now() - 259200000, requests: 178, completions: 174, users: 36 },
        { timestamp: Date.now() - 172800000, requests: 182, completions: 177, users: 38 },
        { timestamp: Date.now() - 86400000, requests: 121, completions: 118, users: 25 },
      ]

      const mockUserActivity: ChartData[] = [
        { name: 'Employees', value: 28 },
        { name: 'Technicians', value: 12 },
        { name: 'Supervisors', value: 4 },
        { name: 'Admins', value: 2 },
      ]

      const mockDepartmentPerformance: ChartData[] = [
        { name: 'Surgical', value: 245 },
        { name: 'Pharmacy', value: 189 },
        { name: 'Nursing', value: 198 },
        { name: 'ICU', value: 156 },
        { name: 'Emergency', value: 104 },
      ]

      setMetrics(mockMetrics)
      setChartData({
        inventoryStatus: mockInventoryStatus,
        requestsTrend: mockRequestsTrend,
        userActivity: mockUserActivity,
        departmentPerformance: mockDepartmentPerformance,
      })
    } catch (err: any) {
      setError(err.message || 'Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    metrics,
    chartData,
    loading,
    error,
    fetchAnalytics,
    clearError,
  }
}
