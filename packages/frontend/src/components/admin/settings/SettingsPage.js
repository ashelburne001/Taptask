import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Mail, MessageSquare, Settings, Lock } from 'lucide-react';
import { useSettings } from '../../../hooks/useSettings';
import { Toast } from '../shared';
import EmailSettingsSection from './EmailSettingsSection';
import TeamsSettingsSection from './TeamsSettingsSection';
import SystemSettingsSection from './SystemSettingsSection';
import AuditSettingsSection from './AuditSettingsSection';
export default function SettingsPage() {
    const { settings, loading, error, fetchSettings, updateSettings } = useSettings();
    const [activeTab, setActiveTab] = useState('email');
    const [toast, setToast] = useState(null);
    useEffect(() => {
        fetchSettings();
    }, []);
    const handleSave = async (section, data) => {
        try {
            await updateSettings(data);
            setToast({
                message: `${section} settings saved successfully`,
                type: 'success',
            });
        }
        catch (err) {
            setToast({
                message: `Failed to save ${section} settings`,
                type: 'error',
            });
        }
    };
    const tabs = [
        { id: 'email', label: 'Email', icon: _jsx(Mail, { className: "w-5 h-5" }) },
        { id: 'teams', label: 'Teams', icon: _jsx(MessageSquare, { className: "w-5 h-5" }) },
        { id: 'system', label: 'System', icon: _jsx(Settings, { className: "w-5 h-5" }) },
        { id: 'audit', label: 'Audit', icon: _jsx(Lock, { className: "w-5 h-5" }) },
    ];
    if (loading) {
        return (_jsx("div", { className: "p-6", children: _jsx("div", { className: "h-96 bg-gray-200 rounded-lg animate-pulse" }) }));
    }
    return (_jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Settings" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Configure system settings and integrations" })] }), error && (_jsx("div", { className: "p-4 bg-red-50 border border-red-200 rounded-lg text-red-800", children: error })), _jsx("div", { className: "bg-white rounded-lg shadow border-b border-gray-200", children: _jsx("div", { className: "flex flex-wrap gap-0", children: tabs.map((tab) => (_jsxs("button", { onClick: () => setActiveTab(tab.id), className: `flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition ${activeTab === tab.id
                            ? 'border-brand-navy text-brand-navy'
                            : 'border-transparent text-gray-600 hover:text-gray-900'}`, children: [tab.icon, tab.label] }, tab.id))) }) }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [activeTab === 'email' && (_jsx(EmailSettingsSection, { settings: settings, onSave: handleSave })), activeTab === 'teams' && (_jsx(TeamsSettingsSection, { settings: settings, onSave: handleSave })), activeTab === 'system' && (_jsx(SystemSettingsSection, { settings: settings, onSave: handleSave })), activeTab === 'audit' && (_jsx(AuditSettingsSection, {}))] }), toast && (_jsx(Toast, { message: toast.message, type: toast.type, onClose: () => setToast(null) }))] }));
}
//# sourceMappingURL=SettingsPage.js.map