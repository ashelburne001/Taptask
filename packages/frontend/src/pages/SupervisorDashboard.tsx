import { useState, useEffect } from 'react'
import { apiClient } from '../api/client'
import { TrendingUp, AlertTriangle, Clock, Package, Zap, BarChart3, Loader } from 'lucide-react'

interface KPI {
  openRequests: number
  completedToday: number
  avgResponseTime: number
  overdueRequests: number
  requestsByDepartment: Array<{ name: string; count: number }>
  mostRequestedItems: Array<{ name: string; count: number }>
}

interface TechnicianStat {
  name: string
  completed_count: number
  avg_response_minutes: number
}

interface InventoryHealth {
  critical: { count: number; items: any[] }
  low: { count: number; items: any[] }
  stockedOut: { count: number; items: any[] }
}

export default function SupervisorDashboard() {
  const [kpis, setKpis] = useState<KPI | null>(null)
  const [techStats, setTechStats] = useState<TechnicianStat[]>([])
  const [inventory, setInventory] = useState<InventoryHealth | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    try {
      setLoading(true)
      const [kpiData, techData, invData] = await Promise.all([
        apiClient.getDashboardKpis(),
        apiClient.getTechnicianStats(),
        apiClient.getInventoryHealth(),
      ])
      setKpis(kpiData)
      setTechStats(techData.stats || [])
      setInventory(invData)
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ icon: Icon, label, value, color = 'blue' }: any) => (
    <div className={`card bg-gradient-to-br from-${color}-50 to-${color}-100 border-${color}-200`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <Icon className={`w-10 h-10 text-${color}-600`} />
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-12 h-12 animate-spin text-brand-accentblue" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 safe-area">
      {/* Header */}
      <div className="bg-brand-navy text-white p-6">
        <h1 className="text-3xl font-bold">Supervisor Dashboard</h1>
        <p className="text-blue-200">Real-time operational metrics</p>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Package} label="Open Requests" value={kpis?.openRequests} color="orange" />
          <StatCard icon={TrendingUp} label="Completed Today" value={kpis?.completedToday} color="green" />
          <StatCard icon={Clock} label="Avg Response Time (min)" value={kpis?.avgResponseTime} color="blue" />
          <StatCard
            icon={AlertTriangle}
            label="Overdue Requests"
            value={kpis?.overdueRequests}
            color={kpis?.overdueRequests ? 'red' : 'gray'}
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6 border-b border-gray-200">
          <div className="flex flex-wrap">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'technicians', label: 'Technician Performance' },
              { id: 'inventory', label: 'Inventory Health' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 px-6 font-medium border-b-2 transition text-center ${
                  activeTab === tab.id
                    ? 'border-brand-navy text-brand-navy'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Requests by Department */}
            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Requests by Department
              </h3>
              <div className="space-y-3">
                {kpis?.requestsByDepartment.map((dept) => (
                  <div key={dept.name} className="flex items-center justify-between">
                    <span className="text-gray-700">{dept.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-brand-accentblue h-2 rounded-full"
                          style={{ width: `${(dept.count / (kpis?.openRequests || 1)) * 100}%` }}
                        />
                      </div>
                      <span className="font-semibold text-gray-900 w-8">{dept.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Requested Items */}
            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Most Requested Items
              </h3>
              <div className="space-y-2">
                {kpis?.mostRequestedItems.map((item, idx) => (
                  <div key={item.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-gray-700">
                      {idx + 1}. {item.name}
                    </span>
                    <span className="font-semibold text-brand-accentblue">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Technician Performance Tab */}
        {activeTab === 'technicians' && (
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Technician Performance
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Technician</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Completed</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Avg Response</th>
                  </tr>
                </thead>
                <tbody>
                  {techStats.map((tech) => (
                    <tr key={tech.name} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900 font-medium">{tech.name}</td>
                      <td className="py-3 px-4 text-right text-gray-900 font-semibold">{tech.completed_count}</td>
                      <td className="py-3 px-4 text-right text-gray-600">
                        {Math.round(tech.avg_response_minutes)} min
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Inventory Health Tab */}
        {activeTab === 'inventory' && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Critical */}
            <div className="card border-l-4 border-red-600">
              <h3 className="text-lg font-bold text-red-700 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Critical ({inventory?.critical.count})
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {inventory?.critical.items.map((item) => (
                  <div key={item.bin_code} className="p-2 bg-red-50 rounded text-sm">
                    <p className="font-medium text-red-900">{item.name}</p>
                    <p className="text-red-700">{item.current_quantity} / {item.par_level} units</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Low Stock */}
            <div className="card border-l-4 border-yellow-600">
              <h3 className="text-lg font-bold text-yellow-700 mb-4">Low Stock ({inventory?.low.count})</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {inventory?.low.items.map((item) => (
                  <div key={item.bin_code} className="p-2 bg-yellow-50 rounded text-sm">
                    <p className="font-medium text-yellow-900">{item.name}</p>
                    <p className="text-yellow-700">{item.current_quantity} / {item.par_level} units</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stocked Out */}
            <div className="card border-l-4 border-gray-600">
              <h3 className="text-lg font-bold text-gray-700 mb-4">Out of Stock ({inventory?.stockedOut.count})</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {inventory?.stockedOut.items.map((item) => (
                  <div key={item.bin_code} className="p-2 bg-gray-50 rounded text-sm">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-gray-600">{item.bin_code}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <button onClick={fetchDashboardData} className="btn-secondary">
            🔄 Refresh Data
          </button>
        </div>
      </div>
    </div>
  )
}
