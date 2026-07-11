import { Package, Users, TrendingUp, Clock, AlertTriangle, DollarSign } from 'lucide-react'
import type { AnalyticsMetrics } from '../../../hooks/useAnalytics'

interface MetricsGridProps {
  metrics: AnalyticsMetrics
}

interface MetricCard {
  label: string
  value: string | number
  unit?: string
  icon: React.ReactNode
  color: string
  trend?: number
}

export default function MetricsGrid({ metrics }: MetricsGridProps) {
  const cards: MetricCard[] = [
    {
      label: 'Total Items',
      value: metrics.totalItems,
      icon: <Package className="w-6 h-6" />,
      color: 'bg-blue-50 border-blue-200',
      trend: 5,
    },
    {
      label: 'Low Stock Items',
      value: metrics.lowStockItems,
      icon: <AlertTriangle className="w-6 h-6 text-orange-600" />,
      color: 'bg-orange-50 border-orange-200',
      trend: -2,
    },
    {
      label: 'Total Users',
      value: metrics.totalUsers,
      icon: <Users className="w-6 h-6" />,
      color: 'bg-green-50 border-green-200',
      trend: 8,
    },
    {
      label: 'Active Users',
      value: metrics.activeUsers,
      icon: <TrendingUp className="w-6 h-6 text-green-600" />,
      color: 'bg-green-50 border-green-200',
      trend: 3,
    },
    {
      label: 'Completion Rate',
      value: metrics.completionRate,
      unit: '%',
      icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
      color: 'bg-purple-50 border-purple-200',
      trend: 2.1,
    },
    {
      label: 'Avg Response Time',
      value: metrics.averageResponseTime,
      unit: 'hrs',
      icon: <Clock className="w-6 h-6 text-indigo-600" />,
      color: 'bg-indigo-50 border-indigo-200',
      trend: -0.5,
    },
    {
      label: 'Inventory Value',
      value: `$${(metrics.inventoryValue / 1000).toFixed(1)}k`,
      icon: <DollarSign className="w-6 h-6 text-yellow-600" />,
      color: 'bg-yellow-50 border-yellow-200',
      trend: 12.3,
    },
    {
      label: 'Pending Requests',
      value: metrics.pendingRequests,
      icon: <TrendingUp className="w-6 h-6 text-red-600" />,
      color: 'bg-red-50 border-red-200',
      trend: -5,
    },
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`border rounded-lg p-4 ${card.color} transition hover:shadow-md`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-white rounded-lg">{card.icon}</div>
            {card.trend && (
              <span
                className={`text-xs font-semibold px-2 py-1 rounded ${
                  card.trend > 0
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {card.trend > 0 ? '+' : ''}{card.trend}%
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-1">{card.label}</p>
          <p className="text-2xl font-bold text-gray-900">
            {card.value}
            {card.unit && <span className="text-sm text-gray-600 ml-1">{card.unit}</span>}
          </p>
        </div>
      ))}
    </div>
  )
}
