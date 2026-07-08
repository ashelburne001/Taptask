import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiClient } from '../api/client'
import { useAuthStore } from '../store/authStore'
import { Loader, AlertCircle, Camera, Package } from 'lucide-react'

interface Bin {
  id: string
  code: string
  itemName: string
  itemNumber: string
  gtin: string
  unitOfMeasure: string
  parLevel: number
  currentQuantity: number
  binSize: number
  departmentName: string
  departmentCode: string
  shelfLocation: string
  warehouseLocation: string
}

export default function TapPage() {
  const { binCode } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [bin, setBin] = useState<Bin | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (binCode) {
      fetchBin(binCode)
    }
  }, [binCode])

  async function fetchBin(code: string) {
    try {
      setLoading(true)
      setError('')
      const { bin } = await apiClient.getBin(code)
      setBin(bin)
      // Auto-navigate to refill form after 1 second
      setTimeout(() => {
        navigate(`/request?binId=${bin.id}`)
      }, 1000)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Bin not found')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-navy to-blue-900 flex items-center justify-center p-4">
        <div className="text-center text-white">
          <Loader className="w-12 h-12 animate-spin mb-4 mx-auto" />
          <h2 className="text-xl font-semibold mb-2">Reading NFC Tag...</h2>
          <p className="text-blue-200">Please wait</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-navy to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Tag Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-navy to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="text-center">
          <Package className="w-12 h-12 text-brand-accentblue mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {bin?.itemName}
          </h2>
          <p className="text-gray-600 mb-6">
            {bin?.departmentName} • {bin?.binSize} units
          </p>
          <Loader className="w-8 h-8 animate-spin mx-auto text-brand-accentblue" />
        </div>
      </div>
    </div>
  )
}
