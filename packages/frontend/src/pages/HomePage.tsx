import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { LogOut, QrCode, Zap, BarChart3, Settings } from 'lucide-react'

export default function HomePage() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  // Role-based menu
  const getMenuItems = () => {
    const baseItems = [
      {
        icon: QrCode,
        label: 'Scan Bin',
        description: 'Tap NFC tag or scan QR code',
        action: () => navigate('/request'),
        show: ['employee', 'technician', 'supervisor', 'admin'].includes(user?.role || ''),
      },
    ]

    if (user?.role === 'technician' || user?.role === 'supervisor' || user?.role === 'admin') {
      baseItems.push({
        icon: Zap,
        label: 'Refill Queue',
        description: 'View and manage requests',
        action: () => navigate('/queue'),
        show: true,
      })
    }

    if (user?.role === 'supervisor' || user?.role === 'admin') {
      baseItems.push({
        icon: BarChart3,
        label: 'Dashboard',
        description: 'View KPIs and analytics',
        action: () => navigate('/dashboard'),
        show: true,
      })
    }

    if (user?.role === 'admin') {
      baseItems.push({
        icon: Settings,
        label: 'Admin Panel',
        description: 'Manage system settings',
        action: () => navigate('/admin'),
        show: true,
      })
    }

    return baseItems.filter(item => item.show)
  }

  const menuItems = getMenuItems()

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-navy to-blue-900">
      {/* Header */}
      <div className="bg-brand-navy text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">TapTask</h1>
            <p className="text-blue-200 mt-1">NFC-Powered Kanban Replenishment</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {user?.name}!</h2>
          <p className="text-gray-600">
            Role: <span className="font-semibold capitalize">{user?.role}</span>
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                onClick={item.action}
                className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 text-left transform hover:scale-105"
              >
                <Icon className="w-12 h-12 text-brand-accentblue mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.label}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </button>
            )
          })}
        </div>

        {/* Quick Start Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-bold text-blue-900 mb-4">🚀 Quick Start</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="font-semibold text-blue-900 mb-2">1. Scan a Bin</p>
              <p className="text-blue-800">
                Tap an NFC tag or scan a QR code to open a bin's details
              </p>
            </div>
            <div>
              <p className="font-semibold text-blue-900 mb-2">2. Submit Request</p>
              <p className="text-blue-800">
                Select request type (refill/partial/damaged) and submit in seconds
              </p>
            </div>
            <div>
              <p className="font-semibold text-blue-900 mb-2">3. Track Status</p>
              <p className="text-blue-800">
                Technicians process requests and you can track progress in real-time
              </p>
            </div>
          </div>
        </div>

        {/* Available Test Bins */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📦 Available Test Bins</h3>
          <p className="text-gray-600 mb-4">
            Try these NFC tag codes to test the workflow:
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { code: 'KBN-ICU-0042', item: 'Saline Solution 0.9%', dept: 'ICU' },
              { code: 'KBN-ICU-0043', item: 'Latex Gloves Size L', dept: 'ICU' },
              { code: 'KBN-ER-0015', item: 'Sterile Gauze Pads', dept: 'ER' },
            ].map((bin) => (
              <button
                key={bin.code}
                onClick={() => navigate(`/tap/${bin.code}`)}
                className="border border-gray-300 rounded-lg p-4 hover:bg-gray-50 text-left transition"
              >
                <p className="font-mono font-bold text-brand-accentblue">{bin.code}</p>
                <p className="text-sm text-gray-600 mt-1">{bin.item}</p>
                <p className="text-xs text-gray-500 mt-1">Department: {bin.dept}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
