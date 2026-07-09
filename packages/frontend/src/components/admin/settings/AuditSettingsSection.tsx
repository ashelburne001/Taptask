import { Lock, Trash2 } from 'lucide-react'
import { FormField } from '../shared'
import { useState } from 'react'

export default function AuditSettingsSection(): JSX.Element {
  const [retentionDays, setRetentionDays] = useState(30)
  const [_loading, _setLoading] = useState(false)

  async function handleSave() {
    _setLoading(true)
    try {
      // TODO: Implement audit settings API
    } finally {
      _setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Lock className="w-6 h-6 text-brand-accentblue" />
        <h2 className="text-xl font-bold text-gray-900">Audit & Compliance</h2>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          Configure retention policies and compliance settings for audit logs.
        </p>
      </div>

      <div className="space-y-4">
        <FormField
          label="Audit Log Retention (days)"
          name="retentionDays"
          type="number"
          value={retentionDays}
          onChange={(value) => setRetentionDays(Number(value))}
          helpText="Logs older than this will be archived. Set to 0 to disable archival."
        />

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-gray-900">Audit Log Status</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Total Logs</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
            </div>
            <div>
              <p className="text-gray-600">Last Cleanup</p>
              <p className="text-sm font-medium text-gray-900">2 days ago</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-6 space-y-3">
        <button
          onClick={handleSave}
          disabled={_loading}
          className="px-6 py-2 bg-brand-accentblue text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {_loading ? 'Saving...' : 'Save Audit Settings'}
        </button>

        <button
          type="button"
          className="ml-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          Run Cleanup Now
        </button>

        <button
          type="button"
          className="ml-2 px-6 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Export Logs
        </button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Audit logs are immutable for compliance. Cleanup only
          archives old logs, never deletes them.
        </p>
      </div>
    </div>
  )
}
