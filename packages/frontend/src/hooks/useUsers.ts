import { useState, useCallback } from 'react'
import { apiClient } from '../api/client'

export interface UserData {
  id: string
  email: string
  name: string
  role: 'employee' | 'technician' | 'supervisor' | 'admin'
  departmentId?: string
  isActive: boolean
  lastLogin?: string
}

export interface CreateUserData {
  email: string
  name: string
  password: string
  role: string
  departmentId?: string
}

export interface UpdateUserData {
  name?: string
  email?: string
  role?: string
  departmentId?: string
  isActive?: boolean
}

interface UseUsersReturn {
  users: UserData[]
  loading: boolean
  error: string | null
  fetchUsers: (search?: string, role?: string, departmentId?: string) => Promise<void>
  createUser: (data: CreateUserData) => Promise<string>
  updateUser: (userId: string, data: UpdateUserData) => Promise<void>
  deleteUser: (userId: string) => Promise<void>
  clearError: () => void
}

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async (search?: string, role?: string, departmentId?: string) => {
    try {
      setLoading(true)
      setError(null)
      const { users: data } = await apiClient.listUsers(role, search, departmentId)
      setUsers(data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }, [])

  const createUser = useCallback(async (data: CreateUserData): Promise<string> => {
    try {
      setError(null)
      const result = await apiClient.createUser(data)
      await fetchUsers()
      return result.id
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to create user'
      setError(errorMsg)
      throw new Error(errorMsg)
    }
  }, [fetchUsers])

  const updateUser = useCallback(async (userId: string, data: UpdateUserData) => {
    try {
      setError(null)
      await apiClient.updateUser(userId, data)
      await fetchUsers()
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to update user'
      setError(errorMsg)
      throw new Error(errorMsg)
    }
  }, [fetchUsers])

  const deleteUser = useCallback(async (userId: string) => {
    try {
      setError(null)
      await apiClient.deleteUser(userId)
      await fetchUsers()
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to delete user'
      setError(errorMsg)
      throw new Error(errorMsg)
    }
  }, [fetchUsers])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    clearError,
  }
}
