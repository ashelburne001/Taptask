import { useState } from 'react'
import { Wifi, AlertCircle, CheckCircle } from 'lucide-react'
import { FormField } from '../shared'
import { useNFC, type NFCTagData } from '../../../hooks/useNFC'

export default function NFCWriter() {
  const { isSupported, writing, error, writeTag, clearError } = useNFC()
  const [tagType, setTagType] = useState<'bin' | 'item'>('bin')
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleWrite() {
    clearError()
    setSuccess(false)

    if (!code.trim()) {
      return
    }

    const data: NFCTagData = {
      type: tagType,
      code: code.trim(),
      name: name.trim() || undefined,
      quantity: quantity ? Number(quantity) : undefined,
      timestamp: Date.now(),
    }

    const result = await writeTag(data)
    if (result) {
      setSuccess(true)
      setCode('')
      setName('')
      setQuantity('')
      setTimeout(() => setSuccess(false), 5000)
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
        <h2 className="text-xl font-bold text-gray-900">NFC Tag Writer</h2>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          Write data to a blank NFC tag. Have the tag ready and tap it to your device when prompted.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Error writing tag</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Tag written successfully!</p>
            <p className="text-sm mt-1">The NFC tag has been programmed with the data.</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Tag Type"
            name="tagType"
            type="select"
            value={tagType}
            onChange={(value) => setTagType(value as 'bin' | 'item')}
            options={[
              { label: 'Bin', value: 'bin' },
              { label: 'Item', value: 'item' },
            ]}
          />

          <FormField
            label="Code"
            name="code"
            type="text"
            value={code}
            onChange={(value) => setCode(value as string)}
            placeholder="BIN-001 or ITEM-12345"
            required
          />
        </div>

        <FormField
          label="Name (Optional)"
          name="name"
          type="text"
          value={name}
          onChange={(value) => setName(value as string)}
          placeholder="e.g., Surgical Supplies Bin"
        />

        {tagType === 'item' && (
          <FormField
            label="Quantity (Optional)"
            name="quantity"
            type="number"
            value={quantity}
            onChange={(value) => setQuantity(value as string)}
            placeholder="Number of units"
          />
        )}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Tag Data Preview</h3>
        <div className="p-3 bg-gray-100 rounded font-mono text-xs text-gray-700 overflow-auto">
          <pre>
            {JSON.stringify(
              {
                type: tagType,
                code: code || 'CODE',
                name: name || undefined,
                quantity: quantity ? Number(quantity) : undefined,
                timestamp: new Date().toISOString(),
              },
              null,
              2
            )}
          </pre>
        </div>
      </div>

      <button
        onClick={handleWrite}
        disabled={writing || !code.trim()}
        className="px-6 py-3 bg-brand-accentblue text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2 w-full justify-center"
      >
        <Wifi className="w-5 h-5" />
        {writing ? 'Writing to tag...' : 'Write to NFC Tag'}
      </button>
    </div>
  )
}
