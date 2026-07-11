import type { TimeSeriesData } from '../../../hooks/useAnalytics'

interface RequestsTrendChartProps {
  data: TimeSeriesData[]
}

export default function RequestsTrendChart({ data }: RequestsTrendChartProps) {
  const maxRequests = Math.max(...data.map((d) => d.requests))
  const maxCompletions = Math.max(...data.map((d) => d.completions))
  const maxValue = Math.max(maxRequests, maxCompletions)

  const dateFormatter = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="space-y-6">
      {/* Chart */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex gap-4 items-end justify-between h-80">
          {data.map((item, idx) => {
            const reqHeight = (item.requests / maxValue) * 100
            const compHeight = (item.completions / maxValue) * 100

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex gap-1 items-end justify-center h-64">
                  <div className="flex-1 bg-blue-400 rounded-t opacity-75 relative group"
                    style={{ height: `${reqHeight}%` }}>
                    <div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {item.requests}
                    </div>
                  </div>
                  <div className="flex-1 bg-green-400 rounded-t opacity-75 relative group"
                    style={{ height: `${compHeight}%` }}>
                    <div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {item.completions}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 text-center">
                  {dateFormatter(item.timestamp)}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-blue-400 rounded" />
          <div>
            <p className="text-sm font-medium text-gray-900">Total Requests</p>
            <p className="text-xs text-gray-600">
              Avg: {(data.reduce((sum, d) => sum + d.requests, 0) / data.length).toFixed(0)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-green-400 rounded" />
          <div>
            <p className="text-sm font-medium text-gray-900">Completed</p>
            <p className="text-xs text-gray-600">
              Avg: {(data.reduce((sum, d) => sum + d.completions, 0) / data.length).toFixed(0)}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="text-xs text-gray-600 uppercase">Peak Requests</p>
          <p className="text-2xl font-bold text-gray-900">
            {Math.max(...data.map((d) => d.requests))}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 uppercase">Avg Completion</p>
          <p className="text-2xl font-bold text-gray-900">
            {((data.reduce((sum, d) => sum + d.completions / d.requests, 0) / data.length) * 100).toFixed(1)}%
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 uppercase">Active Users</p>
          <p className="text-2xl font-bold text-gray-900">
            {Math.max(...data.map((d) => d.users))}
          </p>
        </div>
      </div>
    </div>
  )
}
