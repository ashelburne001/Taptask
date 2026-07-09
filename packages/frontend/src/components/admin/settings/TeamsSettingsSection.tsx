import { useState } from 'react'
import { FormField } from '../shared'
import { MessageSquare } from 'lucide-react'

interface TeamsSettingsSectionProps {
  settings: any
  onSave: (section: string, data: any) => void
}

export default function TeamsSettingsSection({
  settings,
  onSave,
}: TeamsSettingsSectionProps) {
  const [webhookUrl, setWebhookUrl] = useState(settings?.teamsWebhookUrl || '')
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    setLoading(true)
    try {
      await onSave('Teams', {
        teamsWebhookUrl: webhookUrl,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-6 h-6 text-brand-accentblue" />
        <h2 className="text-xl font-bold text-gray-900">Microsoft Teams</h2>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800 mb-2">
          Configure Teams webhook for sending notifications to your teams channel.
        </p>
        <a
          href="https://learn.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/connectors-using"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline"
        >
          Learn how to create a Teams webhook →
        </a>
      </div>

      <div className="space-y-4">
        <FormField
          label="Teams Webhook URL"
          name="webhookUrl"
          type="text"
          value={webhookUrl}
          onChange={(value) => setWebhookUrl(value as string)}
          placeholder="https://outlook.webhook.office.com/webhookb2/..."
          helpText="Paste your Teams incoming webhook URL here"
        />
      </div>

      <div className="border-t pt-6 space-y-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2 bg-brand-accentblue text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Teams Settings'}
        </button>

        <button
          type="button"
          disabled={!webhookUrl || loading}
          className="ml-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
        >
          Test Webhook
        </button>
      </div>
    </div>
  )
}
