import { useState } from 'react'
import { Wifi, AlertCircle, CheckCircle } from 'lucide-react'
import { useNFC, type NFCTagData } from '../../../hooks/useNFC'

export default function NFCReader() {
  const { isSupported, reading, error, readTag, clearError } = useNFC()
  const [lastRead, setLastRead] = useState<NFCTagData | null>(null)

  async function handleRead() {
    clearError()
    const data = await readTag()
    if (data) {
      setLastRead(data)
    }
  }

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <p className="text-yellow-800">
          NFC is not supported on this device. Please use Chrome on Android or another NFC-enabled device.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Wifi className="w-6 h-6 text-brand-accentblue" />
        <h2 className="text-xl font-bold text-gray-900">NFC Tag Reader</h2>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          Tap an NFC tag to your device to read its contents. The tag must contain valid TapTask data.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Error reading tag</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      <button
        onClick={handleRead}
        disabled={reading}
        className="px-6 py-3 bg-brand-accentblue text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
      >
        <Wifi className="w-5 h-5" />
        {reading ? 'Waiting for tag...' : 'Read NFC Tag'}
      </button>

      {lastRead && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">Tag Data</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Type</p>
              <p className="font-medium text-gray-900 capitalize">{lastRead.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Code</p>
              <p className="font-medium text-gray-900">{lastRead.code}</p>
            </div>
            {lastRead.name && (
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium text-gray-900">{lastRead.name}</p>
              </div>
            )}
            {lastRead.quantity && (
              <div>
                <p className="text-sm text-gray-600">Quantity</p>
                <p className="font-medium text-gray-900">{lastRead.quantity}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600">Written</p>
              <p className="font-medium text-gray-900">
                {new Date(lastRead.timestamp).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-100 rounded font-mono text-xs text-gray-700 overflow-auto">
            <pre>{JSON.stringify(lastRead, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  )
}
