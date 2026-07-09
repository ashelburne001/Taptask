import { useState } from 'react'
import { Upload, AlertCircle, CheckCircle } from 'lucide-react'
import { AdminModal } from '../shared'
import { apiClient } from '../../../api/client'

interface ItemsImportModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

interface CsvRow {
  [key: string]: string
}

interface ImportResult {
  created: number
  updated: number
  errors: string[]
}

export default function ItemsImportModal({
  isOpen,
  onClose,
  onSuccess,
}: ItemsImportModalProps) {
  const [step, setStep] = useState<'upload' | 'preview' | 'importing'>('upload')
  const [_file, setFile] = useState<File | null>(null)
  const [csvData, setCsvData] = useState<CsvRow[]>([])
  const [columnMap, setColumnMap] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<string[]>([])
  const [result, setResult] = useState<ImportResult | null>(null)
  const [loading, setLoading] = useState(false)

  const EXPECTED_COLUMNS = [
    'Item_Number',
    'Item_Name',
    'Description',
    'UPC',
    'GTIN',
    'Unit_of_Measure',
    'PAR_Level',
    'Bin_Size',
  ]

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.name.endsWith('.csv')) {
      setErrors(['Only CSV files are supported'])
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string
        const lines = csv.split('\n').filter((line) => line.trim())
        const headers = lines[0].split(',').map((h) => h.trim())
        const data = lines.slice(1).map((line) => {
          const values = line.split(',').map((v) => v.trim())
          return headers.reduce(
            (obj, header, i) => {
              obj[header] = values[i] || ''
              return obj
            },
            {} as CsvRow
          )
        })

        setFile(selectedFile)
        setCsvData(data)
        setErrors([])

        // Auto-map common headers
        const map: Record<string, string> = {}
        const headerLower = headers.map((h) => h.toLowerCase())
        EXPECTED_COLUMNS.forEach((expected) => {
          const idx = headerLower.findIndex(
            (h) =>
              h === expected.toLowerCase() ||
              h === expected.toLowerCase().replace(/_/g, ' ') ||
              h === expected.toLowerCase().replace(/_/g, '-')
          )
          if (idx !== -1) {
            map[expected] = headers[idx]
          }
        })

        setColumnMap(map)
        setStep('preview')
      } catch (error) {
        setErrors(['Failed to parse CSV file'])
      }
    }
    reader.readAsText(selectedFile)
  }

  async function handleImport() {
    setLoading(true)
    try {
      const itemsToImport = csvData.slice(0, 100).map((row) => ({
        itemNumber: row[columnMap['Item_Number'] || 'Item_Number'] || '',
        name: row[columnMap['Item_Name'] || 'Item_Name'] || '',
        description: row[columnMap['Description'] || 'Description'],
        upc: row[columnMap['UPC'] || 'UPC'],
        gtin: row[columnMap['GTIN'] || 'GTIN'],
        unitOfMeasure: row[columnMap['Unit_of_Measure'] || 'Unit_of_Measure'] || 'Unit',
        parLevel: parseInt(row[columnMap['PAR_Level'] || 'PAR_Level'] || '10') || 10,
        binSize: parseInt(row[columnMap['Bin_Size'] || 'Bin_Size'] || '50') || 50,
      }))

      // Validate required fields
      const validItems = itemsToImport.filter((item) => {
        if (!item.itemNumber || !item.name) {
          return false
        }
        return true
      })

      const importErrors: string[] = []
      let created = 0
      let updated = 0

      // Simple import - just create items (in production, would need to check for duplicates)
      for (const item of validItems) {
        try {
          await apiClient.createItem(item)
          created++
        } catch (err: any) {
          importErrors.push(
            `${item.itemNumber}: ${err.response?.data?.error || 'Failed to create'}`
          )
        }
      }

      setStep('importing')
      setResult({
        created,
        updated,
        errors: importErrors,
      })

      setTimeout(() => {
        onSuccess()
        handleClose()
      }, 2000)
    } catch (error) {
      setErrors(['Import failed'])
    } finally {
      setLoading(false)
    }
  }

  function handleClose() {
    setStep('upload')
    setFile(null)
    setCsvData([])
    setColumnMap({})
    setErrors([])
    setResult(null)
    onClose()
  }

  return (
    <AdminModal
      isOpen={isOpen}
      title="Import Items from CSV"
      onClose={handleClose}
      onSubmit={step === 'preview' ? handleImport : undefined}
      submitLabel="Import Items"
      loading={loading}
      size="lg"
    >
      {step === 'upload' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 mb-2">
              <strong>CSV Format:</strong> Expected columns (optional):
            </p>
            <code className="text-xs text-blue-700 block">
              Item_Number, Item_Name, Description, UPC, GTIN, Unit_of_Measure, PAR_Level,
              Bin_Size
            </code>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <label className="cursor-pointer block">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-lg font-medium text-gray-900 mb-1">Drag and drop CSV file</p>
              <p className="text-sm text-gray-600 mb-4">or click to select file</p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {errors.map((error, i) => (
            <div
              key={i}
              className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          ))}
        </div>
      )}

      {step === 'preview' && csvData.length > 0 && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              Found {csvData.length} rows. Showing first 5 items:
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Number</th>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">UPC</th>
                  <th className="px-3 py-2 text-left">PAR</th>
                </tr>
              </thead>
              <tbody>
                {csvData.slice(0, 5).map((row, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-3 py-2 font-mono">
                      {row[columnMap['Item_Number'] || 'Item_Number']}
                    </td>
                    <td className="px-3 py-2">
                      {row[columnMap['Item_Name'] || 'Item_Name']}
                    </td>
                    <td className="px-3 py-2 text-gray-600">
                      {row[columnMap['UPC'] || 'UPC']}
                    </td>
                    <td className="px-3 py-2">
                      {row[columnMap['PAR_Level'] || 'PAR_Level']}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {csvData.length > 5 && (
            <p className="text-sm text-gray-600 text-center">
              ... and {csvData.length - 5} more items
            </p>
          )}
        </div>
      )}

      {step === 'importing' && result && (
        <div className="space-y-4 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
          <div>
            <p className="text-lg font-bold text-gray-900 mb-1">Import Complete</p>
            <p className="text-sm text-gray-600 mb-4">
              Created {result.created} items
              {result.updated > 0 && `, Updated ${result.updated} items`}
            </p>
            {result.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-left">
                <p className="text-sm font-medium text-red-800 mb-2">
                  {result.errors.length} errors:
                </p>
                <ul className="text-xs text-red-700 space-y-1">
                  {result.errors.slice(0, 5).map((err, i) => (
                    <li key={i}>• {err}</li>
                  ))}
                  {result.errors.length > 5 && (
                    <li>... and {result.errors.length - 5} more</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminModal>
  )
}
