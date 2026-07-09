import { useState } from 'react'
import { Wifi, Radio, Upload } from 'lucide-react'
import NFCReader from './NFCReader'
import NFCWriter from './NFCWriter'
import NFCBulkAssign from './NFCBulkAssign'

type Tab = 'read' | 'write' | 'bulk'

export default function NFCManagementPage() {
  const [activeTab, setActiveTab] = useState<Tab>('read')

  const tabs: Array<{ id: Tab; label: string; icon: React.ReactNode }> = [
    { id: 'read', label: 'Read', icon: <Radio className="w-5 h-5" /> },
    { id: 'write', label: 'Write', icon: <Wifi className="w-5 h-5" /> },
    { id: 'bulk', label: 'Bulk Assign', icon: <Upload className="w-5 h-5" /> },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">NFC Management</h1>
        <p className="text-gray-600 mt-1">Read, write, and manage NFC tags for inventory items</p>
      </div>

      {/* Device Support Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> NFC functionality requires Chrome on Android or another NFC-enabled device.
          Desktop browsers may not support NFC operations.
        </p>
      </div>

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
        {activeTab === 'read' && <NFCReader />}
        {activeTab === 'write' && <NFCWriter />}
        {activeTab === 'bulk' && <NFCBulkAssign />}
      </div>

      {/* Information Section */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">📖 Read</h3>
          <p className="text-sm text-gray-600">
            Scan existing NFC tags to view their data and verify tag contents.
          </p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">✏️ Write</h3>
          <p className="text-sm text-gray-600">
            Program blank NFC tags with bin and item codes for your inventory system.
          </p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">📊 Bulk</h3>
          <p className="text-sm text-gray-600">
            Assign NFC tag codes to multiple inventory items using CSV import.
          </p>
        </div>
      </div>
    </div>
  )
}
