import { useState } from 'react'
import { Settings, Users, Package, Building2, LogOut } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'

export default function AdminPanel() {
  const { logout } = useAuthStore()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('users')

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 safe-area">
      {/* Header */}
      <div className="bg-brand-navy text-white p-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-blue-200">System Management</p>
        </div>
        <button onClick={handleLogout} className="btn-secondary flex items-center gap-2">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-wrap">
          {[
            { id: 'users', label: 'Users', icon: Users },
            { id: 'departments', label: 'Departments', icon: Building2 },
            { id: 'items', label: 'Items', icon: Package },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-6 font-medium border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-brand-navy text-brand-navy'
                    : 'border-transparent text-gray-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {activeTab === 'users' && (
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">User Management</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-blue-800">User management interface coming soon</p>
              <p className="text-blue-600 text-sm mt-2">Features: Create/Edit/Delete users, Assign roles, Reset passwords</p>
            </div>
          </div>
        )}

        {activeTab === 'departments' && (
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Department Management</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-blue-800">Department management interface coming soon</p>
              <p className="text-blue-600 text-sm mt-2">Features: Create/Edit/Delete departments, Manage locations</p>
            </div>
          </div>
        )}

        {activeTab === 'items' && (
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Item Management</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-blue-800">Item management interface coming soon</p>
              <p className="text-blue-600 text-sm mt-2">Features: Create/Edit/Delete items, Bulk CSV import, Barcode generation</p>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">System Settings</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-blue-800">Configuration options</p>
                <p className="text-blue-600 text-sm mt-2">Features: Email settings, Notification rules, Authentication config</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
