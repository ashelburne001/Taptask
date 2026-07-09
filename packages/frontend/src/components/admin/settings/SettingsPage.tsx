import { useEffect, useState } from 'react'
import { Mail, MessageSquare, Settings, Lock } from 'lucide-react'
import { useSettings } from '../../../hooks/useSettings'
import { Toast } from '../shared'
import EmailSettingsSection from './EmailSettingsSection'
import TeamsSettingsSection from './TeamsSettingsSection'
import SystemSettingsSection from './SystemSettingsSection'
import AuditSettingsSection from './AuditSettingsSection'

type Tab = 'email' | 'teams' | 'system' | 'audit'

export default function SettingsPage() {
  const { settings, loading, error, fetchSettings, updateSettings } = useSettings()
  const [activeTab, setActiveTab] = useState<Tab>('email')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const handleSave = async (section: string, data: any) => {
    try {
      await updateSettings(data)
      setToast({
        message: `${section} settings saved successfully`,
        type: 'success',
      })
    } catch (err) {
      setToast({
        message: `Failed to save ${section} settings`,
        type: 'error',
      })
    }
  }

  const tabs: Array<{ id: Tab; label: string; icon: React.ReactNode }> = [
    { id: 'email', label: 'Email', icon: <Mail className="w-5 h-5" /> },
    { id: 'teams', label: 'Teams', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'system', label: 'System', icon: <Settings className="w-5 h-5" /> },
    { id: 'audit', label: 'Audit', icon: <Lock className="w-5 h-5" /> },
  ]

  if (loading) {
    return (
      <div className="p-6">
        <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Configure system settings and integrations</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow border-b border-gray-200">
        <div className="flex flex-wrap gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-brand-navy text-brand-navy'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === 'email' && (
          <EmailSettingsSection settings={settings} onSave={handleSave} />
        )}
        {activeTab === 'teams' && (
          <TeamsSettingsSection settings={settings} onSave={handleSave} />
        )}
        {activeTab === 'system' && (
          <SystemSettingsSection settings={settings} onSave={handleSave} />
        )}
        {activeTab === 'audit' && (
          <AuditSettingsSection />
        )}
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
