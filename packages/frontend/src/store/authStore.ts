import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name: string
  role: 'employee' | 'technician' | 'supervisor' | 'admin'
  departmentId?: string
}

interface AuthStore {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (token, user) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
      storage: typeof window !== 'undefined' ? localStorage : undefined,
    }
  )
)
