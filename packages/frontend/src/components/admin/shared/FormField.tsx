import { ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'

interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'toggle'
  value: string | number | boolean
  onChange: (value: string | number | boolean) => void
  placeholder?: string
  required?: boolean
  error?: string
  disabled?: boolean
  options?: { label: string; value: string }[]
  helpText?: string
  children?: ReactNode
}

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  disabled = false,
  options = [],
  helpText,
  children,
}: FormFieldProps) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accentblue disabled:bg-gray-100 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          rows={4}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accentblue disabled:bg-gray-100 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select {label}...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === 'toggle' ? (
        <button
          type="button"
          onClick={() => onChange(!value)}
          disabled={disabled}
          className={`w-14 h-8 rounded-full transition flex items-center ${
            value ? 'bg-green-600' : 'bg-gray-300'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div
            className={`w-7 h-7 bg-white rounded-full shadow-md transition transform ${
              value ? 'translate-x-7' : 'translate-x-0'
            }`}
          />
        </button>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accentblue disabled:bg-gray-100 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {helpText && !error && (
        <p className="text-gray-500 text-sm mt-2">{helpText}</p>
      )}

      {children}
    </div>
  )
}
