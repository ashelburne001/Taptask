import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { FormField } from '../shared';
import { MessageSquare } from 'lucide-react';
export default function TeamsSettingsSection({ settings, onSave, }) {
    const [webhookUrl, setWebhookUrl] = useState(settings?.teamsWebhookUrl || '');
    const [loading, setLoading] = useState(false);
    async function handleSave() {
        setLoading(true);
        try {
            await onSave('Teams', {
                teamsWebhookUrl: webhookUrl,
            });
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-2 mb-6", children: [_jsx(MessageSquare, { className: "w-6 h-6 text-brand-accentblue" }), _jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Microsoft Teams" })] }), _jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: [_jsx("p", { className: "text-sm text-blue-800 mb-2", children: "Configure Teams webhook for sending notifications to your teams channel." }), _jsx("a", { href: "https://learn.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/connectors-using", target: "_blank", rel: "noopener noreferrer", className: "text-xs text-blue-600 hover:underline", children: "Learn how to create a Teams webhook \u2192" })] }), _jsx("div", { className: "space-y-4", children: _jsx(FormField, { label: "Teams Webhook URL", name: "webhookUrl", type: "text", value: webhookUrl, onChange: (value) => setWebhookUrl(value), placeholder: "https://outlook.webhook.office.com/webhookb2/...", helpText: "Paste your Teams incoming webhook URL here" }) }), _jsxs("div", { className: "border-t pt-6 space-y-4", children: [_jsx("button", { onClick: handleSave, disabled: loading, className: "px-6 py-2 bg-brand-accentblue text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50", children: loading ? 'Saving...' : 'Save Teams Settings' }), _jsx("button", { type: "button", disabled: !webhookUrl || loading, className: "ml-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50", children: "Test Webhook" })] })] }));
}
//# sourceMappingURL=TeamsSettingsSection.js.map