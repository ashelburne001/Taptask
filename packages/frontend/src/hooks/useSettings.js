import { useState, useCallback } from 'react';
export function useSettings() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchSettings = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            // TODO: Implement API endpoint for fetching settings
            // For now, use default values
            setSettings({
                appName: 'TapTask',
                defaultParLevel: 10,
                defaultBinSize: 50,
                sessionTimeoutMinutes: 60,
                offlineModeEnabled: true,
                darkModeEnabled: true,
            });
        }
        catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch settings');
        }
        finally {
            setLoading(false);
        }
    }, []);
    const updateSettings = useCallback(async (data) => {
        try {
            setError(null);
            // TODO: Implement API endpoint for updating settings
            // await apiClient.updateSettings(data)
            setSettings((prev) => (prev ? { ...prev, ...data } : null));
        }
        catch (err) {
            const errorMsg = err.response?.data?.error || 'Failed to update settings';
            setError(errorMsg);
            throw new Error(errorMsg);
        }
    }, []);
    const clearError = useCallback(() => {
        setError(null);
    }, []);
    return {
        settings,
        loading,
        error,
        fetchSettings,
        updateSettings,
        clearError,
    };
}
//# sourceMappingURL=useSettings.js.map