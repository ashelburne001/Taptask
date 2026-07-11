import type { ChartData } from '../../../hooks/useAnalytics'

interface DepartmentChartProps {
  data: ChartData[]
}

export default function DepartmentChart({ data }: DepartmentChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const sorted = [...data].sort((a, b) => b.value - a.value)
  const max = sorted[0].value

  return (
    <div className="space-y-6">
      {/* Vertical Bar Chart */}
      <div className="bg-gray-50 rounded-lg p-6 min-h-64">
        <div className="flex items-end justify-between h-48 gap-3">
          {sorted.map((item, idx) => {
            const height = (item.value / max) * 100

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-gradient-to-b from-brand-accentblue to-blue-600 rounded-t relative group"
                  style={{ height: `${height}%` }}>
                  <div className="hidden group-hover:block absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {item.value}
                  </div>
                </div>
                <p className="text-xs text-gray-600 text-center mt-2 font-medium">
                  {item.name}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Detailed List */}
      <div className="space-y-2">
        {sorted.map((item, idx) => {
          const percentage = (item.value / total) * 100

          return (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 flex-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: [
                      '#3b82f6',
                      '#8b5cf6',
                      '#ec4899',
                      '#f59e0b',
                      '#10b981',
                    ][idx % 5],
                  }}
                />
                <p className="font-medium text-gray-900">{item.name}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">{item.value}</p>
                <p className="text-xs text-gray-600">{percentage.toFixed(1)}%</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="grid md:grid-cols-3 gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
        <div>
          <p className="text-xs text-gray-600 uppercase mb-1">Top Department</p>
          <p className="text-lg font-bold text-gray-900">{sorted[0].name}</p>
          <p className="text-sm text-gray-600">{sorted[0].value} requests</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 uppercase mb-1">Total Requests</p>
          <p className="text-lg font-bold text-gray-900">{total}</p>
          <p className="text-sm text-gray-600">Across {data.length} departments</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 uppercase mb-1">Average</p>
          <p className="text-lg font-bold text-gray-900">
            {(total / data.length).toFixed(0)}
          </p>
          <p className="text-sm text-gray-600">Per department</p>
        </div>
      </div>
    </div>
  )
}
