import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { FormField } from '../shared';
import { Mail } from 'lucide-react';
export default function EmailSettingsSection({ settings, onSave, }) {
    const [apiKey, setApiKey] = useState(settings?.emailApiKey || '');
    const [fromAddress, setFromAddress] = useState(settings?.emailFromAddress || '');
    const [fromName, setFromName] = useState(settings?.emailFromName || 'TapTask');
    const [loading, setLoading] = useState(false);
    const [showKey, setShowKey] = useState(false);
    async function handleSave() {
        setLoading(true);
        try {
            await onSave('Email', {
                emailApiKey: apiKey,
                emailFromAddress: fromAddress,
                emailFromName: fromName,
            });
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-2 mb-6", children: [_jsx(Mail, { className: "w-6 h-6 text-brand-accentblue" }), _jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Email Notifications" })] }), _jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: _jsx("p", { className: "text-sm text-blue-800", children: "Configure SendGrid API key for sending email notifications to users." }) }), _jsxs("div", { className: "space-y-4", children: [_jsx(FormField, { label: "SendGrid API Key", name: "apiKey", type: showKey ? 'text' : 'password', value: apiKey, onChange: (value) => setApiKey(value), placeholder: "SG.xxxxxxxxxxxxx" }), _jsxs("button", { type: "button", onClick: () => setShowKey(!showKey), className: "text-sm text-brand-accentblue hover:underline", children: [showKey ? 'Hide' : 'Show', " API Key"] }), _jsx(FormField, { label: "From Email Address", name: "fromAddress", type: "email", value: fromAddress, onChange: (value) => setFromAddress(value), placeholder: "noreply@hospital.local" }), _jsx(FormField, { label: "From Name", name: "fromName", type: "text", value: fromName, onChange: (value) => setFromName(value), placeholder: "TapTask Notifications" })] }), _jsx("div", { className: "border-t pt-6", children: _jsx("button", { onClick: handleSave, disabled: loading, className: "px-6 py-2 bg-brand-accentblue text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50", children: loading ? 'Saving...' : 'Save Email Settings' }) })] }));
}
//# sourceMappingURL=EmailSettingsSection.js.map