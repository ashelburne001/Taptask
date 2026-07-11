import type { ChartData } from '../../../hooks/useAnalytics'

interface InventoryChartProps {
  data: ChartData[]
}

const COLORS = ['#10b981', '#f59e0b', '#ef4444']

export default function InventoryChart({ data }: InventoryChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const percentages = data.map((item) => (item.value / total) * 100)

  return (
    <div className="space-y-6">
      {/* Pie Chart */}
      <div className="flex justify-center">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {data.map((item, idx) => {
              let offset = 0
              for (let i = 0; i < idx; i++) {
                offset += (data[i].value / total) * 360
              }
              const angle = (item.value / total) * 360
              const radius = 30
              const circumference = 2 * Math.PI * radius

              return (
                <circle
                  key={idx}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke={COLORS[idx % COLORS.length]}
                  strokeWidth="20"
                  strokeDasharray={(angle / 360) * circumference}
                  strokeDashoffset={-(offset / 360) * circumference}
                  style={{
                    transition: 'all 0.3s ease',
                  }}
                />
              )
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{total}</p>
              <p className="text-sm text-gray-600">Total Items</p>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: COLORS[idx % COLORS.length] }}
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{item.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">{item.value}</p>
              <p className="text-xs text-gray-600">{percentages[idx].toFixed(1)}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
