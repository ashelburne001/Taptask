import { useState, useCallback } from 'react'

export interface SettingsData {
  emailApiKey?: string
  emailFromAddress?: string
  emailFromName?: string
  teamsWebhookUrl?: string
  appName: string
  logoUrl?: string
  defaultParLevel: number
  defaultBinSize: number
  sessionTimeoutMinutes: number
  offlineModeEnabled: boolean
  darkModeEnabled: boolean
}

interface UseSettingsReturn {
  settings: SettingsData | null
  loading: boolean
  error: string | null
  fetchSettings: () => Promise<void>
  updateSettings: (data: Partial<SettingsData>) => Promise<void>
  clearError: () => void
}

export function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useState<SettingsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      // TODO: Implement API endpoint for fetching settings
      // For now, use default values
      setSettings({
        appName: 'TapTask',
        defaultParLevel: 10,
        defaultBinSize: 50,
        sessionTimeoutMinutes: 60,
        offlineModeEnabled: true,
        darkModeEnabled: true,
      })
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch settings')
    } finally {
      setLoading(false)
    }
  }, [])

  const updateSettings = useCallback(async (data: Partial<SettingsData>) => {
    try {
      setError(null)
      // TODO: Implement API endpoint for updating settings
      // await apiClient.updateSettings(data)
      setSettings((prev) => (prev ? { ...prev, ...data } : null))
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to update settings'
      setError(errorMsg)
      throw new Error(errorMsg)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    settings,
    loading,
    error,
    fetchSettings,
    updateSettings,
    clearError,
  }
}
