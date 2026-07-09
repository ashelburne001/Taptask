import { useState } from 'react'
import { FormField } from '../shared'
import { Settings } from 'lucide-react'

interface SystemSettingsSectionProps {
  settings: any
  onSave: (section: string, data: any) => void
}

export default function SystemSettingsSection({
  settings,
  onSave,
}: SystemSettingsSectionProps) {
  const [appName, setAppName] = useState(settings?.appName || 'TapTask')
  const [logoUrl, setLogoUrl] = useState(settings?.logoUrl || '')
  const [defaultParLevel, setDefaultParLevel] = useState(settings?.defaultParLevel || 10)
  const [defaultBinSize, setDefaultBinSize] = useState(settings?.defaultBinSize || 50)
  const [sessionTimeout, setSessionTimeout] = useState(
    settings?.sessionTimeoutMinutes || 60
  )
  const [offlineModeEnabled, setOfflineModeEnabled] = useState(
    settings?.offlineModeEnabled || true
  )
  const [darkModeEnabled, setDarkModeEnabled] = useState(
    settings?.darkModeEnabled || true
  )
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    setLoading(true)
    try {
      await onSave('System', {
        appName,
        logoUrl,
        defaultParLevel,
        defaultBinSize,
        sessionTimeoutMinutes: sessionTimeout,
        offlineModeEnabled,
        darkModeEnabled,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-6 h-6 text-brand-accentblue" />
        <h2 className="text-xl font-bold text-gray-900">System Settings</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <FormField
          label="Application Name"
          name="appName"
          type="text"
          value={appName}
          onChange={(value) => setAppName(value as string)}
          placeholder="TapTask"
        />

        <FormField
          label="Logo URL"
          name="logoUrl"
          type="text"
          value={logoUrl}
          onChange={(value) => setLogoUrl(value as string)}
          placeholder="https://example.com/logo.png"
        />

        <FormField
          label="Default PAR Level"
          name="defaultParLevel"
          type="number"
          value={defaultParLevel}
          onChange={(value) => setDefaultParLevel(Number(value))}
        />

        <FormField
          label="Default Bin Size"
          name="defaultBinSize"
          type="number"
          value={defaultBinSize}
          onChange={(value) => setDefaultBinSize(Number(value))}
        />

        <FormField
          label="Session Timeout (minutes)"
          name="sessionTimeout"
          type="number"
          value={sessionTimeout}
          onChange={(value) => setSessionTimeout(Number(value))}
          helpText="Auto-logout after inactivity"
        />
      </div>

      <div className="border-t pt-6 space-y-4">
        <div className="space-y-3">
          <FormField
            label="Enable Offline Mode"
            name="offlineModeEnabled"
            type="toggle"
            value={offlineModeEnabled}
            onChange={(value) => setOfflineModeEnabled(value as boolean)}
          />

          <FormField
            label="Enable Dark Mode"
            name="darkModeEnabled"
            type="toggle"
            value={darkModeEnabled}
            onChange={(value) => setDarkModeEnabled(value as boolean)}
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2 bg-brand-accentblue text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save System Settings'}
        </button>
      </div>
    </div>
  )
}
