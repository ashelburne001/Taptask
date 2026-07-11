import type { ChartData } from '../../../hooks/useAnalytics'

interface UserActivityChartProps {
  data: ChartData[]
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b']

export default function UserActivityChart({ data }: UserActivityChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="space-y-6">
      {/* Horizontal Bar Chart */}
      <div className="space-y-4">
        {data.map((item, idx) => {
          const percentage = (item.value / total) * 100

          return (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                <p className="text-sm font-bold text-gray-600">{item.value}</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: COLORS[idx % COLORS.length],
                  }}
                />
              </div>
              <p className="text-xs text-gray-500">{percentage.toFixed(1)}% of total</p>
            </div>
          )
        })}
      </div>

      {/* Summary Stats */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">Total Active Users</p>
          <p className="text-lg font-bold text-gray-900">{total}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">Most Active Role</p>
          <p className="text-lg font-bold text-gray-900">
            {data.reduce((max, item) => (item.value > max.value ? item : max)).name}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">Least Active Role</p>
          <p className="text-lg font-bold text-gray-900">
            {data.reduce((min, item) => (item.value < min.value ? item : min)).name}
          </p>
        </div>
      </div>
    </div>
  )
}
