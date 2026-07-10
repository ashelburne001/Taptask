import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import UsersPage from './users/UsersPage'
import DepartmentsPage from './departments/DepartmentsPage'
import ItemsPage from './items/ItemsPage'
import SettingsPage from './settings/SettingsPage'
import NFCManagementPage from './nfc/NFCManagementPage'
import AuditLogsPage from './audit-logs/AuditLogsPage'

// Placeholder page - to be implemented in next phase
const AnalyticsPage = () => <div className="p-6">Analytics - Coming Soon (Phase 7)</div>

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/admin/users" replace />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/departments" element={<DepartmentsPage />} />
              <Route path="/items" element={<ItemsPage />} />
              <Route path="/nfc" element={<NFCManagementPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/audit-logs" element={<AuditLogsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}
