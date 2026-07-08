import { useNavigate } from 'react-router-dom'
import { Home, AlertCircle } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-navy to-blue-900 flex items-center justify-center p-4">
      <div className="text-center">
        <AlertCircle className="w-20 h-20 text-white mx-auto mb-6 opacity-80" />
        <h1 className="text-5xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-blue-100 mb-2">Page Not Found</h2>
        <p className="text-blue-200 mb-8">The page you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </button>
      </div>
    </div>
  )
}
