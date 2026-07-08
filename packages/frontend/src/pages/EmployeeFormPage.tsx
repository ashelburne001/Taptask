import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { apiClient } from '../api/client'
import { useAuthStore } from '../store/authStore'
import { CheckCircle, AlertCircle, Camera, Plus, Minus } from 'lucide-react'

interface Bin {
  id: string
  code: string
  itemName: string
  itemNumber: string
  gtin: string
  parLevel: number
  currentQuantity: number
  departmentName: string
}

export default function EmployeeFormPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const binId = searchParams.get('binId')

  const [bin, setBin] = useState<Bin | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [requestType, setRequestType] = useState<'refill' | 'partial_refill' | 'damaged'>('refill')
  const [quantity, setQuantity] = useState(0)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (!binId) {
      setError('No bin selected')
      setLoading(false)
      return
    }
    // Fetch bin details from database using binId
    // For now, we'll simulate loading
    fetchBinDetails()
  }, [binId])

  async function fetchBinDetails() {
    try {
      // In a real scenario, we'd fetch from API
      setLoading(false)
    } catch (err) {
      setError('Failed to load bin details')
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!binId || !user) return

    setSubmitting(true)
    setError('')

    try {
      await apiClient.createRequest(binId, requestType, quantity || undefined, notes || undefined)
      setSuccess(true)
      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit request')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
          <p className="text-gray-600 mb-6">A technician will process your request shortly.</p>
          <p className="text-sm text-gray-500">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 safe-area pb-6">
      <div className="bg-brand-navy text-white p-6 sticky top-0 z-10">
        <h1 className="text-2xl font-bold">Submit Refill Request</h1>
        <p className="text-blue-200">{user?.name}</p>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-600 rounded">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Request Type Selection */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Request Type</h2>
            <div className="space-y-3">
              {[
                { value: 'refill', label: '✅ Request Full Refill', color: 'bg-green-100 border-green-300' },
                { value: 'partial_refill', label: '⚠ Partial Refill Needed', color: 'bg-yellow-100 border-yellow-300' },
                { value: 'damaged', label: '❌ Damaged Bin', color: 'bg-red-100 border-red-300' },
              ].map((type) => (
                <label key={type.value} className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                  requestType === type.value
                    ? type.color
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="requestType"
                    value={type.value}
                    checked={requestType === type.value as any}
                    onChange={(e) => setRequestType(e.target.value as any)}
                    className="mr-3"
                  />
                  {type.label}
                </label>
              ))}
            </div>
          </div>

          {/* Quantity Input */}
          {requestType !== 'damaged' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quantity</h2>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(0, quantity - 1))}
                  className="btn-small bg-gray-200 text-gray-700 min-h-12"
                >
                  <Minus className="w-6 h-6" />
                </button>
                <input
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                  className="input-field text-center flex-1 text-2xl font-bold"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="btn-small bg-green-600 text-white min-h-12"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes (Optional)</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-field"
              placeholder="Add any additional notes..."
              rows={3}
            />
          </div>

          {/* Photo Upload */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">📷 Photo (Optional)</h2>
            <button
              type="button"
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" />
              Take Photo
            </button>
            <p className="text-sm text-gray-600 mt-3">
              Helpful for damaged items or unusual situations
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex-1"
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>

          {/* Auto-captured info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <p className="font-semibold mb-2">✓ Auto-captured:</p>
            <ul className="space-y-1 text-xs">
              <li>• Date & Time: {new Date().toLocaleString()}</li>
              <li>• User: {user?.name}</li>
              <li>• Device Location: Automatically recorded</li>
              <li>• IP Address: Automatically captured</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  )
}
