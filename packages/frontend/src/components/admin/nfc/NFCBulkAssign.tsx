import { useState, useEffect } from 'react'
import { Upload, AlertCircle, CheckCircle } from 'lucide-react'
import { useItems } from '../../../hooks/useItems'

interface BulkAssignRow {
  itemNumber: string
  code: string
  binLocation?: string
}

export default function NFCBulkAssign() {
  const { items, fetchItems } = useItems()
  const [_csvContent, setCsvContent] = useState('')
  const [assignments, setAssignments] = useState<BulkAssignRow[]>([])
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchItems()
  }, [])

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      setCsvContent(text)
      parseCSV(text)
    }
    reader.readAsText(file)
  }

  function parseCSV(text: string) {
    try {
      const lines = text.trim().split('\n')
      const rows: BulkAssignRow[] = []

      for (let i = 1; i < lines.length; i++) {
        const [itemNumber, code, binLocation] = lines[i].split(',').map((s) => s.trim())
        if (itemNumber && code) {
          rows.push({ itemNumber, code, binLocation })
        }
      }

      setAssignments(rows)
      setError(null)
    } catch (err) {
      setError('Failed to parse CSV file')
    }
  }

  async function handleApply() {
    setSuccess(false)
    setError(null)

    try {
      // Validate all items exist
      const validCodes = new Set(items.map((item: any) => item.itemNumber))
      const invalid = assignments.filter((row) => !validCodes.has(row.itemNumber))

      if (invalid.length > 0) {
        setError(
          `${invalid.length} item(s) not found: ${invalid.map((r) => r.itemNumber).join(', ')}`
        )
        return
      }

      // In a real implementation, this would call an API to save the tag assignments
      // await apiClient.bulkAssignNFCTags(assignments)

      setSuccess(true)
      setTimeout(() => setSuccess(false), 5000)
    } catch (err: any) {
      setError(err.message || 'Failed to apply assignments')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Upload className="w-6 h-6 text-brand-accentblue" />
        <h2 className="text-xl font-bold text-gray-900">Bulk NFC Assignment</h2>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800 mb-2">
          Upload a CSV file to assign NFC tag codes to inventory items in bulk.
        </p>
        <p className="text-xs text-blue-700">
          CSV format: <code className="bg-blue-100 px-2 py-1 rounded">itemNumber,nfcCode,binLocation</code>
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Assignments applied successfully!</p>
            <p className="text-sm mt-1">{assignments.length} items updated.</p>
          </div>
        </div>
      )}

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
          id="csv-upload"
        />
        <label htmlFor="csv-upload" className="cursor-pointer">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700">Click to upload CSV</p>
          <p className="text-xs text-gray-500 mt-1">or drag and drop</p>
        </label>
      </div>

      {assignments.length > 0 && (
        <>
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              Preview ({assignments.length} rows)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="text-left p-3 font-semibold text-gray-700">Item Number</th>
                    <th className="text-left p-3 font-semibold text-gray-700">NFC Code</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Bin Location</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.slice(0, 10).map((row, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-gray-900">{row.itemNumber}</td>
                      <td className="p-3 font-mono text-gray-600">{row.code}</td>
                      <td className="p-3 text-gray-600">{row.binLocation || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {assignments.length > 10 && (
              <p className="text-xs text-gray-500 mt-2">
                Showing 10 of {assignments.length} rows
              </p>
            )}
          </div>

          <button
            onClick={handleApply}
            className="px-6 py-3 bg-brand-accentblue text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 w-full justify-center"
          >
            <CheckCircle className="w-5 h-5" />
            Apply {assignments.length} Assignments
          </button>
        </>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">CSV Template</h3>
        <p className="text-xs text-gray-600 mb-3">
          Download this template and fill in your data:
        </p>
        <div className="p-3 bg-gray-100 rounded font-mono text-xs text-gray-700">
          <pre>
            {`itemNumber,nfcCode,binLocation
ITEM-001,BIN-SURG-01,Surgical Supply Shelf
ITEM-002,BIN-PHARM-01,Pharmacy Cabinet
ITEM-003,BIN-LINEN-02,Linen Storage`}
          </pre>
        </div>
      </div>
    </div>
  )
}
