import { useState, useCallback } from 'react'
import { apiClient } from '../api/client'

export interface DepartmentData {
  id: string
  code: string
  name: string
  location?: string
  isActive: boolean
}

export interface CreateDepartmentData {
  code: string
  name: string
  location?: string
}

export interface UpdateDepartmentData {
  code?: string
  name?: string
  location?: string
  isActive?: boolean
}

interface UseDepartmentsReturn {
  departments: DepartmentData[]
  loading: boolean
  error: string | null
  fetchDepartments: (search?: string) => Promise<void>
  createDepartment: (data: CreateDepartmentData) => Promise<string>
  updateDepartment: (deptId: string, data: UpdateDepartmentData) => Promise<void>
  deleteDepartment: (deptId: string) => Promise<void>
  clearError: () => void
}

export function useDepartments(): UseDepartmentsReturn {
  const [departments, setDepartments] = useState<DepartmentData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDepartments = useCallback(async (search?: string) => {
    try {
      setLoading(true)
      setError(null)
      const { departments: data } = await apiClient.listDepartments()

      // Filter by search if provided
      const filtered = search
        ? data.filter(
            (d: any) =>
              d.code.toLowerCase().includes(search.toLowerCase()) ||
              d.name.toLowerCase().includes(search.toLowerCase())
          )
        : data

      setDepartments(filtered)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch departments')
    } finally {
      setLoading(false)
    }
  }, [])

  const createDepartment = useCallback(async (data: CreateDepartmentData): Promise<string> => {
    try {
      setError(null)
      const result = await apiClient.createDepartment(data)
      await fetchDepartments()
      return result.id
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to create department'
      setError(errorMsg)
      throw new Error(errorMsg)
    }
  }, [fetchDepartments])

  const updateDepartment = useCallback(async (deptId: string, data: UpdateDepartmentData) => {
    try {
      setError(null)
      await apiClient.updateDepartment(deptId, data)
      await fetchDepartments()
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to update department'
      setError(errorMsg)
      throw new Error(errorMsg)
    }
  }, [fetchDepartments])

  const deleteDepartment = useCallback(async (deptId: string) => {
    try {
      setError(null)
      await apiClient.deleteDepartment(deptId)
      await fetchDepartments()
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to delete department'
      setError(errorMsg)
      throw new Error(errorMsg)
    }
  }, [fetchDepartments])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    departments,
    loading,
    error,
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    clearError,
  }
}
