import { Link, useLocation } from 'react-router-dom'
import { Users, Building2, Package, Settings, FileText, BarChart3, X } from 'lucide-react'

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const location = useLocation()

  const menuItems = [
    { href: '/admin/users', icon: Users, label: 'Users', badge: null },
    { href: '/admin/departments', icon: Building2, label: 'Departments', badge: null },
    { href: '/admin/items', icon: Package, label: 'Items', badge: null },
    { href: '/admin/settings', icon: Settings, label: 'Settings', badge: null },
    { href: '/admin/audit-logs', icon: FileText, label: 'Audit Logs', badge: null },
    { href: '/admin/analytics', icon: BarChart3, label: 'Analytics', badge: null },
  ]

  const isActive = (href: string) => location.pathname === href

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-brand-navy text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-blue-800 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">TapTask</h1>
            <p className="text-xs text-blue-200">Admin Panel</p>
          </div>
          <button onClick={onClose} className="lg:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  active
                    ? 'bg-blue-600 text-white'
                    : 'text-blue-100 hover:bg-blue-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-blue-800">
          <p className="text-xs text-blue-300 text-center">
            TapTask v1.0.0
          </p>
        </div>
      </aside>
    </>
  )
}
