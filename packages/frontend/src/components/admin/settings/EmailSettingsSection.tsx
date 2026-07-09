import { useState } from 'react'
import { FormField } from '../shared'
import { Mail } from 'lucide-react'

interface EmailSettingsSectionProps {
  settings: any
  onSave: (section: string, data: any) => void
}

export default function EmailSettingsSection({
  settings,
  onSave,
}: EmailSettingsSectionProps) {
  const [apiKey, setApiKey] = useState(settings?.emailApiKey || '')
  const [fromAddress, setFromAddress] = useState(settings?.emailFromAddress || '')
  const [fromName, setFromName] = useState(settings?.emailFromName || 'TapTask')
  const [loading, setLoading] = useState(false)
  const [showKey, setShowKey] = useState(false)

  async function handleSave() {
    setLoading(true)
    try {
      await onSave('Email', {
        emailApiKey: apiKey,
        emailFromAddress: fromAddress,
        emailFromName: fromName,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Mail className="w-6 h-6 text-brand-accentblue" />
        <h2 className="text-xl font-bold text-gray-900">Email Notifications</h2>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          Configure SendGrid API key for sending email notifications to users.
        </p>
      </div>

      <div className="space-y-4">
        <FormField
          label="SendGrid API Key"
          name="apiKey"
          type={showKey ? 'text' : 'password'}
          value={apiKey}
          onChange={(value) => setApiKey(value as string)}
          placeholder="SG.xxxxxxxxxxxxx"
        />

        <button
          type="button"
          onClick={() => setShowKey(!showKey)}
          className="text-sm text-brand-accentblue hover:underline"
        >
          {showKey ? 'Hide' : 'Show'} API Key
        </button>

        <FormField
          label="From Email Address"
          name="fromAddress"
          type="email"
          value={fromAddress}
          onChange={(value) => setFromAddress(value as string)}
          placeholder="noreply@hospital.local"
        />

        <FormField
          label="From Name"
          name="fromName"
          type="text"
          value={fromName}
          onChange={(value) => setFromName(value as string)}
          placeholder="TapTask Notifications"
        />
      </div>

      <div className="border-t pt-6">
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2 bg-brand-accentblue text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Email Settings'}
        </button>
      </div>
    </div>
  )
}
