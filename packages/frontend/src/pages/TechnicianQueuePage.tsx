import { useState, useEffect } from 'react'
import { apiClient } from '../api/client'
import { useAuthStore } from '../store/authStore'
import { Clock, AlertCircle, CheckCircle, Zap, Loader } from 'lucide-react'

interface Request {
  id: string
  binCode: string
  itemName: string
  requestType: string
  status: string
  quantityRequested: number
  quantityFilled: number
  employeeName: string
  technicianName?: string
  departmentName: string
  priority: string
  requestedAt: string
  completedAt?: string
  notes?: string
}

export default function TechnicianQueuePage() {
  const { user } = useAuthStore()
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<'pending' | 'in_progress' | 'completed'>('pending')
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchRequests()
  }, [])

  async function fetchRequests() {
    try {
      setLoading(true)
      const { requests } = await apiClient.listRequests()
      setRequests(requests)
    } catch (err) {
      console.error('Failed to fetch requests:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleAccept(requestId: string) {
    try {
      setSubmitting(true)
      await apiClient.updateRequest(requestId, {
        status: 'assigned',
        assignedTechnicianId: user?.id,
      })
      await fetchRequests()
    } catch (err) {
      console.error('Failed to accept request:', err)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleStart(requestId: string) {
    try {
      setSubmitting(true)
      await apiClient.updateRequest(requestId, { status: 'in_progress' })
      await fetchRequests()
    } catch (err) {
      console.error('Failed to start request:', err)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleComplete(requestId: string, quantityFilled: number) {
    try {
      setSubmitting(true)
      await apiClient.updateRequest(requestId, {
        status: 'completed',
        quantityFilled,
      })
      await fetchRequests()
      setSelectedRequest(null)
    } catch (err) {
      console.error('Failed to complete request:', err)
    } finally {
      setSubmitting(false)
    }
  }

  function getPriorityColor(priority: string) {
    const colors: Record<string, string> = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      normal: 'bg-blue-100 text-blue-800',
      low: 'bg-gray-100 text-gray-800',
    }
    return colors[priority] || colors.normal
  }

  function getStatusIcon(status: string) {
    const icons: Record<string, React.ReactNode> = {
      pending: <Clock className="w-5 h-5 text-yellow-600" />,
      assigned: <Zap className="w-5 h-5 text-blue-600" />,
      in_progress: <Loader className="w-5 h-5 animate-spin text-green-600" />,
      completed: <CheckCircle className="w-5 h-5 text-green-600" />,
    }
    return icons[status] || icons.pending
  }

  const filteredRequests = requests.filter((r) => {
    if (selectedTab === 'pending') return r.status === 'pending'
    if (selectedTab === 'in_progress') return r.status === 'in_progress' || r.status === 'assigned'
    return r.status === 'completed'
  })

  return (
    <div className="min-h-screen bg-gray-50 safe-area">
      {/* Header */}
      <div className="bg-brand-navy text-white p-6 sticky top-0 z-10">
        <h1 className="text-2xl font-bold">Refill Queue</h1>
        <p className="text-blue-200">Technician: {user?.name}</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-10">
        <div className="max-w-4xl mx-auto flex">
          {[
            { id: 'pending', label: 'Pending', count: requests.filter((r) => r.status === 'pending').length },
            {
              id: 'in_progress',
              label: 'In Progress',
              count: requests.filter((r) => r.status === 'in_progress' || r.status === 'assigned').length,
            },
            { id: 'completed', label: 'Completed', count: requests.filter((r) => r.status === 'completed').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex-1 py-4 font-medium border-b-2 transition ${
                selectedTab === tab.id
                  ? 'border-brand-navy text-brand-navy'
                  : 'border-transparent text-gray-600'
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-200 rounded-full px-2 py-1 text-sm">{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4">
        {loading ? (
          <div className="text-center py-12">
            <Loader className="w-12 h-12 animate-spin text-brand-accentblue mx-auto mb-4" />
            <p className="text-gray-600">Loading requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No requests in this category</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer border-l-4 border-brand-accentblue"
                onClick={() => setSelectedRequest(selectedRequest === request.id ? null : request.id)}
              >
                <div className="p-4 md:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(request.status)}
                        <h3 className="font-bold text-gray-900 text-lg truncate">
                          {request.itemName}
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Bin</p>
                          <p className="font-medium text-gray-900">{request.binCode}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Department</p>
                          <p className="font-medium text-gray-900">{request.departmentName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Quantity</p>
                          <p className="font-medium text-gray-900">{request.quantityRequested}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Priority</p>
                          <span className={`badge ${getPriorityColor(request.priority)}`}>
                            {request.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedRequest === request.id && (
                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Requested by</p>
                          <p className="font-medium text-gray-900">{request.employeeName}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Requested at</p>
                          <p className="font-medium text-gray-900">
                            {new Date(request.requestedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {request.notes && (
                        <div>
                          <p className="text-gray-600 text-sm">Notes</p>
                          <p className="bg-blue-50 p-3 rounded text-gray-800">{request.notes}</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-3 pt-4">
                        {request.status === 'pending' && (
                          <button
                            onClick={() => handleAccept(request.id)}
                            disabled={submitting}
                            className="btn-success"
                          >
                            Accept Request
                          </button>
                        )}

                        {request.status === 'assigned' && (
                          <button
                            onClick={() => handleStart(request.id)}
                            disabled={submitting}
                            className="btn-primary"
                          >
                            Start Filling
                          </button>
                        )}

                        {request.status === 'in_progress' && (
                          <button
                            onClick={() => handleComplete(request.id, request.quantityRequested)}
                            disabled={submitting}
                            className="btn-success"
                          >
                            Mark Complete
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
